/*
// Identifiers that can let you know if you are in a specific page inside Spell-Caster, e.g: home page / image caster etc...
// Can be used like this:
// if (home_page_identifier) {do_something();}
// the function will run only if the user is in the home page
*/
let home_page_identifier = "";
let spell_book_page_identifier = "";
let image_caster_page_identifier = "";
let premade_code_page_identifier = "";

let site_url = "https://anogjani.github.io/SpellCaster";

let logging_delay_in_secs = 1; //page loading will take effect only after this amount of secs have passed in the page

/*
// This is a function that loads the nav bar
*/
function create_nav_bar () {
    let nav_element = document.getElementById("nav_bar");
    if (nav_element.classList.contains("home_page")) {home_page_identifier = "active";}
    if (nav_element.classList.contains("spell_book_page")) {spell_book_page_identifier = "active";}
    if (nav_element.classList.contains("image_caster_page")) {image_caster_page_identifier = "active";}
    if (nav_element.classList.contains("premade_code_page")) {premade_code_page_identifier = "active";} //isn't used to indicate inside the navbar
    nav_element.innerHTML = `
    <a class="nav_bar_logo_link" href="${site_url}/SpellCaster/index.html" title='מחולל הכישופים'>
    <img class="nav_bar_logo_image" src="${site_url}/PublishingImages/spell_caster_logo.png"></img>
    </a>
    <ul class="nav_bar_link_list">
        <li class="nav_bar_link_text"><a class="nav_bar_link `+ home_page_identifier +`" href="${site_url}/SpellCaster/index.html"><i class="fas fa-home nav_bar_icon"></i>דף הבית</a></li>
        <li class="nav_bar_link_text"><a class="nav_bar_link new `+ image_caster_page_identifier +`" href="${site_url}/SpellCaster/image_caster.html"><i class="fas fa-image nav_bar_icon"></i>מחולל התמונות</a></li>
        <li class="nav_bar_link_text"><a class="nav_bar_link tooltip `+ spell_book_page_identifier +`" href="${site_url}/SpellCaster/spell_book.html"><i class="fas fa-book-open nav_bar_icon" style="margin:5px"></i>ספר הכשפים<span class="tooltiptext bottom">הסבר לשימוש במחולל הכישופים</span></a></li>
        <li class="nav_bar_link_text"><a class="nav_bar_link" target="_blank" href="#"><i class="fas fa-tree nav_bar_icon" style="margin:5px"></i>קהילת ידע עץ הדעת</a></li>
    </ul>
    <div class="the_rest_of_the_nav">
    <button class="large_button_nav_bar premade_code" type="button" onclick="window.open('${site_url}/SpellCaster/premade_code.html','_self');"><i class="fas fa-code nav_bar_icon"></i>טעינת כישוף מקוד קיים</button>
    </div>
    `;
    if (home_page_identifier) {create_stars_in_nav_bar_link_new();}
}

/*
// This is a function that loads and adds animations the glowing stars in the "new" nav bar links
// (when adding the "new" class to the "a" tag, next to the "nav_bar_link" class)
*/
function create_stars_in_nav_bar_link_new () {
    let nav_bar_links = document.querySelectorAll(".nav_bar_link");
    let stars = [];
    let num_stars = 3;
    //creating the stars
    for (let i = 0 ; i < nav_bar_links.length ; i++) {
        if (nav_bar_links[i].classList.contains("new")) {
            //stars
            for (let j = 0 ; j < num_stars ; j++) {
                let star = document.createElement("span");
                star.classList.add("star");
                star.innerHTML = `<i class="fas fa-star star_icon"></i>`;
                stars.push(star);
                nav_bar_links[i].appendChild(star);
            }
            //animation
            nav_bar_links[i].style.animation = "pop 4000ms ease-in-out";
        }
    }
    //animating the stars
    for (let i = 0 ; i < num_stars ; i++) {
        setTimeout(() => {
            setInterval(() => {
                stars[i].style.visibility = "visible";

                stars[i].style.setProperty("--top_star", `${Math.floor(Math.random()*80)-10}%`);
                stars[i].style.setProperty("--left_star", `${Math.floor(Math.random()*90)-5}%`);

                stars[i].style.animation = "none";
                stars[i].offsetHeight;
                stars[i].style.animation = "";
            }, 1500);
        },i*(1200/num_stars));
    }
}

