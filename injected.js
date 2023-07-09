// UI

console.log("Youtube Bookmars Injected")

let youtube_block_where_the_widget_will_be_shown = document.querySelector(".ytp-left-controls")

let widget = document.createElement("div")
widget.style = 'padding:5px'
widget.innerHTML = `<img src="${chrome.runtime.getURL("Icons/plus.svg")}"
  style="width: 100%; height: 100%; cursor: pointer;"
  class="ytp-chapter-title ytp-button ytp-chapter-container-disabled"
  title="Add Bookmark">`;


youtube_block_where_the_widget_will_be_shown.appendChild(widget)


// Listener

widget.addEventListener("click",function(){
    alert("Youtube Bookmarker: Bookmark Added")
    let returnVal = ExtractYoutubeVidInfo()

    let unique_id = returnVal[0]
    let object = returnVal[1]

    UpdateDataInChrome(unique_key = unique_id, object = object)
})


function ExtractYoutubeVidInfo(){
    let time_extracted = ExtractTime()

    let vid_url = new URLSearchParams(window.location.search)
    let video_name = document.querySelector("#title .ytd-watch-metadata .ytd-watch-metadata").textContent
    let unique_id = vid_url.get("v")
    let channel_name = document.querySelector("#text .yt-formatted-string").textContent
    let object = {time_extracted  :time_extracted, channel_name : channel_name, video_name:video_name}

    return [unique_id,object]

}   

function ExtractTime(){
    let time_element = document.querySelector("div.notranslate").querySelectorAll("span")[1].textContent
    return time_element
}

function UpdateDataInChrome(unique_key,object){
    chrome.storage.local.get(null,function(stored_object){
        if (!stored_object){
            stored_object = {}
        }

        stored_object[unique_key] = object

        chrome.storage.local.set(stored_object)

    })
}
