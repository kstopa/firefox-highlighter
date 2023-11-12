 // Import the Turndown library to convert HTML to Markdown
// You can add this library to your extension by downloading it and including it in your manifest.json file
//var TurndownService = require('turndown');

//var turndownService = new TurndownService();

// TODO enable to tune the color
// TODO convert to Markdown
// if header add # else just paragraph
// TODO save to a file
// TODO add support to store images
// TODO add support to store tables
// TODO enable to unmark already highlighted text.


const highlight = `<span style="background: #ffcd40; border-radius:3px">`;

function notifyExtension(e) {
    // highlight the selected element
    var selectedText = window.getSelection().toString();
    if (selectedText) {
        e.target.innerHTML = e.target.innerHTML.replace(selectedText, highlight + selectedText + '</span>');
        browser.runtime.sendMessage({'markdown': selectedText});
    }
};

window.addEventListener("mouseup", notifyExtension);