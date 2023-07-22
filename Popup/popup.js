const PLAY_VID_ICON_CLASS = ".play-btn"
const PLAY_VID_ICON = "Icons/play-button-default.svg"
const PLAY_VID_COLORED_ICON = "Icons/play-button-colored.svg"
const PLAY_VID_TITLE = "Play Video"

const DELETE_TIMESTAMP_ICON_CLASS = ".delete-btn"
const DELETE_TIME_STAMP_ICON = "Icons/dustbin_svg.svg"
const DELETE_TIME_STAMP_COLORED_ICON = "Icons/dustbin_red_svg.svg"
const DELETE_TIME_STAMP_TITLE = "Delete Timestamp"

const DELETE_ALL_TIMESTAMPS_CLASS = ".delete-all-text"
const DELETE_SINGLE_TIME_STAMP_MESSAGE = "Are you sure you want to delete it?"
const DELETE_ALL_TIMESTAMPS_MESSAGE = "Are you sure you want to delete all?"

const MAIN_FLEX_CONTAINER_CLASS = ".main-flex-container"
const INNER_FLEX_CONATINER_CLASS = "inner-flex-container"

const CREDITS_PAGE = ".credits-container"

const EMPTY_POPUP_MSG_CLASS = ".empty-popup-flex-container"

var StoredData = {
    data : {},
    GetData : function(){
        return this.data
    },
    SetData : function(object){
        this.data = object
    },
    SetCurrentPage : function(page){
        this.data["current_page"] = page
    },
    GetTimeStamp : function(unique_key){
        return this.data[unique_key]["time_extracted"]
    },
    GetVideoName : function(unique_key){
        return this.data[unique_key]["video_name"]
    },
    GetChannelName : function(unique_key){
        return this.data[unique_key]["channel_name"]
    },
    GetKeys : function(){
        let keys = Object.keys(this.data)
        keys = keys.filter(item => item !== "current_page")
        return keys
    },
    GetListID : function(unique_key){
        return this.data[unique_key]["list_id"] || null
    },
    DeleteRecord : function(unique_key){
        delete this.data[unique_key]
    }
}


function GetDataFromChrome(){
    chrome.storage.local.get(null,function(stored_data){
        if (Object.keys(stored_data).length === 0){
            EnableEmptyPopupMsg()
        } else {
            
            if (stored_data["current_page"] === "credits"){
                window.location.href = "../CreditsPage/credits.html"
            }
            
            StoredData.SetData(object = stored_data)
            DisableEmptyPopupMsg()
            DisplayAll()
            InitValues()
            // console.log(StoredData.GetData())
        }
    })  
}

function InitValues(){
    document.querySelector(DELETE_ALL_TIMESTAMPS_CLASS).addEventListener("click",function(){
        DeleteAll()
    })
    document.querySelector(CREDITS_PAGE).addEventListener("click",function(){
        StoredData.SetCurrentPage("credits")
        chrome.storage.local.set((StoredData.GetData()),function(){
            window.location.href = "../CreditsPage/credits.html"
        })
    })
}

