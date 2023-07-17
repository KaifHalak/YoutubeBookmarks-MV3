
let youtube_block_where_the_widget_will_be_shown = document.querySelector(".ytp-left-controls")

if (!youtube_block_where_the_widget_will_be_shown){ // Check if this element exists
    AddMutationObserver() // start observing for that element 
} else{
    main()
}

function main(){
    // add the plus icon
    let widget = document.createElement("div")
    widget.style = 'padding:5px'
    widget.innerHTML = `<img src="${chrome.runtime.getURL("Icons/plus.svg")}"
    style="width: 100%; height: 100%; cursor: pointer;"
    class="ytp-chapter-title ytp-button ytp-chapter-container-disabled"
    title="Add Bookmark">`;


    youtube_block_where_the_widget_will_be_shown.appendChild(widget)


    // Listeners

    widget.addEventListener("click",function(){
        alert("Youtube Bookmarker: Bookmark Added")
        let returnVal = ExtractYoutubeVidInfo()

        let unique_id = returnVal[0]
        let object = returnVal[1]

        UpdateDataInChrome(unique_key = unique_id, object = object)
    })

}


function AddMutationObserver(){
    let observer = new MutationObserver(function(mutations){
        for (let each_change of mutations){ 
            if (each_change.addedNodes){ // if the change involves adding of new elements

                for (let each_added_node of each_change.addedNodes){ // check if the added element has this specific class
                    if (each_added_node.classList && each_added_node.classList.contains("ytp-left-controls")){
                        youtube_block_where_the_widget_will_be_shown = document.querySelector(".ytp-left-controls") // element found
                        main()
                        observer.disconnect()
                        return
                    }

                }
            }

        }

    })
    observer.observe(document.documentElement,{childList:true, subtree:true})
}




function ExtractYoutubeVidInfo(){
    let time_extracted = ExtractTime()

    let vid_url = new URLSearchParams(window.location.search)
    let unique_id = vid_url.get("v") // get the "v" parameter of the url
    let list_id
    if (vid_url.has("list")){
        list_id = vid_url.get("list") // get the "list" parameter of the url if it exists (videos seen in playlists)
    } else{
        list_id = null
    }

    let video_name = document.querySelector("#title .ytd-watch-metadata .ytd-watch-metadata").textContent
    let channel_name = document.querySelector("#text .yt-formatted-string").textContent
    let object = {time_extracted  :time_extracted, channel_name : channel_name, video_name:video_name, list_id:list_id}

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
