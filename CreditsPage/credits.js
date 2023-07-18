let menu_btn = document.querySelector(".go-back-icon")

menu_btn.addEventListener("mouseover",function(){
    menu_btn.src = "Icons/left_arrow_blue_svg.svg"
})

menu_btn.addEventListener("mouseout",function(){
    menu_btn.src = "Icons/left_arrow_svg.svg"
})

menu_btn.addEventListener('click',function(){
    chrome.storage.local.get(null,function(stored_object){
        stored_object["current_page"] = "popup"

        chrome.storage.local.set(stored_object,function(){
            window.location.href = "../Popup/popup.html"
        })

    })

})