function DisplayAll(){
    let all_keys = StoredData.GetKeys()

    all_keys.forEach(function(key){

        // Visual

        let time_stamp = StoredData.GetTimeStamp(unique_key = key)
        let channel_name = StoredData.GetChannelName(unique_key = key)
        let video_name = StoredData.GetVideoName(unique_key = key)
        let list_id = StoredData.GetListID(unique_key = key)

        let new_div = document.createElement("div")
        new_div.classList.add(INNER_FLEX_CONATINER_CLASS)

        new_div.innerHTML = `
        <div class="text-flex-container">
            <div class="inner-text-flex-container">
                <span class="text-bookmark">Channel Name: </span>
                <span class="text-bookmark-value">${channel_name}</span>
            </div>
            <div class="inner-text-flex-container">
                <span class="text-bookmark video-title">Video Title: </span>
                <span class="text-bookmark-value">${video_name}</span>
            </div>
            <div class="inner-text-flex-container">
                <span class="text-bookmark">Timestamp: </span>
                <span class="text-bookmark-value">${time_stamp}</span>
            </div>
        </div>

        <div class="images-flex-container">
            <img src=${PLAY_VID_ICON} alt="Play Video" class="play-btn icon" title=${PLAY_VID_TITLE}>
            <img src= ${DELETE_TIME_STAMP_ICON} alt="Delete Timestamp" class="delete-btn icon" title=${DELETE_TIME_STAMP_TITLE}>
        </div>
        `

        let parent_element = document.querySelector(MAIN_FLEX_CONTAINER_CLASS)
        parent_element.appendChild(new_div)

        // Listeners

        let unique_id = key
        let starting_time_of_vid = ConvertTimeToSeconds(time_stamp.split("/")[0])

        let youtube_vid_link

        if (list_id){
            youtube_vid_link = `https://www.youtube.com/watch?v=${unique_id}&t=${starting_time_of_vid}s&list=${list_id}`
        } else {
            youtube_vid_link = `https://www.youtube.com/watch?v=${unique_id}&t=${starting_time_of_vid}s`
        }

    
        let play_btn = new_div.querySelector(PLAY_VID_ICON_CLASS)

        play_btn.addEventListener("click",function(){
            SendLinkToBackgroundScript(link = youtube_vid_link)
        })

        play_btn.addEventListener("mouseenter",function(){
            play_btn.src = PLAY_VID_COLORED_ICON
        })

        play_btn.addEventListener("mouseleave",function(){
            play_btn.src = PLAY_VID_ICON
        })


        let delete_btn = new_div.querySelector(DELETE_TIMESTAMP_ICON_CLASS)

        delete_btn.addEventListener("click",function(){
            let confirm_delete = confirm(DELETE_SINGLE_TIME_STAMP_MESSAGE)

            if (confirm_delete){
                DeleteTimestamp(unique_key = unique_id)
                new_div.remove()}
        })

        delete_btn.addEventListener("mouseenter",function(){
            delete_btn.src = DELETE_TIME_STAMP_COLORED_ICON
        })

        delete_btn.addEventListener("mouseleave",function(){
            delete_btn.src = DELETE_TIME_STAMP_ICON
        })

    })


}

function ConvertTimeToSeconds(time) {
    let split_time = time.split(":")
    
    let hours,minutes,seconds,totalSeconds

    if (split_time.length === 2){
        minutes = Number(split_time[0])
        seconds = Number(split_time[1])
        totalSeconds = minutes * 60 + seconds;
    } else {
        hours = Number(split_time[0])
        minutes = Number(split_time[1])
        seconds = Number(split_time[2])
        totalSeconds = hours * 3600 + minutes * 60 + seconds;
    }
    return totalSeconds;
  }
  

function SendLinkToBackgroundScript(link){
    chrome.runtime.sendMessage(link)
}

function DeleteTimestamp(unique_key) {
    StoredData.DeleteRecord(unique_key);
    let stored_data = StoredData.GetData();
    if (Object.keys(stored_data).length === 0) {
        EnableEmptyPopupMsg()
        chrome.storage.local.clear();
    } else {
        chrome.storage.local.clear()
        chrome.storage.local.set(stored_data)
    }
  }
  

function EnableEmptyPopupMsg(){
    let empty_popup_msg = document.querySelector(EMPTY_POPUP_MSG_CLASS)
    empty_popup_msg.classList.remove("empty-popup-flex-container-hide")
}

function DisableEmptyPopupMsg(){
    let empty_popup_msg = document.querySelector(EMPTY_POPUP_MSG_CLASS)
    empty_popup_msg.classList.add("empty-popup-flex-container-hide")
}



function DeleteAll(){
    let confirm_delete = confirm(DELETE_ALL_TIMESTAMPS_MESSAGE)

    if (confirm_delete){
        chrome.storage.local.clear()
        let all_elements = document.querySelectorAll(".inner-flex-container")
    
        all_elements.forEach(function(each_element){
            each_element.remove()
        })
    
        EnableEmptyPopupMsg()
    }

}


GetDataFromChrome()