function renderMarkdown(content, activeTab) {
    document.getElementById("highlightedContent").value = `#${activeTab.title} \n\n${content}\n\nSource: ${activeTab.url}`;
}

browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    //document.getElementById('url').textContent = activeTab.url;
    // document.getElementById("title").value = activeTab.title;
    // Get data from storage and render on form
    const content = browser.storage.local.get('highlightedContent', (content) => {
        renderMarkdown(content.highlightedContent, activeTab);
    });
});
