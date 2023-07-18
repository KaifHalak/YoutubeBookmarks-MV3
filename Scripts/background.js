// Open link in a new tab
chrome.runtime.onMessage.addListener(function(link){
    chrome.tabs.create({ url: link })
})

let injected_tabs = []

chrome.tabs.onUpdated.addListener(async function(tabId,changeInfo) {
    // Inject when (1 - Tab is loaded, 2 - Tab as not already been injected by the script)
    let tab_url = await getTab()
    if (changeInfo.status === 'complete' && tab_url.startsWith("https://www.youtube.com") && !injected_tabs.includes(tabId)){
        injected_tabs.push(tabId)
        chrome.scripting
        .executeScript({
          target : {tabId : tabId},
          files : ["Scripts/injected.js"],
        })
    }
  });


  async function getTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0].url;
  }