# Metadata Editor

Metadata Editor is a local, browser-based tool for inspecting, editing, exporting and cleaning metadata embedded in common file formats.

The application is designed as a lightweight research and everyday utility. Files are processed directly in the browser and are not uploaded by the application.

## Features

- automatic file type detection
- adaptive metadata fields according to the selected format
- JPEG EXIF inspection and editing
- PNG text metadata inspection and editing
- PDF document property editing
- MP3 ID3 metadata editing
- DOCX, XLSX, XLSM and PPTX core property editing
- image, audio, video and PDF preview
- complete metadata view
- privacy audit for potentially identifying metadata
- metadata cleanup when supported by the browser engine
- JSON metadata export
- batch file inventory with JSON and CSV export
- local operation history
- French and English interface
- light and dark themes
- green, cassis and blue palettes
- accessibility options
- responsive desktop and mobile interface

## Privacy

Metadata Editor is a client-side application. Selected files remain on the user's device and are processed in the browser. The application does not upload the selected files to GitHub or to an application server.

External JavaScript libraries are loaded from jsDelivr to provide file-format support. These libraries are downloaded by the browser as application dependencies; the selected files are not sent to them by the application.

## Supported formats

Editing support currently focuses on formats that can be rewritten reliably in a modern browser:

- JPEG / JPG
- PNG
- PDF
- MP3
- DOCX
- XLSX / XLSM
- PPTX

Other image, audio and video formats can still be detected and previewed where supported by the browser, although some metadata remain read-only.

## Usage

1. Open the web application.
2. Select or drag a file into the interface.
3. Review the detected metadata and file information.
4. Edit the available fields or use the privacy tools.
5. Download a new modified copy of the file.

The original file is never overwritten by the web application.

## Interface

The interface follows the same visual language as the Portfolio tools, including rounded cards, a persistent side navigation, multiple color palettes, light and dark modes, bilingual controls and accessibility settings.

## Browser dependencies

The application uses:

- PDF-Lib
- piexifjs
- JSZip

These dependencies are loaded client-side from jsDelivr.

## License

This project is released under the MIT License. See `LICENSE` for details.
