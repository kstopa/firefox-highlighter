function saveTextAsFile() {
    var textToWrite = document.getElementById('highlightedContentArea').value;
    var textFileAsBlob = new Blob([ textToWrite ], { type: 'text/plain' });
    var fileNameToSaveAs = "highlighted.md";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}


function renderMarkdown(content, activeTab) {
    document.getElementById("highlightedContentArea").value = `# ${activeTab.title} \n\n${content}\n\nSource: ${activeTab.url}`;
}

function clearText() {
  const highlightedContent = '';
  document.getElementById('highlightedContentArea').value = highlightedContent;
  browser.storage.local.set({highlightedContent});
}

browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    //document.getElementById('url').textContent = activeTab.url;
    // document.getElementById("title").value = activeTab.title;
    const content = browser.storage.local.get('highlightedContent', (content) => {
        renderMarkdown(content.highlightedContent, activeTab);
    });
});

document.getElementById('save').addEventListener('click', saveTextAsFile);
document.getElementById('clear').addEventListener('click', clearText);
