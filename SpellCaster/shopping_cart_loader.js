/*
// (The Loading Function Is At The Bottom Of The Page)
// This Is A JSON Element Containing All The Items In The Shopping Cart
// The "location" Property MUST Be One Of These Six:
// "bottom"/"top"/"right"/"left"/"full"/"main"/"none"
// Adding "new_item" or "soon_item" or "new_capabilities_item" (inside "additional_classes") will add a notification to the item
*/
const all_items_list = 
[
    {
        "title" : "ניווט תחתון עם תמונות",
        "link" : "items/item_0/item_0.html",
        "image_url" : "../PublishingImages/item_0.png",
        "location" : "bottom",
        "additional_classes" : [],
        "upload_date" : "16/06/2022",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "תמונת רקע ועיצוב כללי לאתר",
        "link" : "items/item_1/item_1.html",
        "image_url" : "../PublishingImages/item_1.png",
        "location" : "full",
        "additional_classes" : [],
        "upload_date" : "26/06/2022",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "תפריט עליון נפתח",
        "link" : "items/item_2/item_2.html",
        "image_url" : "../PublishingImages/item_2.png",
        "location" : "top",
        "additional_classes" : [],
        "upload_date" : "26/07/2022",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "כפתור אינטראקטיבי",
        "link" : "items/item_3/item_3.html",
        "image_url" : "../PublishingImages/item_3.png",
        "location" : "main",
        "additional_classes" : [],
        "upload_date" : "08/11/2022",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "פתיחת דף אוטומטית בכרום",
        "link" : "items/item_4/item_4.html",
        "image_url" : "../PublishingImages/item_4.png",
        "location" : "full",
        "additional_classes" : [],
        "upload_date" : "16/04/2023",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "מחולל הקישורים 2.0",
        "link" : "items/item_5/item_5.html",
        "image_url" : "../PublishingImages/item_5.png",
        "location" : "main",
        "additional_classes" : [],
        "upload_date" : "31/05/2023",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "ניווט צד",
        "link" : "items/item_6/item_6.html",
        "image_url" : "../PublishingImages/item_6.png",
        "location" : "right",
        "additional_classes" : [],
        "upload_date" : "22/06/2023",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "כרטיסיות",
        "link" : "items/item_7/item_7.html",
        "image_url" : "../PublishingImages/item_7.png",
        "location" : "top",
        "additional_classes" : [],
        "upload_date" : "22/06/2023",
        "creator" : "Anog Jani"
    }
    ,{
        "title" : "גלריית תמונות",
        "link" : "items/item_8/item_8.html",
        "image_url" : "../PublishingImages/item_8.png",
        "location" : "main",
        "additional_classes" : [],
        "upload_date" : "24/10/2023",
        "creator" : "Anog Jani"
    }
]






























//------The-Loading-Function-Itself------//
function load_shopping_cart () {
    let shopping_cart_element = document.getElementById("shopping_container");

    let item_elements = []; //first we create all the elements and only after that we append them to the page so we could modify this array however we want first
    let special_item_elements = [];

    //creating the elements without adding them to the page
    for (let i = 0 ; i < all_items_list.length ; i++) {
        let a = document.createElement("a"); //creating "a"
        a.classList.add(all_items_list[i].location + "-element");
        a.classList.add("item");

        //additional classes
        for(let j = 0 ; j < all_items_list[i].additional_classes.length ; j++){
            a.classList.add(all_items_list[i].additional_classes[j]);
        }

        //a.setAttribute("target","_blank"); /***open in a new window***/
        a.setAttribute("href",all_items_list[i].link);

        let p = document.createElement("p"); //creating "p"
        p.classList.add("item_title");
        p.innerHTML = all_items_list[i].title;
        
        let img = document.createElement("img"); //creating "img"
        img.classList.add("item_image");
        img.setAttribute("src",all_items_list[i].image_url);
        img.setAttribute("loading","lazy");

        //ASSEMBLLE!
        a.appendChild(p);
        a.appendChild(img);

        //putting the special items first
        if (all_items_list[i].additional_classes.length > 0) {
            special_item_elements.push(a);
        } else {
            item_elements.push(a);
        }
    }

    //here you can modify the array however we want like filter, sort, reverse... (e.g: "item_elements.reverse();" will reverse the order in which the items display)
    item_elements[0] = item_elements.splice(1,1,item_elements[0])[0]; //swapping the first two items
    item_elements = special_item_elements.concat(item_elements); //placing the special items first

    //appending to the page
    for (let i = 0 ; i < item_elements.length ; i++) {
        shopping_cart_element.appendChild(item_elements[i]);
    }
}


//calling the function we created:
load_shopping_cart();


// All elements that have the additional class of "log_click" whould be logged
// (useful when wanting to see how many people anticipate a new Kishuf)
let logged_items = document.querySelectorAll(".log_click");
logged_items.forEach((item) => {
    item.addEventListener('click', (event) => {
        log(item.innerText,"click");
        notify("info","כישוף זה עדיין לא זמין");
    });
});