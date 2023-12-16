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
    const content = browser.storage.local.get('highlightedContent', (content) => {
        renderMarkdown(content.highlightedContent, activeTab);
    });
});

function toggleDropdown() {
    document.getElementById('styleSelect').classList.toggle('show');
}

function selectOption(optionClass, optionHtml) {
    document.getElementById('selectedColor').className = 'dot ' + optionClass;
    document.getElementById('selectedOption').innerHTML = optionHtml;
    // TODO store selected option in store
}

document.getElementById('save').addEventListener('click', saveTextAsFile);
document.getElementById('clear').addEventListener('click', clearText);
document.getElementById('styleSelect').addEventListener('click', toggleDropdown);
document.getElementById('optionDefault').addEventListener('click', function(){
    selectOption('yellow-dot', 'Default');
});
document.getElementById('optionBold').addEventListener('click', function(){
    selectOption('blue-dot', '<strong>Bold</strong>');
});
document.getElementById('optionItalic').addEventListener('click', function(){
    selectOption('green-dot', '<i>Italic</i>');
});
document.getElementById('optionStrike').addEventListener('click', function(){
    selectOption('red-dot', '<del>Strike</del>');
});
