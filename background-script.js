function notify(message) {
    // TODO store in a file
  }
  
  /*
  Assign `notify()` as a listener to messages from the content script.
  */
  browser.runtime.onMessage.addListener(notify);