/*
// This is a function that loads the support image on the bottom-left of the screen
*/
function create_support_image () {
    let body = document.querySelector("body");
    let support_element = document.createElement("div");
    support_element.setAttribute("id","support_image");
    support_element.innerHTML = `
    <img class="support_logo_image" src="${site_url}/PublishingImages/support_logo.png" onclick="window.open('#');"></img>
    <p class="support_text" onclick="location.href='mailto:anog054@gmail.com&subject=פנייה למפתח בנושא מחולל הכישופים'"><i class="far fa-copyright"></i>ענוג ג'אני</p>
    `;
    body.appendChild(support_element);
}

/*
// This is a function that adds the spinning loading screen element
*/
function create_loader () {
    let body = document.querySelector("body");
    let loader_wrapper = document.createElement("div");
    loader_wrapper.setAttribute("class","loader_wrapper");
    loader_wrapper.setAttribute("id","loader_wrapper");
    loader_wrapper.innerHTML = `<div class="loader"></div>`;
    body.appendChild(loader_wrapper);
    document.querySelector("html").style.overflowY = "hidden";
}

/*
// This is a function that loads the notification element
// (without triggering it, in order to do that, you need to use the "notify" function)
*/
function create_notification () {
    let body = document.querySelector("body");
    let notification = document.createElement("div");
    notification.setAttribute("class","notification");
    notification.innerHTML = `<p class="notification_message"><p><i class="notification_icon fas"><i>`;
    body.appendChild(notification);
}

/*
// This is a function that loads the logger element that is responsible for collecting data about user interactions with the Meholel
*/
function create_logger () {
    setTimeout(function() {
        let body = document.querySelector("body");
        let logger = document.createElement("iframe");
        logger.setAttribute("id","logger");
        logger.setAttribute("style","display:none");
        logger.setAttribute("src",`${site_url}/SitePages/kishufim_logger.aspx`);
        logger.setAttribute("onload","log_url();"); //logging
        body.appendChild(logger);
    }, logging_delay_in_secs*1000);
}

/*
// This is a function that creates the general dialog carpet which can host more content inside of it
// This function is meant to be used only as a helper function to other functions (that add more content to the dialog)
// the "specific_id" argument is just a string that you can add after the id "general_dialog" (if you want to create more than 1 dialog at the same time)
// so that you can specify which dialog you want to operate on
// the default is that there is not a specific_id
// How To Use: in the code, after calling the function, change the inner HTML of the element with the id: "general_dialog_carpet_*insert spesific-id here*"
// don't forget to add in that html code the option to exit the dialog (e.g: <button onclick="exit_general_dialog();">close</button> )
*/
function open_general_dialog (specific_id="", z_index = 1) {
    let body = document.querySelector("body");
    let general_dialog = document.createElement("div");
    body.setAttribute("style","overflow:hidden;");
    general_dialog.setAttribute("id",`general_dialog_carpet${specific_id}`);
    general_dialog.setAttribute("class",`general_dialog_carpet`);
    general_dialog.setAttribute("style",`z-index:${z_index*100}`);
    general_dialog.onclick = function(event) {
        if(event.target.classList.contains("general_dialog_carpet"))
            exit_general_dialog(specific_id);
    };
    body.appendChild(general_dialog);
}

/*
// A function that closes the dialog
// the "there_is_more_than_one_dialog" argument is meant to handle cases when you have more than 1 dialog open and don't want to close all of them
*/
function exit_general_dialog (specific_id="", there_is_more_than_one_dialog=false) {
    let body = document.querySelector("body");
    let general_dialog_carpet = document.getElementById(`general_dialog_carpet${specific_id}`);
    if (!there_is_more_than_one_dialog) {body.removeAttribute("style");}
    body.removeChild(general_dialog_carpet);
}

/*
// This is a KEY function that displays and handles the notification
// The arguments are:
// *-mode: (changes the mood of the function so it looks different) accepts "danger|warning|good|copy" or "red|yellow|green"
// *-message: accepts Strings and displays them inside the notification
// *-time: accepts ints and displays the notification for "time" seconds (OPTIONAL, default: 5 seconds)
*/
function notify (mode, message, time = 5) {
    let notification = document.querySelector(".notification");
    let notification_icon = document.querySelector(".notification_icon");
    let notification_message = document.querySelector(".notification_message");
    //animation
    notification.style.animation = "none";
    notification.offsetHeight; //trigers the reset
    notification.style.animation = "pop_up_notification " + time + "s";
    //style
    notification.style.backgroundColor = mode_color_coder(mode)[0];
    notification_message.innerHTML = message;
    notification_icon.setAttribute("class", "notification_icon fas"); //reset icon
    notification_icon.classList.add(mode_color_coder(mode)[1]);
}

