
function buildHighlightedElement(optionClass) {
  const highlight = document.createElement('highlight');
  highlight.style.borderRadius = '3px';
  switch (optionClass) {
    case 'blue-dot':
      highlight.style.background = '#70CEF6';
      highlight.style.fontWeight = 'bold';
      break;
    case 'green-dot':
      highlight.style.background = '#92DB70';
      highlight.style.fontStyle = 'italic';
      break;
    case 'red-dot':
      highlight.style.background = '#FC7C7C';
      highlight.style.textDecoration = 'line-through';
      break;
    default:
      highlight.style.background = '#FFE23F';
  }
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
function htmlToMarkdown(element, optionClass) {
   let markdown = '';
   if (element.nodeType === 3) {
      markdown = element.nodeValue.trim();
      switch (optionClass) {
        case 'blue-dot':
          markdown = ' **' + markdown + '** ';
          break;
        case 'green-dot':
          markdown = ' *' + markdown + '* ';
          break;
        case 'red-dot':
          markdown = ' ~~' + markdown + '~~ ';
          break;
      }
   } else if (element.tagName === 'A') {
      markdown = ' [' + element.innerText + '](' + element.href + ') ';
   } else if ((element.tagName === 'STRONG') || (optionClass === 'blue-dot')) {
      markdown = ' **' + element.innerText.trim() + '** ';
   } else if ((element.tagName === 'I') || (optionClass === 'green-dot')) {
      markdown = ' *' + element.innerText.trim() + '* ';
   } else {
     // TODO
     console.warn(element.tagName + ' not supported yet.');
     markdown += element.innerText;
   }
   return markdown;
}

function styleSelection(selection, optionClass) {
  let markdown = "";
  // Iterate through all ranges in the
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    const fragment = range.cloneContents();
    const elHighlighted = buildHighlightedElement(optionClass);
    elHighlighted.appendChild(fragment);

    let currentNode = elHighlighted.firstChild; //treeWalker.currentNode;
    while(currentNode) {
      // Move to the next node
      markdown += htmlToMarkdown(currentNode, optionClass);
      currentNode = currentNode.nextSibling;
    }

    // replace in dom with styled highlight
    range.deleteContents();
    range.insertNode(elHighlighted);

  }
  // Format as a sentence. 
  markdown = capitalizeFirstLetter(markdown.trim());
  if (markdown && (!markdown.endsWith('.') || !markdown.endsWith(',') || !markdown.endsWith(';'))) {
    markdown += '.';
  }
  // Store markdown in the browser store
  if (markdown) {
    browser.runtime.sendMessage({
        'title': document.title,
        'markdown': markdown
    });
  }
}

/* Get markdown text from selected text */
function processSelection(selection) {
  browser.storage.local.get('highlightOptions').then(
    (options) => {
      if (options.hasOwnProperty('highlightOptions')) {
        styleSelection(selection, options.highlightOptions['optionClass'])
      } else {
        styleSelection(selection, 'yellow-dot')
      }
    },
    (error) => styleSelection(selection, 'yellow-dot')
  );
};

function notifyExtension(e) {
    processSelection(window.getSelection());
};

window.addEventListener("mouseup", notifyExtension);
