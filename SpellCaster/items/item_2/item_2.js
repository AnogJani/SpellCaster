let item_num = 2;
let original_color = "#000000";
let main_settings = [original_color,"calibri","20",255]; //the first one is suggested and the next two are calculated later
let links = [];

let code;
loadCode();

let max_sub_links_count = 15;

/*
//Push Functions
*/
function pushMainSettings () {
    //color
    let color = document.getElementById("color_input3").value;
    main_settings[0] = color;

    //font
    let font = document.getElementById("select_input3").value;
    main_settings[1] = font;

    //font-size
    let font_size = document.getElementById("number_input3").value;
    main_settings[2] = font_size;

    //transparency
    let transparency = document.getElementById("transp_input3").value;
    main_settings[3] = parseInt(transparency);

    GiveUserOutput();
}

function pushLinkInfo () {
    let main_link = document.getElementById("link_input2").value;
    let main_text = document.getElementById("name_input2").value;
    let additional_links_div = document.getElementById("additional_links");
    if (main_link.includes("'")) {main_link = correct_forbiden_chars(main_link);}
    if(main_text == "") {notify("red","וודא ששדה הכיתוב מלא");} else {
        if(main_link == ""){main_link = "#"} //if link not entered, just relocate to the same site
        let all_links = [];
        all_links.push([main_link,main_text]); //pushing the main title
        let sub_links = document.getElementsByClassName("sub_link_input2");
        let sub_texts = document.getElementsByClassName("sub_text_input2");
        for (let i = 0 ; i < sub_links.length ; i++) {
            if (sub_texts[i].value != '') { //if empty text or empty completly, discard else keep going
            if (sub_links[i].value == '') {sub_links[i].value = '#';} //if no link, make it relocate to the same site
            all_links.push([sub_links[i].value,sub_texts[i].value]);
            }
        }
        links.push(all_links);
        //reset input fields
        document.getElementById("link_input2").value = "";
        document.getElementById("name_input2").value = "";
        RemoveAllLinkField();
        GiveUserOutput();
    }
}

function pushSubLinkInfo () {
    let main_link = document.getElementById("link_input2_dialog").value;
    let main_text = document.getElementById("name_input2_dialog").value;
    if (main_link.includes("'")) {main_link = correct_forbiden_chars(main_link);}
    if(Filter_White_Text(main_text) == "") {notify("red","וודא ששדה הכיתוב מלא");} else {
        if(Filter_White_Text(main_link) == ""){main_link = "#"} //if link not entered, just relocate to the same site
        return [main_link,main_text];
    }
    return null;
}

/*
//Get Functions
*/
function getLinks () {
    return links;
}

/*
// Adding fields to the link element (to make the tab openable)
*/
function AddLinkField () {
    let additional_links_div = document.getElementById("additional_links");
    let new_additional_links_field_title = document.createElement("div");
    let new_additional_links_field = document.createElement("div");
    ////add titles
    if (additional_links_div.childElementCount == 0) {
        new_additional_links_field_title.classList.add("new_additional_links_field_title");
        new_additional_links_field_title.classList.add("flex");
        new_additional_links_field_title.innerHTML = `
        <div class="input_div">
            <lable class="input_lable">קישור נפתח</lable>
        </div>
        <div class="input_div">
            <lable class="input_lable">כיתוב נפתח</lable>
        </div>
        `;
        additional_links_div.appendChild(new_additional_links_field_title);
    }
    // too many 
    if (additional_links_div.childElementCount > max_sub_links_count) {
        notify("red","נפתחו יותר מדי שדות");
    // regular adding field
    } else {
        new_additional_links_field.classList.add("additional_links_field");
        new_additional_links_field.classList.add("flex");
        new_additional_links_field.innerHTML = `
        <div class="input_div">
            <input type="url" class="sub_link_input2 input2 text_input" placeholder="הכנס קישור אליו יוביל הכפתור" style="padding: 8px;font-size: 12px;">
        </div>
        <div class="input_div">
            <input type="text" class="sub_text_input2 input2 text_input" placeholder="הכנס כיתוב" style="padding: 8px;font-size: 12px;">
        </div>
        `;
        additional_links_div.appendChild(new_additional_links_field);
    }
}