/*
// This is a KEY function that logs into the "Kishufim_Logs" list every action you desire
// title: the title of the log, usually contains the name of the page that got loadded
// details: the name of the action (e.g: "load","click","remove" etc'...)
*/
async function log(title, details){
    return false; //make function unsuable in Ezrachi mode
    let listName = "Logs";
    let logger = document.getElementById("logger");
    if (logger == null) {return;} //page logger still did not load, we cancel the logging process
    let api = logger.contentWindow._spPageContextInfo.webAbsoluteUrl + "/_api";
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items`,{
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
            "X-RequestDigest": logger.contentWindow.document.getElementById("__REQUESTDIGEST").value,
            "X-HTTP-Method": "POST"
        },
        body: JSON.stringify({
            "__metadata": {
                "type": `SP.Data.${listName}ListItem`
            },
            "Title": title,
            "details": details
        })
    });
    let json = await response.json();
}

/*
// extracts the name of the page viewed and logs it
*/
function log_url() {
    let url_arr = document.location.href.split('/');
    let url_ending = url_arr[url_arr.length-1].split('.')[0];
    log(url_ending,"load"); //logging loads
}

/*
// Helper function used in the "notify" function to match mode with color/icon to display in the notification
// if mode gets nothing real --> return the regular/default result
// return format: [color, icon-class]
*/
function mode_color_coder (mode) {
    if (mode == "danger" || mode == "red" || mode == "Hapoel")                  {return ["#FF7878","fa-circle-xmark"];}
    if (mode == "warning" || mode == "yellow")                                  {return ["#FFF89A","fa-triangle-exclamation"];}
    if (mode == "good" || mode == "green")                                      {return ["#C6D57E","fa-thumbs-up"];}
    if (mode == "info" || mode == "blue")                                       {return ["#82D3FF","fa-circle-info"];}
    if (mode == "copy")                                                         {return ["#C6D57E","fa-copy"];}
    return ["#D1D1D1","fa-code"]; //base case
}

/*
// This is a function that makes link with the ' char in it could work inside SharePoint
*/
function correct_forbiden_chars (link) {
    return link.split("'").join("\\'");
}

/*
// This is a function that gets a HEX base color and returns the RGB representation of it
*/
function HEXtoRGB (string) {
    if (string.charAt(0) != "#" || string.length != 7) {notify("code","משהו השתבש בהעברת הצבע");return [0,0,0];}
    let R = parseInt(string.charAt(1) + string.charAt(2),16);
    let G = parseInt(string.charAt(3) + string.charAt(4),16);
    let B = parseInt(string.charAt(5) + string.charAt(6),16);
    return [R,G,B];
}

/*
// This is a function that gets a RGB base color and returns the HEX representation of it
*/
function RGBtoHEX (arr) {
    if (arr.length != 3) {notify("code","משהו השתבש בהעברת הצבע");return "#000000";}
    for(let i = 0 ; i < arr.length ; i++){
        if (arr[i] >= 255) {
            arr[i] = "FF";
        } else if (arr[i] <= 0) {
            arr[i] = "00";
        } else {
            arr[i] = arr[i].toString(16);
            if (arr[i].length < 2) {
                arr[i] = "0" + arr[i];  //add a zero to 1 digit chars
            }
        }
    }
    return "#" + arr.join('');
}

/*
// This is a function that inserts arguments into the code in each item
// the code is broken up into segments using "break points" which are represented in the item's html code using "$--BP--$"
// everywhere this symbol appears in the code, it inserts the next argument that was passed to it (in the array "arr")
// it also includes the ID.
*/
function AssembleCode (code, ID, arr) {
    let final_code = ID;
    let CAB = code.split("$--BP--$"); //code_after_brakepoints
    if (CAB.length != arr.length+1) {
        notify("code","CAB and ARGS do not match"); //only developers may see this message
    } else {
        for (let i = 0 ; i < arr.length ; i++) {
            final_code += CAB[i] + arr[i]; //alternating code and args
        }
        final_code += CAB[CAB.length-1]; //add the last element in the end
    }
    return final_code;
}

/*
// IMPORTANT! Legecy Code, I know it's shit, I was young and stupid, sorry...
// Generating Identification Code So We Could Use The Code Later-On And Change It
*/
function Create_Identification_Code (item_num, elements) {
    let i_c = ""; //stands for: "identification code"
    i_c += "<!--\n$id_system$\n";
    i_c += item_num + "\n&&&\n"; //first comes the item's number
    for (let i = 0 ; i < elements.length ; i++) { //for each type of element
        if(Array.isArray(elements[i])) {
            for (let j = 0 ; j < elements[i].length ; j++) { //for each instance of element
                if(Array.isArray(elements[i][j])) {
                    for (let k = 0 ; k < elements[i][j].length ; k++) { //for each componant of element
                        if(Array.isArray(elements[i][j][k])) {
                            for (let l = 0 ; l < elements[i][j][k].length ; l++) { //for each sub-componant or instance of element
                                if(Array.isArray(elements[i][j][k][l])) {
                                    for (let m = 0 ; m < elements[i][j][k][l].length ; m++) { //alert for too deep
                                        if(Array.isArray(elements[i][j][k][l][m])) {
                                            alert("gone too deep"); //should never reach this place!!!
                                        } else {i_c += elements[i][j][k][l][m];}
                                        i_c += "^^^";
                                    }
                                } else {i_c += elements[i][j][k][l];}
                                i_c += "***";
                            }
                        } else {i_c += elements[i][j][k];}
                        i_c += ",,,";
                    }
                } else {i_c += elements[i][j];}
                i_c += "\n===\n";
            }
        } else {i_c += elements[i];}
        i_c += "\n&&&\n";
    }
    i_c += "\n$id_system$\n-->\n";
    return i_c;
}

/*
// IMPORTANT! Legecy Code, I know it's shit, I was young and stupid, sorry...
// Lets You Decode IDs To Use In Your Code
// gets a code as text and returns an array of all the elements (nested in arrays in the correct order)
// @the first element of the array will be the item number@
*/
function Identification_Code_Decoder (text) {
    let arr = []; //the array that we will return
    let id = text.split("\n$id_system$\n")[1]; //gets the code in-between the "$id_system$" signals
    if (id == undefined) {return MeholelHaKishurim_Code_Decoder(text);}
    let elements = id.split("\n&&&\n");
    elements.pop(-1); //remove the last element (need this to remove last element that means nothing, created by the split function)

    //repeatedly breaking down id text into arrays that we can use later
    for (let i = 0 ; i < elements.length ; i++) {
        if(elements[i].includes("\n")){elements[i] = elements[i].split("\n===\n");}
        elements[i] = Filter_White_Space(elements[i]);
        for (let j = 0 ; j < elements[i].length ; j++) {
            if(elements[i][j].includes(",,,")){elements[i][j] = elements[i][j].split(",,,");}
            elements[i][j] = Filter_White_Space(elements[i][j]);
            for (let k = 0 ; k < elements[i][j].length ; k++) {
                if(elements[i][j][k].includes("***")){elements[i][j][k] = elements[i][j][k].split("***");}
                elements[i][j][k] = Filter_White_Space(elements[i][j][k]);
                for (let l = 0 ; l < elements[i][j][k].length ; l++) {
                    if(elements[i][j][k][l].includes("^^^")){elements[i][j][k][l] = elements[i][j][k][l].split("^^^");}
                    elements[i][j][k][l] = Filter_White_Space(elements[i][j][k][l]);
                }
            }
        }
    }
    return elements;
}

/*
// IMPORTANT! Legecy Code, I know it's shit, I was young and stupid, I'm sowwy...
// 
*/
function MeholelHaKishurim_Code_Decoder (text) {
    let arr = []; //the array that we will return
    arr.push('5');
    arr.push(CreateHash());
    if (!text.includes(`map name="`) || !text.includes(`src="`) || !text.includes(`<area `)) {notify("yellow","נראה כי לכישוף שלך אין קוד זיהוי, פנה לתחום ניהול מידע וידע לתמיכה נוספת",12);return;}
    
    let main_settings = [];
    if (text.includes(`<center>`) && text.includes(`</center>`)) {main_settings.push('true');} else {main_settings.push('false');}
    main_settings.push('');
    arr.push(main_settings);

    let elements = text.split(`area shape="rect"`);
    elements = elements.slice(1); //remove the first part
    elements[elements.length-1] = elements[elements.length-1].split(`</map>`)[0]; //remove the last part
    let new_elements = [];
    for (let i = 0 ; i < elements.length ; i++) {
        let element_arr = [];
        let target = elements[i].includes(`target="_blank"`);
        let link;
        let alt;
        let coords;
        if (target) {target = "_blank";} else {target = "_self";}
        if (elements[i].includes(`href="`)) {link = elements[i].split(`href="`)[1].split(`"`)[0]} else {link = "#"}
        if (elements[i].includes(`title='`)) {alt = elements[i].split(`title='`)[1].split(`'`)[0]} else {alt = ""}
        if (elements[i].includes(`coords="`)) {coords = elements[i].split(`coords="`)[1].split(`"`)[0].split(",")} else {coords = [0,0,0,0]}
        let new_coords = [[coords[0],coords[1]],[coords[2],coords[3]]];


        element_arr.push("rect");
        element_arr.push(link);
        element_arr.push(target);
        element_arr.push(new_coords);
        element_arr.push(alt);

        new_elements.push(element_arr);
    }

    arr.push(new_elements);

    let image_part = text.split(`src="`)[1];
    image_part = image_part.split(`"`)[0];
    arr.push(image_part);

    return arr;
}

