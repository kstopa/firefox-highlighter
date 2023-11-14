function saveContent(highlightedContent) {
  browser.storage.local.set({highlightedContent});
}

function appendContent(content, newContent) {
  if (content) {
    let highlightedContent = content + '\n\n' + newContent;
    saveContent(highlightedContent);
  } else {
    saveContent(newContent);
  }
}

function notify(message) {
    // Apend to highlighted content saved in browser storage
    browser.storage.local.get('highlightedContent').then(
      (content) => appendContent(content.highlightedContent, message.markdown),
      (err) => saveContent(message.markdown)
    );
  }
  
/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);