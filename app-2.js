async function loadFile(file){
  try{
    state.file=file;
    state.buffer=await file.arrayBuffer();
    state.type=detectType(file);
    state.meta={};
    state.raw={};
    state.editable=false;
    state.engine=t("genericEngine");

    if(state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    state.previewUrl=URL.createObjectURL(file);

    await parseCurrent();

    state.original=JSON.parse(JSON.stringify(state.meta));
    addHistory(t("fileLoaded"),file.name);
    renderAll();
    showPage("editor");
    toast(t("fileLoaded"),t("fileLoadedText"));
  }catch(err){
    console.error(err);
    toast(t("error"),err.message||String(err));
  }
}

async function parseCurrent(){
  switch(state.type){
    case "pdf": await parsePDF(); break;
    case "jpeg": await parseJPEG(); break;
    case "png": await parsePNG(); break;
    case "mp3": await parseMP3(); break;
    case "office": await parseOffice(); break;
    default: await parseGeneric(); break;
  }

  const standard={
    [t("mime")]:mimeOf(state.file),
    [t("size")]:humanSize(state.file.size),
    [t("extension")]:extOf(state.file.name)||"-",
    [t("modified")]:dateFmt(state.file.lastModified),
    [t("engine")]:state.engine
  };
  state.raw={...standard,...state.raw};
}

async function parseGeneric(){
  state.engine=t("genericEngine");
  state.editable=false;
  fieldsByType[state.type].forEach(k=>state.meta[k]="");
  state.raw["Format"]=state.type;
}

async function parsePDF(){
  if(!window.PDFLib) throw new Error("PDF-lib indisponible.");
  const doc=await PDFLib.PDFDocument.load(state.buffer,{updateMetadata:false});
  state.engine=t("pdfEngine");
  state.editable=true;

  state.meta={
    title:doc.getTitle()||"",
    author:doc.getAuthor()||"",
    subject:doc.getSubject()||"",
    keywords:(doc.getKeywords()||"").replace(/^"|"$/g,""),
    creator:doc.getCreator()||"",
    producer:doc.getProducer()||""
  };

  state.raw={
    [t("title")]:state.meta.title,
    [t("author")]:state.meta.author,
    [t("subject")]:state.meta.subject,
    [t("keywords")]:state.meta.keywords,
    [t("creator")]:state.meta.creator,
    [t("producer")]:state.meta.producer,
    [t("pages")]:doc.getPageCount()
  };
}

async function writePDF(meta){
  const doc=await PDFLib.PDFDocument.load(state.buffer,{updateMetadata:false});

  doc.setTitle(meta.title||"");
  doc.setAuthor(meta.author||"");
  doc.setSubject(meta.subject||"");
  doc.setKeywords((meta.keywords||"").split(/[,;]+/).map(x=>x.trim()).filter(Boolean));
  doc.setCreator(meta.creator||"");
  doc.setProducer(meta.producer||"");

  const bytes=await doc.save();
  return new Blob([bytes],{type:"application/pdf"});
}
async function parseJPEG(){
  if(!window.piexif) throw new Error("piexifjs indisponible.");
  state.engine=t("jpegEngine");
  state.editable=true;

  const binary=arrayBufferToBinaryString(state.buffer);
  let exif={};
  try{exif=piexif.load(binary)}catch{}

  const z=exif["0th"]||{};
  const e=exif["Exif"]||{};
  const gps=exif["GPS"]||{};

  const readVal=(obj,key)=>obj[key]??"";
  state.meta={
    title:"",
    description:String(readVal(z,piexif.ImageIFD.ImageDescription)||""),
    artist:String(readVal(z,piexif.ImageIFD.Artist)||""),
    copyright:String(readVal(z,piexif.ImageIFD.Copyright)||""),
    software:String(readVal(z,piexif.ImageIFD.Software)||""),
    dateTime:String(readVal(e,piexif.ExifIFD.DateTimeOriginal)||readVal(z,piexif.ImageIFD.DateTime)||"")
  };

  state.raw={
    [t("description")]:state.meta.description,
    [t("artist")]:state.meta.artist,
    [t("copyright")]:state.meta.copyright,
    [t("software")]:state.meta.software,
    [t("dateTime")]:state.meta.dateTime
  };

  const make=readVal(z,piexif.ImageIFD.Make);
  const model=readVal(z,piexif.ImageIFD.Model);
  if(make||model) state.raw[t("device")]=`${make||""} ${model||""}`.trim();

  if(Object.keys(gps).length) state.raw[t("gps")]="EXIF GPS";
}

async function writeJPEG(meta,options={}){
  const binary=arrayBufferToBinaryString(state.buffer);
  let exif;
  try{exif=piexif.load(binary)}
  catch{exif={"0th":{},"Exif":{},"GPS":{},"Interop":{},"1st":{},"thumbnail":null}}

  exif["0th"]=exif["0th"]||{};
  exif["Exif"]=exif["Exif"]||{};
  exif["GPS"]=exif["GPS"]||{};

  const setOrDelete=(obj,key,value)=>{
    if(value) obj[key]=value;
    else delete obj[key];
  };

  setOrDelete(exif["0th"],piexif.ImageIFD.ImageDescription,meta.description||"");
  setOrDelete(exif["0th"],piexif.ImageIFD.Artist,meta.artist||"");
  setOrDelete(exif["0th"],piexif.ImageIFD.Copyright,meta.copyright||"");
  setOrDelete(exif["0th"],piexif.ImageIFD.Software,meta.software||"");
  setOrDelete(exif["Exif"],piexif.ExifIFD.DateTimeOriginal,meta.dateTime||"");

  if(options.cleanAuthor){
    delete exif["0th"][piexif.ImageIFD.Artist];
    delete exif["0th"][piexif.ImageIFD.Copyright];
  }
  if(options.cleanLocation){
    exif["GPS"]={};
  }
  if(options.cleanSoftware){
    delete exif["0th"][piexif.ImageIFD.Software];
    delete exif["0th"][piexif.ImageIFD.Make];
    delete exif["0th"][piexif.ImageIFD.Model];
  }
  if(options.cleanDates){
    delete exif["0th"][piexif.ImageIFD.DateTime];
    delete exif["Exif"][piexif.ExifIFD.DateTimeOriginal];
    delete exif["Exif"][piexif.ExifIFD.DateTimeDigitized];
  }

  const exifBytes=piexif.dump(exif);
  const out=piexif.insert(exifBytes,binary);
  return new Blob([binaryStringToUint8(out)],{type:"image/jpeg"});
}

function parsePngChunks(buffer){
  const bytes=new Uint8Array(buffer);
  if(bytes.length<8 || readAscii(bytes,1,3)!=="PNG") return [];
  let pos=8, chunks=[];
  while(pos+12<=bytes.length){
    const len=readU32BE(bytes,pos);
    const type=readAscii(bytes,pos+4,4);
    const data=bytes.slice(pos+8,pos+8+len);
    chunks.push({type,data,start:pos,length:len});
    pos+=12+len;
    if(type==="IEND") break;
  }
  return chunks;
}

async function parsePNG(){
  state.engine=t("pngEngine");
  state.editable=true;
  const chunks=parsePngChunks(state.buffer);

  const text={};
  for(const c of chunks){
    if(c.type==="tEXt"){
      const zero=c.data.indexOf(0);
      if(zero>=0){
        const key=decodeText(c.data.slice(0,zero));
        const val=decodeText(c.data.slice(zero+1));
        text[key]=val;
      }
    }
  }

  state.meta={
    title:text.Title||"",
    description:text.Description||"",
    author:text.Author||text.Artist||"",
    copyright:text.Copyright||"",
    software:text.Software||"",
    dateTime:text["Creation Time"]||text.DateTime||"",
    keywords:text.Keywords||""
  };

  state.raw={...text};
  const ihdr=chunks.find(x=>x.type==="IHDR");
  if(ihdr){
    const d=ihdr.data;
    const w=readU32BE(d,0),h=readU32BE(d,4);
    state.raw[t("dimensions")]=`${w} × ${h}`;
  }
}

function crc32(bytes){
  let c=0xffffffff;
  for(const b of bytes){
    c^=b;
    for(let k=0;k<8;k++) c=(c>>>1)^((c&1)?0xedb88320:0);
  }
  return (c^0xffffffff)>>>0;
}
function u32(n){return new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255])}
function makePngChunk(type,data){
  const tbytes=encodeText(type);
  const crcInput=new Uint8Array(tbytes.length+data.length);
  crcInput.set(tbytes);crcInput.set(data,tbytes.length);
  const out=new Uint8Array(12+data.length);
  out.set(u32(data.length),0);
  out.set(tbytes,4);
  out.set(data,8);
  out.set(u32(crc32(crcInput)),8+data.length);
  return out;
}
function makeTextChunk(key,value){
  const kb=encodeText(key),vb=encodeText(value);
  const data=new Uint8Array(kb.length+1+vb.length);
  data.set(kb,0);data[kb.length]=0;data.set(vb,kb.length+1);
  return makePngChunk("tEXt",data);
}

