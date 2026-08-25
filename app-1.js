const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const state = {
  file:null,
  buffer:null,
  type:null,
  meta:{},
  raw:{},
  original:{},
  editable:false,
  engine:"-",
  previewUrl:null,
  batch:[],
  lang:localStorage.getItem("metadata-lang") || "fr",
  history:JSON.parse(localStorage.getItem("metadata-history") || "[]")
};

const i18n = {
fr:{
brandSub:"Portfolio tools",openFile:"+ Ouvrir un fichier",navHome:"Vue générale",navEditor:"Métadonnées",
navRaw:"Vue complète",navBatch:"Traitement par lot",navPrivacy:"Confidentialité",navHistory:"Historique",
navSettings:"Personnalisation",navAbout:"À propos",localOnly:"100 % local",
localOnlyText:"Les fichiers sont traités dans votre navigateur et ne sont jamais envoyés vers un serveur.",
noFile:"Aucun fichier sélectionné",customize:"Personnaliser",downloadEdited:"Télécharger le fichier modifié",
heroEyebrow:"Éditeur universel de métadonnées",heroTitle:"Vos fichiers, leurs métadonnées, un seul outil.",
heroLead:"Inspectez et modifiez les informations intégrées aux images, PDF, fichiers audio et documents Office. Le type de fichier est détecté automatiquement et l'interface s'adapte aux champs réellement pertinents.",
chooseFile:"Choisir un fichier",privacyAudit:"Analyser les données sensibles",dropTitle:"Glissez un fichier ici",
dropText:"ou cliquez pour le sélectionner. Le fichier reste sur votre appareil.",formats:"Images · PDF · Audio · Vidéo · Office",
currentFile:"Fichier courant",currentFileSub:"Détection automatique du format et du moteur d'édition.",
nothingLoaded:"Aucun fichier chargé",nothingLoadedText:"Ouvrez un fichier pour afficher son profil de métadonnées.",
statFields:"champs détectés",statEditable:"champs éditables",statSensitive:"éléments sensibles",statMode:"mode de traitement",
smartTitle:"Adaptatif",smartText:"Les champs changent selon le format : EXIF pour les images, propriétés documentaires pour les PDF et Office, ID3 pour les MP3.",
privacyTitle:"Confidentiel",privacyText:"Le traitement est effectué dans le navigateur. Aucun fichier n'est téléversé par l'application.",
safeTitle:"Réversible",safeText:"Le fichier original n'est jamais écrasé. Toute modification produit une nouvelle copie à télécharger.",
editorTitle:"Métadonnées",editorSub:"Les champs adaptés au fichier apparaîtront ici.",openToEdit:"Ouvrez un fichier pour commencer",
openToEditText:"L'éditeur déterminera automatiquement les propriétés disponibles.",resetFields:"Rétablir les valeurs",exportJson:"Exporter JSON",
previewTitle:"Aperçu",fileInfo:"Informations fichier",rawTitle:"Vue complète",rawSub:"Toutes les métadonnées détectées, y compris les propriétés en lecture seule.",
searchMetadata:"Rechercher une métadonnée",field:"Champ",value:"Valeur",batchTitle:"Traitement par lot",
batchSub:"Chargez plusieurs fichiers pour créer un inventaire de métadonnées.",addFiles:"Ajouter des fichiers",batchFiles:"Fichiers",
batchEmpty:"Aucun fichier dans le lot.",batchActions:"Actions",exportManifest:"Exporter l'inventaire JSON",exportCsv:"Exporter l'inventaire CSV",
clearBatch:"Vider la liste",batchNote:"L'analyse en lot reste locale. Aucun fichier n'est envoyé vers GitHub ou un serveur externe.",
privacyAuditTitle:"Confidentialité",privacyAuditSub:"Repérez rapidement les informations susceptibles d'identifier une personne, un appareil, un logiciel ou une localisation.",
sensitiveDetected:"Éléments sensibles détectés",privacyEmpty:"Chargez un fichier pour lancer l'analyse.",privacyActions:"Nettoyage",
cleanAuthor:"Identité et auteur",cleanAuthorText:"Auteur, artiste, créateur, dernière modification par.",
cleanLocation:"Localisation",cleanLocationText:"Coordonnées GPS et informations géographiques accessibles.",
cleanSoftware:"Logiciels et appareil",cleanSoftwareText:"Logiciel, modèle d'appareil, caméra et outils de production.",
cleanDates:"Dates intégrées",cleanDatesText:"Dates de création et de modification présentes dans les métadonnées.",
prepareClean:"Préparer une copie nettoyée",historyTitle:"Historique local",historySub:"Journal des opérations conservé uniquement dans ce navigateur.",
clearHistory:"Effacer l'historique",settingsTitle:"Personnalisation",settingsSub:"Les préférences sont mémorisées localement dans le navigateur.",
appearance:"Apparence",theme:"Thème",themeText:"Clair ou sombre.",light:"Clair",dark:"Sombre",palette:"Palette",
paletteText:"Vert Portfolio, cassis ou bleu.",language:"Langue",languageText:"Interface française ou anglaise.",accessibility:"Accessibilité",
highContrast:"Contraste renforcé",highContrastText:"Accentue les séparations et les éléments interactifs.",dyslexia:"Lecture facilitée",
dyslexiaText:"Espacement accru et police système plus lisible.",reduceMotion:"Réduire les animations",
reduceMotionText:"Limite les transitions de l'interface.",textSize:"Taille du texte",aboutTitle:"À propos",
aboutSub:"Une web-app locale pour inspecter, modifier et nettoyer les métadonnées.",
aboutText:"L'application détecte le type de fichier, génère un profil de champs pertinent et permet de télécharger une nouvelle copie lorsque le format peut être modifié de manière fiable directement dans le navigateur.",
browserLimits:"Les navigateurs n'offrent pas la même liberté qu'une application native : les formats vidéo, HEIC/RAW et certains conteneurs audio restent principalement consultables.",
supported:"Formats principaux",fileLoaded:"Fichier chargé",fileLoadedText:"Le profil de métadonnées a été généré.",
readOnly:"Lecture seule dans le navigateur",browserEditor:"Édition navigateur",downloadReady:"Copie modifiée prête",
compatReadOnly:"Ce format peut être inspecté dans cette web-app, mais sa réécriture complète n'est pas suffisamment fiable dans un navigateur.",
compatEditable:"Ce format peut être modifié directement dans le navigateur. Le fichier original ne sera jamais écrasé.",
savedHistory:"Téléchargement d'une copie modifiée",jsonHistory:"Export JSON des métadonnées",privacyHistory:"Création d'une copie nettoyée",
title:"Titre",author:"Auteur",subject:"Sujet",keywords:"Mots-clés",description:"Description",creator:"Créateur",
producer:"Producteur",artist:"Artiste",album:"Album",albumArtist:"Artiste de l'album",year:"Année / date",genre:"Genre",
track:"Piste",comment:"Commentaire",copyright:"Copyright",software:"Logiciel",dateTime:"Date / heure",
lastModifiedBy:"Dernière modification par",category:"Catégorie",company:"Société",manager:"Responsable",
mime:"Type MIME",size:"Taille",extension:"Extension",modified:"Dernière modification",engine:"Moteur",dimensions:"Dimensions",
pages:"Pages",duration:"Durée",unknown:"Inconnu",yes:"Oui",no:"Non",error:"Erreur",done:"Terminé",
metadataExported:"Les métadonnées ont été exportées.",selectFirst:"Sélectionnez d'abord un fichier.",
resetDone:"Les champs ont été restaurés.",editUnsupported:"La réécriture de ce format n'est pas disponible dans le navigateur.",
cleanUnsupported:"Le nettoyage automatique n'est pas disponible pour ce format dans le navigateur.",
cleanDone:"Une copie nettoyée a été créée.",clearHistoryConfirm:"Effacer l'historique local ?",
noSensitive:"Aucune donnée sensible évidente n'a été détectée dans les champs accessibles.",
gps:"Coordonnées GPS",device:"Appareil / caméra",identity:"Identité",technical:"Données techniques",dates:"Dates",
officeEngine:"Propriétés OpenXML",pdfEngine:"PDF Info",jpegEngine:"EXIF JPEG",pngEngine:"PNG text chunks",
mp3Engine:"ID3v2",genericEngine:"Inspection navigateur"
},
en:{
brandSub:"Portfolio tools",openFile:"+ Open file",navHome:"Overview",navEditor:"Metadata",navRaw:"Complete view",
navBatch:"Batch processing",navPrivacy:"Privacy",navHistory:"History",navSettings:"Customization",navAbout:"About",
localOnly:"100% local",localOnlyText:"Files are processed in your browser and are never uploaded to a server.",
noFile:"No file selected",customize:"Customize",downloadEdited:"Download edited file",
heroEyebrow:"Universal metadata editor",heroTitle:"Your files, their metadata, one tool.",
heroLead:"Inspect and edit information embedded in images, PDFs, audio files and Office documents. The file type is detected automatically and the interface adapts to relevant fields.",
chooseFile:"Choose a file",privacyAudit:"Analyze sensitive data",dropTitle:"Drop a file here",
dropText:"or click to select it. The file stays on your device.",formats:"Images · PDF · Audio · Video · Office",
currentFile:"Current file",currentFileSub:"Automatic file type and editing engine detection.",
nothingLoaded:"No file loaded",nothingLoadedText:"Open a file to display its metadata profile.",
statFields:"fields detected",statEditable:"editable fields",statSensitive:"sensitive items",statMode:"processing mode",
smartTitle:"Adaptive",smartText:"Fields change by format: EXIF for images, document properties for PDF and Office, ID3 for MP3.",
privacyTitle:"Private",privacyText:"Processing happens in the browser. The application does not upload your files.",
safeTitle:"Reversible",safeText:"The original file is never overwritten. Every edit creates a new downloadable copy.",
editorTitle:"Metadata",editorSub:"Fields adapted to the file will appear here.",openToEdit:"Open a file to start",
openToEditText:"The editor will automatically determine available properties.",resetFields:"Restore values",exportJson:"Export JSON",
previewTitle:"Preview",fileInfo:"File information",rawTitle:"Complete view",rawSub:"All detected metadata, including read-only properties.",
searchMetadata:"Search metadata",field:"Field",value:"Value",batchTitle:"Batch processing",
batchSub:"Load several files to create a metadata inventory.",addFiles:"Add files",batchFiles:"Files",
batchEmpty:"No files in the batch.",batchActions:"Actions",exportManifest:"Export JSON inventory",exportCsv:"Export CSV inventory",
clearBatch:"Clear list",batchNote:"Batch analysis remains local. No file is sent to GitHub or an external server.",
privacyAuditTitle:"Privacy",privacyAuditSub:"Quickly identify information that may reveal a person, device, software or location.",
sensitiveDetected:"Sensitive items detected",privacyEmpty:"Load a file to run the analysis.",privacyActions:"Cleanup",
cleanAuthor:"Identity and author",cleanAuthorText:"Author, artist, creator, last modified by.",
cleanLocation:"Location",cleanLocationText:"Accessible GPS coordinates and geographic information.",
cleanSoftware:"Software and device",cleanSoftwareText:"Software, device model, camera and production tools.",
cleanDates:"Embedded dates",cleanDatesText:"Creation and modification dates stored in metadata.",
prepareClean:"Prepare cleaned copy",historyTitle:"Local history",historySub:"Operation log stored only in this browser.",
clearHistory:"Clear history",settingsTitle:"Customization",settingsSub:"Preferences are stored locally in the browser.",
appearance:"Appearance",theme:"Theme",themeText:"Light or dark.",light:"Light",dark:"Dark",palette:"Palette",
paletteText:"Portfolio green, burgundy or blue.",language:"Language",languageText:"French or English interface.",accessibility:"Accessibility",
highContrast:"High contrast",highContrastText:"Strengthens separators and interactive elements.",dyslexia:"Reading aid",
dyslexiaText:"Increased spacing and a more readable system font.",reduceMotion:"Reduce motion",
reduceMotionText:"Limits interface transitions.",textSize:"Text size",aboutTitle:"About",
aboutSub:"A local web app to inspect, edit and clean metadata.",
aboutText:"The application detects the file type, generates a relevant field profile, and lets you download a new copy when the format can be edited reliably in the browser.",
browserLimits:"Browsers do not offer the same freedom as a native application: video, HEIC/RAW and some audio containers remain mainly inspectable.",
supported:"Main formats",fileLoaded:"File loaded",fileLoadedText:"The metadata profile has been generated.",
readOnly:"Read-only in browser",browserEditor:"Browser editing",downloadReady:"Edited copy ready",
compatReadOnly:"This format can be inspected in the web app, but full rewriting is not reliable enough in a browser.",
compatEditable:"This format can be edited directly in the browser. The original file will never be overwritten.",
savedHistory:"Downloaded edited copy",jsonHistory:"Exported metadata JSON",privacyHistory:"Created cleaned copy",
title:"Title",author:"Author",subject:"Subject",keywords:"Keywords",description:"Description",creator:"Creator",
producer:"Producer",artist:"Artist",album:"Album",albumArtist:"Album artist",year:"Year / date",genre:"Genre",
track:"Track",comment:"Comment",copyright:"Copyright",software:"Software",dateTime:"Date / time",
lastModifiedBy:"Last modified by",category:"Category",company:"Company",manager:"Manager",
mime:"MIME type",size:"Size",extension:"Extension",modified:"Last modified",engine:"Engine",dimensions:"Dimensions",
pages:"Pages",duration:"Duration",unknown:"Unknown",yes:"Yes",no:"No",error:"Error",done:"Done",
metadataExported:"Metadata were exported.",selectFirst:"Select a file first.",
resetDone:"Fields were restored.",editUnsupported:"Rewriting this format is not available in the browser.",
cleanUnsupported:"Automatic cleanup is not available for this format in the browser.",
cleanDone:"A cleaned copy was created.",clearHistoryConfirm:"Clear local history?",
noSensitive:"No obvious sensitive data was detected in accessible fields.",
gps:"GPS coordinates",device:"Device / camera",identity:"Identity",technical:"Technical data",dates:"Dates",
officeEngine:"OpenXML properties",pdfEngine:"PDF Info",jpegEngine:"JPEG EXIF",pngEngine:"PNG text chunks",
mp3Engine:"ID3v2",genericEngine:"Browser inspection"
}
};

