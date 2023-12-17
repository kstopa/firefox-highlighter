# Simple Highlighter

A simple Firefox plugin that enables to highlight and export selected content to markdown.

## Usage

Just select any text and it will be highlighted.

To change the highlighting style and color access to plugin settings and select prefered style or color.
Note that on export selected style will be set on export, i.e. each color generates different markdown style:

* yellow: default style based on html code,
* green: adds itallic to selected texts,
* blue: adds bold,
* red: strikes selected text.

To save all selected content just press the save button.

To clear all selected content just press the clear button.

## Development

To start developing just instal web-ext and run:

```
npm install -g web-ext
web-ext run
```

## Build

```
web-ext build
```

## License

GPL v3

