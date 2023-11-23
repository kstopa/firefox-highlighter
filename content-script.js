 // Import the Turndown library to convert HTML to Markdown
// You can add this library to your extension by downloading it and including it in your manifest.json file
//var TurndownService = require('turndown');

//var turndownService = new TurndownService();

const highlight = `<highlight class="addon-highlighted-content" style="background: #ffcd40; border-radius:3px">`;

function createHighlightedElement() {
   const highlight = document.createElement('highlight');
   highlight.style.background = '#ffcd40';
   highlight.style.borderRadius = '3px';
   return highlight;
}

function capitalizeFirstLetter(text) {
    // Find the first letter in the text
    text = text.trim();
    const firstLetterMatch = text.match(/[a-zA-Z]/);
    if (!firstLetterMatch) {
        // No letters in the text
        return text;
    }
    // Extract the index of the first letter
    const firstLetterIndex = firstLetterMatch.index;
    // Capitalize the first letter
    const firstLetterCapitalized = text[firstLetterIndex].toUpperCase();
    // Reconstruct the string
    return text.substring(0, firstLetterIndex) + firstLetterCapitalized + text.substring(firstLetterIndex + 1);
}

/* Convert html to markdown */
function htmlToMarkdown(element) {
   let markdown = '';
   if (element.nodeType === 3) {
      markdown = element.nodeValue;
   } else if (element.tagName === 'A') {
      markdown = '[' + element.innerText + '](' + element.href + ')';
   } else if (element.tagName === 'STRONG') {
      markdown = '**' + element.innerText + '**';
   } else if (element.tagName === 'I') {
      markdown = '*' + element.innerText + '*';
   } else {
     // TODO
     console.warn(element.tagName + ' not supported yet.');
     markdown += element.innerText;
   }
   return markdown;
}

/* Get markdown text from selected text */
function processSelection(selection) {
  let markdown = "";
  // Iterate through all ranges in the
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    const fragment = range.cloneContents();
    const elHighlighted = createHighlightedElement();
    elHighlighted.appendChild(fragment);

    let currentNode = elHighlighted.firstChild; //treeWalker.currentNode;
    while(currentNode) {
       // Move to the next node
       markdown += htmlToMarkdown(currentNode);
       currentNode = currentNode.nextSibling;
    }

     // replace in dom with styled highlight
     range.deleteContents();
     range.insertNode(elHighlighted);

  }
  // Format as a sentence. 
  markdown = capitalizeFirstLetter(markdown);
  if (markdown && (!markdown.endsWith('.') || !markdown.endsWith(',') || !markdown.endsWith(';'))) {
    markdown += '.';
  }
  return markdown;
};

function notifyExtension(e) {
    var selectedText = processSelection(window.getSelection());
    if (selectedText) {
        browser.runtime.sendMessage({
            'title': document.title,
            'markdown': selectedText
        });
    }
};

window.addEventListener("mouseup", notifyExtension);
