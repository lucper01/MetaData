# Metadata Editor

Metadata Editor is a browser-based utility for inspecting, editing, exporting and cleaning metadata embedded in common file formats.

The application is designed to work directly in the browser. Files selected by the user are processed locally and are not uploaded by the application.

## Features

- automatic file type detection
- adaptive metadata fields according to the selected format
- JPEG EXIF metadata editing
- PNG text metadata editing
- PDF document property editing
- MP3 ID3 metadata editing
- DOCX, XLSX, XLSM and PPTX core property editing
- image, audio, video and PDF previews
- complete metadata inspection view
- privacy audit for potentially identifying metadata
- metadata cleanup for supported formats
- JSON metadata export
- batch file inventory with JSON and CSV export
- local operation history
- French and English interface
- light and dark themes
- green, cassis and blue interface palettes
- accessibility controls
- responsive desktop and mobile layout

## Privacy

Metadata Editor is a client-side application. Opening a local file does not upload that file to GitHub or to an application server. Processing is performed by JavaScript in the browser.

The application loads PDF-Lib, piexifjs and JSZip from jsDelivr. These libraries are application dependencies; the selected files are not sent to them.

## Supported editing formats

Direct metadata rewriting is currently implemented for:

- JPEG / JPG
- PNG
- PDF
- MP3
- DOCX
- XLSX / XLSM
- PPTX

Other image, audio and video files can be detected and previewed when supported by the browser, but some metadata containers remain read-only because browser-based rewriting is not sufficiently reliable for every format.

## License

This project is released under the MIT License. See `LICENSE` for details.