function t(k){return i18n[state.lang]?.[k] ?? i18n.fr[k] ?? k}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function humanSize(bytes){
  let n=bytes,i=0,u=["B","KB","MB","GB","TB"];
  while(n>=1024 && i<u.length-1){n/=1024;i++}
  return `${n.toFixed(i?1:0)} ${u[i]}`
}
function extOf(name){
  const i=name.lastIndexOf(".");
  return i>=0?name.slice(i+1).toLowerCase():"";
}
function guessMime(ext){
  const m={
    pdf:"application/pdf",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",
    mp3:"audio/mpeg",wav:"audio/wav",flac:"audio/flac",ogg:"audio/ogg",
    m4a:"audio/mp4",mp4:"video/mp4",mov:"video/quicktime",webm:"video/webm",
    docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xlsm:"application/vnd.ms-excel.sheet.macroEnabled.12",
    pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation"
  };
  return m[ext]||"application/octet-stream";
}
function mimeOf(file){return file.type || guessMime(extOf(file.name))}
function dateFmt(ms){
  return new Intl.DateTimeFormat(state.lang==="fr"?"fr-FR":"en-GB",{dateStyle:"medium",timeStyle:"short"}).format(new Date(ms));
}
function outputName(name,suffix){
  const i=name.lastIndexOf(".");
  return i<0?name+suffix:name.slice(0,i)+suffix+name.slice(i);
}
function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function toast(title,text){
  const el=document.createElement("div");
  el.className="toast";
  el.innerHTML=`<strong>${esc(title)}</strong><span>${esc(text)}</span>`;
  $("#toastZone").appendChild(el);
  setTimeout(()=>el.remove(),4200);
}
function addHistory(action,file){
  state.history.unshift({action,file:file||state.file?.name||"",time:Date.now()});
  state.history=state.history.slice(0,60);
  localStorage.setItem("metadata-history",JSON.stringify(state.history));
  renderHistory();
}
function arrayBufferToBinaryString(buf){
  const bytes=new Uint8Array(buf);
  let out="";
  const step=0x8000;
  for(let i=0;i<bytes.length;i+=step){
    out+=String.fromCharCode(...bytes.subarray(i,Math.min(i+step,bytes.length)));
  }
  return out;
}
function binaryStringToUint8(str){
  const a=new Uint8Array(str.length);
  for(let i=0;i<str.length;i++) a[i]=str.charCodeAt(i)&255;
  return a;
}
function readAscii(bytes,start,len){
  return String.fromCharCode(...bytes.slice(start,start+len));
}
function readU32BE(bytes,o){
  return ((bytes[o]<<24)>>>0)+(bytes[o+1]<<16)+(bytes[o+2]<<8)+bytes[o+3];
}
function decodeText(bytes){
  try{return new TextDecoder("utf-8").decode(bytes).replace(/\0/g,"").trim()}
  catch{return ""}
}
function encodeText(str){return new TextEncoder().encode(str)}

function detectType(file){
  const ext=extOf(file.name), mime=mimeOf(file);
  if(ext==="pdf" || mime==="application/pdf") return "pdf";
  if(ext==="jpg" || ext==="jpeg") return "jpeg";
  if(ext==="png") return "png";
  if(ext==="mp3") return "mp3";
  if(["docx","xlsx","xlsm","pptx"].includes(ext)) return "office";
  if(mime.startsWith("image/")) return "image";
  if(mime.startsWith("audio/")) return "audio";
  if(mime.startsWith("video/")) return "video";
  return "generic";
}

const fieldsByType={
  pdf:["title","author","subject","keywords","creator","producer"],
  jpeg:["title","description","artist","copyright","software","dateTime"],
  png:["title","description","author","copyright","software","dateTime","keywords"],
  mp3:["title","artist","album","albumArtist","year","genre","track","comment","copyright"],
  office:["title","subject","author","keywords","description","category","lastModifiedBy"],
  image:["title","description","author","copyright","software","dateTime"],
  audio:["title","artist","album","year","genre","comment","copyright"],
  video:["title","artist","description","copyright","dateTime"],
  generic:["title","description","author","keywords","comment","copyright"]
};
