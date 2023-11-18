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

/* Get markdown text from selected text */
function processSelection(selection) {

// Iterate through all ranges in the
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    const fragment = range.cloneContents();
    const elHighlighted = createHighlightedElement();
    elHighlighted.appendChild(fragment);
    
    // Create a TreeWalker to iterate through nodes in this range
    const treeWalker = document.createTreeWalker(
        //range.commonAncestorContainer,
        elHighlighted,
        NodeFilter.SHOW_ALL, // or use a more specific filter
        {
            acceptNode: function(node) {
                // Only consider nodes that are within the range
                if (range.intersectsNode(node)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );

    let currentNode = treeWalker.currentNode;
    while(currentNode) {
        // TODO Process node and convert to markdown
        console.log(currentNode);
        // Move to the next node
        currentNode = treeWalker.nextNode();
    }

     // replace in dom with styled highlight
     range.deleteContents();
     range.insertNode(elHighlighted);

  }
  // TODO return processed markdown
  return selection.toString(); 
 }

function notifyExtension(e) {
    var selectedText = processSelection(window.getSelection());
    var selectedText = window.getSelection().toString();
    if (selectedText) {
        browser.runtime.sendMessage({
            'title': document.title,
            'markdown': selectedText
        });
    }
};

window.addEventListener("mouseup", notifyExtension);