/*
// A function if given an array filters excess white space exclusive items in the ID arrays e.g: ["", "\n"]
// (Helper Function Used In The Function "Identification_Code_Decoder")
*/
function Filter_White_Space (obj) {
    if (Array.isArray(obj)) {
        return obj.filter(text => (text != "" && text != "\n"))
    }
    return obj;
}

/*
// A function that filters all the white space chars from the text
// e.g: ' ' or '    '
*/
function Filter_White_Text (txt) {
    return txt.replace(/ /g,''); //remove all white space from text
}

/*
// This is a function that is used only in "premade_code" page
// and is used to open the correct page and the right settings based on the code that the user is inserting
*/
function PremadeCodeHandler () {
    let textarea_text = document.getElementById("premade_code_textarea").value;
    if (textarea_text == "") {notify("yellow","ראשית הכנס קוד לתיבת הטקסט");return;}
    let dissambled_code = Identification_Code_Decoder(textarea_text);
    if (dissambled_code == undefined) {return;}
    let item_number = dissambled_code[0]; //the first item in the decoded array is the item number (read the documentation dummy)
    
    let new_tab = window.open(`${site_url}/SpellCaster/items/item_${item_number}/item_${item_number}.html`,`_blank`);
    new_tab.onload = function () {
        let script_div = new_tab.document.createElement("script");
        script_div.innerHTML = `loadPremadeCode(\`${textarea_text})\`);`;
        new_tab.document.querySelector("body").appendChild(script_div);
        script_div.parentElement.removeChild(script_div); //deleting the now useless script after it already ran in the new tab
    };
}