async function writePNG(meta,options={}){
  const bytes=new Uint8Array(state.buffer);
  const chunks=parsePngChunks(state.buffer);
  const managed=new Set(["Title","Description","Author","Artist","Copyright","Software","Creation Time","DateTime","Keywords"]);
  const parts=[bytes.slice(0,8)];

  const values={
    Title:meta.title||"",
    Description:meta.description||"",
    Author:options.cleanAuthor?"":(meta.author||""),
    Copyright:options.cleanAuthor?"":(meta.copyright||""),
    Software:options.cleanSoftware?"":(meta.software||""),
    "Creation Time":options.cleanDates?"":(meta.dateTime||""),
    Keywords:meta.keywords||""
  };

  let inserted=false;
  for(const c of chunks){
    if(c.type==="tEXt"){
      const zero=c.data.indexOf(0);
      const key=zero>=0?decodeText(c.data.slice(0,zero)):"";
      if(managed.has(key)) continue;
    }
    if(c.type==="IEND" && !inserted){
      for(const [k,v] of Object.entries(values)){
        if(v) parts.push(makeTextChunk(k,v));
      }
      inserted=true;
    }
    parts.push(bytes.slice(c.start,c.start+12+c.length));
  }

  return new Blob(parts,{type:"image/png"});
}

function synchsafeToInt(b0,b1,b2,b3){
  return (b0<<21)|(b1<<14)|(b2<<7)|b3;
}
function intToSynchsafe(n){
  return new Uint8Array([(n>>21)&0x7f,(n>>14)&0x7f,(n>>7)&0x7f,n&0x7f]);
}
function u32be(n){return new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255])}
function decodeId3Text(data){
  if(!data.length) return "";
  const enc=data[0],body=data.slice(1);
  try{
    if(enc===0) return new TextDecoder("iso-8859-1").decode(body).replace(/\0/g,"").trim();
    if(enc===3) return new TextDecoder("utf-8").decode(body).replace(/\0/g,"").trim();
    return new TextDecoder("utf-16").decode(body).replace(/\0/g,"").trim();
  }catch{return decodeText(body)}
}
function makeId3TextFrame(id,text){
  const payload=new Uint8Array(1+encodeText(text).length);
  payload[0]=3;payload.set(encodeText(text),1);
  const head=new Uint8Array(10);
  head.set(encodeText(id),0);head.set(u32be(payload.length),4);
  const out=new Uint8Array(head.length+payload.length);
  out.set(head);out.set(payload,head.length);
  return out;
}
