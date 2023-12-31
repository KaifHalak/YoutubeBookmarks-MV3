// Open link in a new tab
chrome.runtime.onMessage.addListener(function(link){
    chrome.tabs.create({ url: link })
})

chrome.tabs.onUpdated.addListener(async function(tabId,changeInfo,tab) {
    // Inject when (1 - Tab is loaded, 2 - Tab as not already been injected by the script)

    let check_if_already_injected = await CheckIfAlreadyInjected(tabId)
    if (check_if_already_injected){return}

    if (changeInfo.status === 'complete' && tab.url.startsWith("https://www.youtube.com/watch")){
    chrome.scripting
        .executeScript({
          target : {tabId : tabId},
          files : ["Scripts/injected.js"],
        })
    }
  });



function CheckIfAlreadyInjected(tabId){
  return new Promise(function(resolve,reject){
    chrome.tabs.sendMessage(tabId,"",function(response){
      resolve(response)
    })

  })
}
