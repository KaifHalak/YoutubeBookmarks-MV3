let tabs_already_injected_list = []


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.startsWith("https://www.youtube.com/watch") && tabs_already_injected_list.includes(!tabId)) {
	  tabs_already_injected_list.push(tabId)
    chrome.tabs.executeScript(tabId, { file: "injected.js" });
  }
});

chrome.runtime.onMessage.addListener(function(link){
    chrome.tabs.create({ url: link })
})