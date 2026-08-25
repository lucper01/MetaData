# Metadata Editor

Metadata Editor is a local, browser-based tool for inspecting, editing, exporting and cleaning metadata embedded in common file formats.

The application is designed as a lightweight research and everyday utility. Files are processed directly in the browser and are not uploaded by the application.

## Single-file application

The complete application is contained in a single `index.html` file. The HTML structure, CSS interface, translations, accessibility settings and metadata-processing logic are all embedded in that file.

The page loads a small set of client-side format libraries from jsDelivr, but selected user files remain local to the browser.

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

## Interface

The visual direction follows the Portfolio design language, including:

- cream and green backgrounds with soft radial gradients
- deep green hero sections
- Georgia headings
- rounded white cards with green shadows
- pill-shaped navigation and controls
- Portfolio green as the default palette
- dark mode and alternate cassis and blue palettes

## Privacy

Metadata Editor is a client-side application. Selected files remain on the user's device and are processed in the browser. The application does not upload the selected files to GitHub or to an application server.

External JavaScript libraries are loaded from jsDelivr to provide file-format support. These libraries are downloaded by the browser as application dependencies; the selected files are not sent to them by the application.

## Supported editing formats

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

## Browser dependencies

- PDF-Lib
- piexifjs
- JSZip

## License

This project is released under the MIT License. See `LICENSE` for details.
