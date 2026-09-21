export type RelatedTool = {
  name: string;
  href: string;
};

export const relatedTools: Record<string, RelatedTool[]> = {
  "csv-to-json": [
    { name: "CSV to XML", href: "/tools/csv-to-xml" },
    { name: "CSV to YAML", href: "/tools/csv-to-yaml" },
    { name: "JSON to CSV", href: "/tools/json-to-csv" },
    { name: "CSV to Markdown", href: "/tools/csv-to-markdown" },
  ],

  "csv-to-xml": [
    { name: "CSV to JSON", href: "/tools/csv-to-json" },
    { name: "CSV to YAML", href: "/tools/csv-to-yaml" },
    { name: "XML to CSV", href: "/tools/xml-to-csv" },
    { name: "CSV to Markdown", href: "/tools/csv-to-markdown" },
  ],

  "csv-to-yaml": [
    { name: "CSV to JSON", href: "/tools/csv-to-json" },
    { name: "CSV to XML", href: "/tools/csv-to-xml" },
    { name: "YAML to CSV", href: "/tools/yaml-to-csv" },
    { name: "CSV to Markdown", href: "/tools/csv-to-markdown" },
  ],

  "json-to-csv": [
    { name: "CSV to JSON", href: "/tools/csv-to-json" },
    { name: "JSON to XML", href: "/tools/json-to-xml" },
    { name: "JSON to YAML", href: "/tools/json-to-yaml" },
    { name: "JSON to Markdown", href: "/tools/json-to-markdown" },
  ],

  "json-to-xml": [
    { name: "JSON to CSV", href: "/tools/json-to-csv" },
    { name: "XML to JSON", href: "/tools/xml-to-json" },
    { name: "JSON to YAML", href: "/tools/json-to-yaml" },
    { name: "JSON to HTML", href: "/tools/json-to-html" },
  ],

  "json-to-yaml": [
    { name: "YAML to JSON", href: "/tools/yaml-to-json" },
    { name: "JSON to XML", href: "/tools/json-to-xml" },
    { name: "JSON to CSV", href: "/tools/json-to-csv" },
    { name: "JSON to Markdown", href: "/tools/json-to-markdown" },
  ],

  "xml-to-json": [
    { name: "JSON to XML", href: "/tools/json-to-xml" },
    { name: "XML to CSV", href: "/tools/xml-to-csv" },
    { name: "XML to HTML", href: "/tools/xml-to-html" },
    { name: "XML to Markdown", href: "/tools/xml-to-markdown" },
  ],

  "xml-to-csv": [
    { name: "CSV to XML", href: "/tools/csv-to-xml" },
    { name: "XML to JSON", href: "/tools/xml-to-json" },
    { name: "XML to HTML", href: "/tools/xml-to-html" },
    { name: "XML to Markdown", href: "/tools/xml-to-markdown" },
  ],

  "yaml-to-json": [
    { name: "JSON to YAML", href: "/tools/json-to-yaml" },
    { name: "YAML to XML", href: "/tools/yaml-to-xml" },
    { name: "YAML to CSV", href: "/tools/yaml-to-csv" },
    { name: "YAML to Markdown", href: "/tools/yaml-to-markdown" },
  ],

  "yaml-to-xml": [
    { name: "XML to JSON", href: "/tools/xml-to-json" },
    { name: "YAML to JSON", href: "/tools/yaml-to-json" },
    { name: "YAML to CSV", href: "/tools/yaml-to-csv" },
    { name: "YAML to HTML", href: "/tools/yaml-to-html" },
  ],

  "yaml-to-csv": [
    { name: "CSV to YAML", href: "/tools/csv-to-yaml" },
    { name: "YAML to JSON", href: "/tools/yaml-to-json" },
    { name: "YAML to XML", href: "/tools/yaml-to-xml" },
    { name: "YAML to Markdown", href: "/tools/yaml-to-markdown" },
  ],

  "html-formatter": [
    { name: "HTML Minifier", href: "/tools/html-minifier" },
    { name: "HTML to Markdown", href: "/tools/html-to-markdown" },
    { name: "HTML to Plain Text", href: "/tools/html-to-text" },
    { name: "CSS Formatter", href: "/tools/css-formatter" },
  ],

  "html-minifier": [
    { name: "HTML Formatter", href: "/tools/html-formatter" },
    { name: "HTML to Markdown", href: "/tools/html-to-markdown" },
    { name: "HTML to Plain Text", href: "/tools/html-to-text" },
    { name: "CSS Minifier", href: "/tools/css-minifier" },
  ],

  "html-to-markdown": [
    { name: "HTML Formatter", href: "/tools/html-formatter" },
    { name: "HTML to Plain Text", href: "/tools/html-to-text" },
    { name: "Markdown Formatter", href: "/tools/markdown-formatter" },
    { name: "JSON to Markdown", href: "/tools/json-to-markdown" },
  ],

  "html-to-text": [
    { name: "HTML to Markdown", href: "/tools/html-to-markdown" },
    { name: "HTML Formatter", href: "/tools/html-formatter" },
    { name: "Markdown Formatter", href: "/tools/markdown-formatter" },
    { name: "Remove Duplicate Lines", href: "/tools/remove-duplicate-lines" },
  ],

  "css-formatter": [
    { name: "CSS Minifier", href: "/tools/css-minifier" },
    { name: "HTML Formatter", href: "/tools/html-formatter" },
    { name: "JavaScript Formatter", href: "/tools/javascript-formatter" },
    { name: "HTML Minifier", href: "/tools/html-minifier" },
  ],

  "css-minifier": [
    { name: "CSS Formatter", href: "/tools/css-formatter" },
    { name: "HTML Minifier", href: "/tools/html-minifier" },
    { name: "JavaScript Minifier", href: "/tools/javascript-minifier" },
    { name: "HTML Formatter", href: "/tools/html-formatter" },
  ],

  "javascript-formatter": [
    { name: "JavaScript Minifier", href: "/tools/javascript-minifier" },
    { name: "JSON Formatter", href: "/tools/json-formatter" },
    { name: "CSS Formatter", href: "/tools/css-formatter" },
    { name: "HTML Formatter", href: "/tools/html-formatter" },
  ],

  "javascript-minifier": [
    { name: "JavaScript Formatter", href: "/tools/javascript-formatter" },
    { name: "JSON Minifier", href: "/tools/json-minifier" },
    { name: "CSS Minifier", href: "/tools/css-minifier" },
    { name: "HTML Minifier", href: "/tools/html-minifier" },
  ],

  "json-formatter": [
    { name: "JSON Minifier", href: "/tools/json-minifier" },
    { name: "JSON to CSV", href: "/tools/json-to-csv" },
    { name: "JSON to XML", href: "/tools/json-to-xml" },
    { name: "JSON to YAML", href: "/tools/json-to-yaml" },
  ],

  "json-minifier": [
    { name: "JSON Formatter", href: "/tools/json-formatter" },
    { name: "JSON to CSV", href: "/tools/json-to-csv" },
    { name: "JSON to XML", href: "/tools/json-to-xml" },
    { name: "JSON to YAML", href: "/tools/json-to-yaml" },
  ],

  "pdf-compressor": [
    { name: "PDF Merger", href: "/tools/pdf-merger" },
    { name: "PDF Splitter", href: "/tools/pdf-splitter" },
    { name: "PDF to Text", href: "/tools/pdf-to-text" },
    { name: "PDF to Word", href: "/tools/pdf-to-word" },
  ],

  "pdf-merger": [
    { name: "PDF Compressor", href: "/tools/pdf-compressor" },
    { name: "PDF Splitter", href: "/tools/pdf-splitter" },
    { name: "PDF Page Extractor", href: "/tools/pdf-page-extractor" },
    { name: "PDF to Word", href: "/tools/pdf-to-word" },
  ],

  "pdf-splitter": [
    { name: "PDF Merger", href: "/tools/pdf-merger" },
    { name: "PDF Compressor", href: "/tools/pdf-compressor" },
    { name: "PDF Page Extractor", href: "/tools/pdf-page-extractor" },
    { name: "PDF to Text", href: "/tools/pdf-to-text" },
  ],

  "pdf-to-text": [
    { name: "PDF to Word", href: "/tools/pdf-to-word" },
    { name: "PDF Compressor", href: "/tools/pdf-compressor" },
    { name: "PDF Page Extractor", href: "/tools/pdf-page-extractor" },
    { name: "PDF to PNG", href: "/tools/pdf-to-png" },
  ],

  "pdf-to-word": [
    { name: "PDF to Text", href: "/tools/pdf-to-text" },
    { name: "PDF Compressor", href: "/tools/pdf-compressor" },
    { name: "PDF Merger", href: "/tools/pdf-merger" },
    { name: "Word to PDF", href: "/tools/word-to-pdf" },
  ],

  "image-compressor": [
    { name: "Image Resizer", href: "/tools/image-resizer" },
    { name: "Image Cropper", href: "/tools/image-cropper" },
    { name: "Image to PDF", href: "/tools/image-to-pdf" },
    { name: "JPG to PNG", href: "/tools/jpg-to-png" },
  ],

  "image-resizer": [
    { name: "Image Compressor", href: "/tools/image-compressor" },
    { name: "Image Cropper", href: "/tools/image-cropper" },
    { name: "Image to PDF", href: "/tools/image-to-pdf" },
    { name: "JPG to PNG", href: "/tools/jpg-to-png" },
  ],

  "image-cropper": [
    { name: "Image Resizer", href: "/tools/image-resizer" },
    { name: "Image Compressor", href: "/tools/image-compressor" },
    { name: "Image to PDF", href: "/tools/image-to-pdf" },
    { name: "JPG to PNG", href: "/tools/jpg-to-png" },
  ],

  "image-to-pdf": [
    { name: "Image Compressor", href: "/tools/image-compressor" },
    { name: "Image Resizer", href: "/tools/image-resizer" },
    { name: "JPG to PDF", href: "/tools/jpg-to-pdf" },
    { name: "PDF Compressor", href: "/tools/pdf-compressor" },
  ],

  "word-counter": [
    { name: "Character Counter", href: "/tools/character-counter" },
    { name: "Sentence Counter", href: "/tools/sentence-counter" },
    { name: "Paragraph Counter", href: "/tools/paragraph-counter" },
    { name: "Case Converter", href: "/tools/case-converter" },
  ],

  "character-counter": [
    { name: "Word Counter", href: "/tools/word-counter" },
    { name: "Sentence Counter", href: "/tools/sentence-counter" },
    { name: "Paragraph Counter", href: "/tools/paragraph-counter" },
    { name: "Case Converter", href: "/tools/case-converter" },
  ],

  "sentence-counter": [
    { name: "Word Counter", href: "/tools/word-counter" },
    { name: "Character Counter", href: "/tools/character-counter" },
    { name: "Paragraph Counter", href: "/tools/paragraph-counter" },
    { name: "Case Converter", href: "/tools/case-converter" },
  ],

  "paragraph-counter": [
    { name: "Word Counter", href: "/tools/word-counter" },
    { name: "Character Counter", href: "/tools/character-counter" },
    { name: "Sentence Counter", href: "/tools/sentence-counter" },
    { name: "Case Converter", href: "/tools/case-converter" },
  ],
};