/*
// For some Kishufim, you want to have more than one Kishuf in your page, but with a different style (css).
// In order to not override the css between different Kishufim of the same type, we have the "hash"
// The "hash" is a long and random string of characters that changes whenever you make a change to the style.
// this ensures that when you have different hashes (practiclly always), the styles will not override each other.
// (Also, hash is such a cool name, i just feel like a little hacker now :D   )
*/
function CreateHash () {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let hash_len = 10;
    let hash = "";
    for (let i = 0 ; i < hash_len ; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
}

/*
// A function that gets in a specific column to pull from a SP list (all elements), and returns it as an array
// site_link: is the link of the SP site without it's ending (the base link) - e.g: "http://developer.app.airnet/Madmat71509/AnogJani"
// list_name: the name of the list you want to pull data from (the list's title, not the display-name)
// specific_column: if left untouched, pulls all the data. if specified, returns data from a specific column
// @useful columns may be: FileLeafRef==file / title / ID@
// !!!DON'T FORGET TO USE THE AWAIT KEY WORD WHEN CALLING THIS FUNCTION!!!
*/
async function fetch_from_sp_list (site_link, list_name, specific_column = "") {
    let api = `${site_link}/_api`;

    //getting the list's item-count
    let itemCount_response = await fetch(api + `/lists/getbytitle('${list_name}')/ItemCount`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let itemCount_json = await itemCount_response.json();
    let itemCount = itemCount_json.d.ItemCount;

    //getting data
    let response = await fetch(api + `/lists/getbytitle('${list_name}')/items?$select=${specific_column}&$top=${itemCount}`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let json = await response.json();

    //using the data
    let data_returned = [];
    for (let i = 0 ; i < itemCount ; i++) {
        if (specific_column == "") {data_returned.push(json.d.results[i]);}
        else                       {data_returned.push(json.d.results[i][specific_column]);}
    }
    return await data_returned;
}

/*********************************************************************************************************************/
/********************************************AND*THE*MADDNESS*STOPS*HERE**********************************************/
/*********************************************************************************************************************/

//calling the functions in this script that need to run everytime when loading a page:
create_loader();
create_nav_bar();
create_support_image();
create_notification();
//create_logger(); //make functionality unsable in Ezrachi mode

//handling the spinning screen-loader (only when the page is loading)
window.addEventListener("load", function(){
    document.getElementById("loader_wrapper").style.display = "none";
    document.querySelector("html").style.overflowY = "";
});