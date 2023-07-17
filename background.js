chrome.runtime.onMessage.addListener(function(link){
    chrome.tabs.create({ url: link })
})