function RemoveLinkField () {
    let additional_links_div = document.getElementById("additional_links");
    if (additional_links_div.childElementCount == 2) {
        additional_links_div.removeChild(additional_links_div.lastChild); //remove the field
        additional_links_div.removeChild(additional_links_div.lastChild); //remove the titles
    }
    if (additional_links_div.childElementCount > 0) {
        additional_links_div.removeChild(additional_links_div.lastChild);
    }
}

// Helper function
function RemoveAllLinkField () {
    let additional_links_div = document.getElementById("additional_links");
    let number_of_childern = additional_links_div.childElementCount;
    for (let i = 0 ; i <= number_of_childern ; i++) {
        RemoveLinkField();
    }
}

// Helper function
function ReturnMainColors (main_color) {
    let main_color_RGB = HEXtoRGB(main_color);
    let color_changing_amount = 20; // how much will the color chnge on hover?
    //saturation changer
    let margin = 50;
    if (main_color_RGB[0] > 255-margin  && main_color_RGB[1] < margin      && main_color_RGB[2] < margin    ) {color_changing_amount = 50;}
    if (main_color_RGB[0] < margin      && main_color_RGB[1] > 255-margin  && main_color_RGB[2] < margin    ) {color_changing_amount = 50;}
    if (main_color_RGB[0] < margin      && main_color_RGB[1] < margin      && main_color_RGB[2] > 255-margin) {color_changing_amount = 50;}
    let brightness = (main_color_RGB[0] + main_color_RGB[1] + main_color_RGB[2]) / 3; // calculating brightness
    let secondery_color;
    let third_color;
    let font_color;

    if (brightness >= 255 / 2) {
        secondery_color = RGBtoHEX([main_color_RGB[0] - color_changing_amount, main_color_RGB[1] - color_changing_amount, main_color_RGB[2] - color_changing_amount]);
        third_color = RGBtoHEX([main_color_RGB[0] - color_changing_amount*2, main_color_RGB[1] - color_changing_amount*2, main_color_RGB[2] - color_changing_amount*2]);
        font_color = "black";
    } else {
        secondery_color = RGBtoHEX([main_color_RGB[0] + color_changing_amount, main_color_RGB[1] + color_changing_amount, main_color_RGB[2] + color_changing_amount]);
        third_color = RGBtoHEX([main_color_RGB[0] + color_changing_amount*2, main_color_RGB[1] + color_changing_amount*2, main_color_RGB[2] + color_changing_amount*2]);
        font_color = "white";
    }
    //return [main_color, secondery_color, third_color, font_color];
    return [main_color+(main_settings[3].toString(16).padStart(2,0)), secondery_color+(main_settings[3].toString(16).padStart(2,0)), third_color+(main_settings[3].toString(16).padStart(2,0)), font_color];
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_div = document.getElementById("code_preview");
    let final_code_copy = document.getElementById("final_code_copy");
    let final_code_links = "";
    let final_code_colors = ReturnMainColors(main_settings[0]);
    let final_code_font_size = "";

    //generating all links (code)
    for (let i = 0 ; i < links.length ; i++) {
        //main link
        let icon_code = "";
        if (links[i].length > 1) {
            icon_code = `<i class="nami_down_icon"></i>`; //NOT WORKING FOR NOW IN SOME SITES "fas fa-caret-down"
        }
        final_code_links += `<li><a target="_self" href="` + links[i][0][0] + `">` + links[i][0][1] + icon_code + `</a>\n`;
        //sub links
        final_code_links += `<ul>`;
        if (links[i].length > 1) {
            for (let j = 1 ; j < links[i].length ; j++) {
                final_code_links += `<li><a target="_self" href="` + links[i][j][0] + `">` + links[i][j][1] + `</a>\n`;
            }
        }
        final_code_links += `</ul>`;
        final_code_links += `</li>\n`;
    }

    final_code_font_size = main_settings[2] + "px";

    let ID = Create_Identification_Code (item_num,[main_settings,links]); //code id
    let final_code = AssembleCode(code, ID, [final_code_colors[0],main_settings[1],final_code_colors[3],final_code_font_size,final_code_colors[1],final_code_colors[2],final_code_colors[1],final_code_colors[2],final_code_links]);
    code_preview_div.innerHTML = final_code; // preview
    final_code_copy.innerHTML = final_code; //copy
}


