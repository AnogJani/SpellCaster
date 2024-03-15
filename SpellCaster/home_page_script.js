/*
// This is a function that changes the "location" image indicator based on which item we are hovering
*/
function handle_location_indicator () {
    let items = document.getElementsByClassName("item");
    let location_image_indicator = document.getElementById("location_image_indicator");
    for (let i = 0 ; i < items.length ; i++) {
        let current_item = items[i];
        current_item.addEventListener("mouseover", function(){
            location_image_indicator.src = location_color_coder(current_item)[0];       //image returned at index 0
        });
        current_item.addEventListener("mouseout", function(){
            location_image_indicator.src = location_color_coder(null)[0];
        });
    }
}

/*
// Helper function to match class name with color/image to display
// if current_item gets null --> return the regular/default result
// return format: [image, color]
*/
function location_color_coder (current_item) {
    if (current_item == null)                               {return ["../PublishingImages/none.png"   ,"grey"];}  //default case
    if (current_item.classList.contains("bottom-element"))  {return ["../PublishingImages/bottom.png" ,"red"];}
    if (current_item.classList.contains("top-element"))     {return ["../PublishingImages/top.png"    ,"yellow"];}
    if (current_item.classList.contains("right-element"))   {return ["../PublishingImages/right.png"  ,"blue"];}
    if (current_item.classList.contains("left-element"))    {return ["../PublishingImages/left.png"   ,"light-green"];}
    if (current_item.classList.contains("full-element"))    {return ["../PublishingImages/full.png"   ,"pink"];}
    if (current_item.classList.contains("main-element"))    {return ["../PublishingImages/main.png"   ,"orange"];}
}

//calling the functions in this script:
handle_location_indicator();