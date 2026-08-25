# MetaData

MetaData is a local, single-file web application for inspecting, editing, cleaning and exporting file metadata directly from the browser.

The interface is designed to follow the visual language of the associated academic Portfolio while remaining focused on file editing workflows.

## Main workflow

1. Open or drag a file into the application.
2. MetaData detects the file type and selects the appropriate metadata engine.
3. Descriptive fields and modification/provenance fields are displayed separately.
4. Edit the values directly in the form.
5. Save a new copy or export associated metadata, depending on the file format.

The original file is never overwritten.

## Embedded metadata editing

MetaData can rewrite metadata directly in a new file for supported formats, including:

- JPEG - EXIF metadata
- PNG - textual metadata chunks
- PDF - document properties
- MP3 - ID3 metadata
- DOCX, XLSX, XLSM and PPTX - OpenXML document properties

The exact fields depend on the format. For example, the application can expose software/application information, PDF producer information, Office modification information and other format-specific provenance fields.

## Universal sidecar mode

Some file types do not provide standardized embedded metadata that can be safely rewritten from a browser. Source files such as `.py`, `.pyw` and many other arbitrary formats fall into this category.

For these files, every displayed field remains editable, but MetaData clearly switches to **sidecar mode**. Saving produces a `.metadata.json` file associated with the original file instead of pretending to modify metadata that the format does not actually contain.

## Editing controls

The editor distinguishes three operations:

- **Save** - writes a new file or exports its sidecar metadata
- **Clear all fields** - empties every displayed metadata field
- **Restore original** - reloads the metadata values detected when the file was opened

Unsaved modifications are indicated directly in the editor.

## Additional features

- complete metadata view
- privacy audit and cleanup
- JSON export
- batch inventory with JSON and CSV export
- local operation history
- French and English interface
- light and dark themes
- green, cassis and blue palettes
- accessibility controls
- responsive layout

## Local processing

Files are processed in the browser and are not uploaded by the application. Third-party JavaScript libraries are loaded as application dependencies from a CDN, but the selected files themselves are not transmitted to those services by MetaData.

## Project structure

The application code remains entirely inside a single `index.html` file. The repository also contains the README, MIT license and GitHub Pages deployment files.

## License

MIT License.