/*
// A function that gets a premade code and sets all the settings in the page to fit that original code
// This function is called from the "PremadeCodeHandler" script that is in the file "page_base_script.js"
*/
function loadPremadeCode(premade_code) {
    let dissambled_code = Identification_Code_Decoder(premade_code);
    document.getElementById("color_input3").value = dissambled_code[1][0];
    if(dissambled_code[1].length > 1){document.getElementById("select_input3").value = dissambled_code[1][1];}
    else {document.getElementById("select_input3").value = "calibri"} //released before this feature was made so I have to compensate for that
    if(dissambled_code[1].length > 2){document.getElementById("number_input3").value = parseInt(dissambled_code[1][2]);}
    else {document.getElementById("number_input3").value = 20} //released before this feature was made so I have to compensate for that
    if(dissambled_code[1].length > 3){document.getElementById("transp_input3").value = parseInt(dissambled_code[1][3]);}
    else {document.getElementById("transp_input3").value = 255} //released before this feature was made so I have to compensate for that
    
    links = dissambled_code[2];
    
    pushMainSettings(); //already gives user output in the function itself
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
code = `<head>
<meta charset="utf-8">
<style>
    .nami_center_wp {
        margin: 0%;
        width: 100%;
        direction: rtl;
        user-select: none;
        display: flex;
        justify-content: center;
    }

    .nami_nav_area {
        width: 100%;
        float: center;
        background: $--BP--$;
        font-family: $--BP--$;
    }

    .nami_nav_area * {
        z-index: 1;
    }

    .nami_nav_area::after {
        content: '';
        clear: both;
        display: block;
    }

    .nami_nav_area ul {
        list-style: none;
        text-align: left;
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 0px;
        padding: 0px;
    }

    .nami_nav_area > ul > li {
        float: right;
        min-width: 150px;
        border: 1px solid #52525282;
        color: $--BP--$;
        position: relative;
    }

    .nami_nav_area ul li a {
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        flex-shrink: 1;
        height: 50px;
        font-size: $--BP--$;
        text-align: center;
        text-decoration: none;
        color: inherit;
        padding: 15px 20px;
        display: block;
        justify-content: center;
        align-items: center;
    }

    .nami_nav_area ul li:hover a {
        background: $--BP--$;
    }

    .nami_nav_area ul ul {
        position: absolute;
        min-width: 150px;
        width: 100%;
        padding: 0;
        display: none;
        right:0%;
        top: 100%;
    }

    .nami_nav_area ul li:hover > ul {
        display: block;
    }

    .nami_nav_area ul ul li:hover a {
        background: $--BP--$;
    }

    .nami_nav_area ul ul li {
        position: relative;
    }

    .nami_nav_area ul ul ul {
        top: 0%;
        right: 100%;
    }

    .nami_down_icon { /*dropdown icon*/
        font-size: 14px;
        color: inherit;
        margin-right: 7px;
    }

    @supports not (-ms-ime-mode: unset) { /*Chrome Detector*/
        .nami_nav_area > ul > li {
            min-width: 150px;
            width: inherit; 
        }
        .nami_nav_area ul li:hover a {
            background: $--BP--$;
        }
        .nami_nav_area ul ul li:hover a {
            background: $--BP--$;
        }
        .nami_nav_area ul li a {
            height: calc(100% - 30px);
            display: flex;
        }
    }
</style>
</head>
<body>
<div class="nami_center_wp">
<div class="nami_nav_area">
<ul>
$--BP--$
</ul>
</div>
</div>
</body>`;
}