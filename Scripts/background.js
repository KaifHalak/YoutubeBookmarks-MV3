// Open link in a new tab
chrome.runtime.onMessage.addListener(function(link){
    chrome.tabs.create({ url: link })
})