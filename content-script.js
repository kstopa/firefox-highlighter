 // Import the Turndown library to convert HTML to Markdown
// You can add this library to your extension by downloading it and including it in your manifest.json file
//var TurndownService = require('turndown');

//var turndownService = new TurndownService();

const highlight = `<highlight class="addon-highlighted-content" style="background: #ffcd40; border-radius:3px">`;

function notifyExtension(e) {
    // highlight the selected element
    // console.log(window.getSelection())
    // if (window.getSelection().rangeCount > 0) {
    //     while (window.getSelection().rangeCount
    // }
    // for (let nr = 0;  nr < window.getSelection().rangeCount; nr++) {
    //     console.log(window.getSelection().getRangeAt(nr));
    // }
    var selectedText = window.getSelection().toString();
    if (selectedText) {
        e.target.innerHTML = e.target.innerHTML.replace(selectedText, highlight + selectedText + '</highlight>');
        browser.runtime.sendMessage({
            'title': document.title,
            'markdown': selectedText
        });
    }
};

window.addEventListener("mouseup", notifyExtension);