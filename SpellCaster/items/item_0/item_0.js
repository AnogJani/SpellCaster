let item_num = 0;
let main_settings = ["#000000","true","calibri","true", 100];
let images = [];
let links = [];

let code;
loadCode();

/*
//Push Functions
*/
function pushMainSettings () {
    //color
    let color = document.getElementById("color_input3").value;
    if(color != null || color != ""){
        main_settings[0] = color;
    }

    //break-line
    let line_boolean = document.getElementById("checkbox_input3");
    main_settings[1] = line_boolean.checked;

    //font
    let font = document.getElementById("select_input3").value;
    main_settings[2] = font;

    //lightened background on image hover
    let image_bg_boolean = document.getElementById("image_bg_checkbox_input3");
    main_settings[3] = image_bg_boolean.checked;

    //image width
    let image_width = document.getElementById("number_input3");
    main_settings[4] = image_width.value;
    
    GiveUserOutput();
}

function pushImageInfo () {
    let link = document.getElementById("link_input1").value;
    let text = document.getElementById("name_input1").value;
    let image = document.getElementById("image_input1").value;
    if(images==null || images==""){ images = [];}
    if (link.includes("'")) {link = correct_forbiden_chars(link);}
    if(Filter_White_Text(link) == "" || Filter_White_Text(text) == "" || Filter_White_Text(image) == "") {notify("red","וודא שכל השדות מלאים");} else {
        images.push([link,text,image]);
        //reset input fields
        document.getElementById("link_input1").value = "";
        document.getElementById("name_input1").value = "";
        document.getElementById("image_input1").value = "";
        GiveUserOutput();
    }
}

function pushLinkInfo () {
    let link = document.getElementById("link_input2").value;
    let text = document.getElementById("name_input2").value;
    if(links==null || links==""){ links = [];}
    if (link.includes("'")) {link = correct_forbiden_chars(link);}
    if(Filter_White_Text(link) == "" || Filter_White_Text(text) == "") {notify("red","וודא שכל השדות מלאים");} else {
        links.push([link,text]);
        //reset input fields
        document.getElementById("link_input2").value = "";
        document.getElementById("name_input2").value = "";
        GiveUserOutput();
    }
}

/*
//Get Functions
*/
function getImages () {
    return images;
}

function getLinks () {
    return links;
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_div = document.getElementById("code_preview");
    let final_code_copy = document.getElementById("final_code_copy");
    let final_code_images = "";
    let final_code_links = "";
    let final_code_line = "";
    let final_font_size = "22px";
    let final_code_image_background = "";

    //generating images (code)
    for (let i = 0 ; i < images.length ; i++) {
        final_code_images += `	<button class="nami_footer_images_container" onclick="window.open(\'`+images[i][0]+`\',\'_self\');" type="button">
        <img class="nami_footer_images_image" title="`+images[i][1]+`" src="`+images[i][2]+`" onerror="this.onerror=null;this.src='${site_url}/PublishingImages/error.png'"></img>
        <p class="nami_footer_images_text">`+images[i][1]+`</p>
        </button>` + "\n";
    }

    //generating links (code)
    for (let i = 0 ; i < links.length ; i++) {
        final_code_links += `<button class="nami_footer_links_link" onclick="window.open(\'`+links[i][0]+`\',\'_blank\');" type="button">`+links[i][1]+`</button>` + "\n";
    }

    //generating break line (code)
    if(main_settings[1]) {final_code_line = `<div class="nami_footer_line"></div>`;} else {final_code_line = ``;}

    //adjusting the font sizes according to the font family
    if(main_settings[2] == "calibri") {final_font_size = "22px";} else
    if(main_settings[2] == "aduma")   {final_font_size = "24px";}

    //generating break line (code)
    if(main_settings[3]) {final_code_image_background = `#E6E6FADD`;} else {final_code_image_background = `none`;}

    let ID = Create_Identification_Code (item_num,[main_settings,images,links]); //code id
    let final_code = AssembleCode(code,ID,[main_settings[0],main_settings[2],final_font_size,main_settings[4],final_code_image_background,main_settings[0],final_code_images,final_code_line,final_code_links]); //just shoving all the parameters in
    code_preview_div.innerHTML = final_code; // preview
    final_code_copy.innerHTML = final_code; //copy
}


/*
// A function that gets a premade code and sets all the settings in the page to fit that original code
// This function is called from the "PremadeCodeHandler" script that is in the file "page_base_script.js"
*/
function loadPremadeCode(premade_code) {
    let dissambled_code = Identification_Code_Decoder(premade_code);
    //main settings
    document.getElementById("color_input3").value = dissambled_code[1][0];
    if(dissambled_code[1][1] == "true"){document.getElementById("checkbox_input3").checked = true;}
    else {document.getElementById("checkbox_input3").checked = false;}
    if(dissambled_code[1].length > 2){document.getElementById("select_input3").value = dissambled_code[1][2];}
    else {document.getElementById("select_input3").value = "calibri"} //the font feature came out after the release of the Kishuf so we have to acount for that
    if(dissambled_code[1].length > 3){
        if(dissambled_code[1][3] == "true"){document.getElementById("image_bg_checkbox_input3").checked = true;}
        else {document.getElementById("image_bg_checkbox_input3").checked = false;}
    } else {document.getElementById("image_bg_checkbox_input3").checked = true} //the image_background feature came out after the release of the Kishuf so we have to acount for that
    if(dissambled_code[1].length > 4){
        document.getElementById("number_input3").value = dissambled_code[1][4];

    } else {document.getElementById("number_input3").value = 100} //the image_width feature came out after the release of the Kishuf so we have to acount for that

    images = dissambled_code[2];
    links = dissambled_code[3];
    
    pushMainSettings(); //update settings and immidiatly give the user-output
}


/*
// A dialog that lets the user choose which array they would like to change: the images or the links
*/
function edit_dialog() {
    open_general_dialog();
    let window = document.querySelector("#general_dialog_carpet");
    window.innerHTML = 
    `
    <div id="general_dialog_window" class="general_dialog_window">
    <div id="dialog_nav">
        <div id="top_navi_dialog_buttons">
            <button type="button" class="dialog_exit_button" onclick="exit_general_dialog();GiveUserOutput();"><i class="fas fa-times"></i></button>
        </div>
        <div class="edit_images_buttons">
            <img onclick="exit_general_dialog();edit_nodes(getImages(),1);" title="ערוך תמונות" class="image_btn" src="../../../PublishingImages/upper_images.png">
            <img onclick="exit_general_dialog();edit_nodes(getLinks(),1);" title="ערוך לינקים תחתונים" class="image_btn" src="../../../PublishingImages/bottomer_links.png">
        </div>
        <!--<div class="flex">
        <button class="nami_button edit_button" type="button" onclick="exit_general_dialog();edit_nodes(getImages(),1);"><i class="fas fa-pen-to-square"></i> ערוך תמונות </button>
        <button class="nami_button edit_button" type="button" onclick="exit_general_dialog();edit_nodes(getLinks(),1);"><i class="fas fa-pen-to-square"></i> ערוך לינקים תחתונים </button>
        </div>-->
        `
    ;
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
code = `
<head>
<meta charset="utf-8">
<style>
.nami_center_wp {
    width: 100%;
    user-select: none;
    display: flex;
    justify-content: center;
}

.nami_container_wp {
    color: $--BP--$;
}

.nami_footer_links_link, .nami_footer_images_text {
    font-family: $--BP--$;
    font-size: $--BP--$;
    text-shadow: 0px 0px 6px rgba(0,0,0,0.5);
}

.nami_footer_images {
    display:flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    padding-top: 25px;
}

.nami_footer_images_container {
    cursor: pointer;
    background: none;
    color: inherit;
    width: $--BP--$px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0px 20px 5px 20px;
    border-radius: 10px;
    border: none;
    transition:0.25s;
}

.nami_footer_images_container:hover {
    color: inherit;
    background: $--BP--$;
    margin-top: -20px;
    padding-bottom: 15px;
}

.nami_footer_images_container:hover > p {
    filter: brightness(90%);
}

.nami_footer_images_image {
    width: 100%;
    border-radius: 50%;
    margin-bottom: 10px;
    margin-top: 10px;
}

.nami_footer_images_text {
    width: 100%;
    text-align: center;
}

.nami_footer_line {
    width: 100%;
    height: 2px;
    background-color: $--BP--$;
    filter: brightness(90%);
    border-radius: 2px;
    border: none;
    margin: 2px;
}

.nami_footer_links {
    flex-wrap: wrap;
    display:flex;
    justify-content: center;
    align-items: flex-start;
}

.nami_footer_links_link {
    width: 100%;
    text-align: center;
    cursor: pointer;
    background: none;
    color: inherit;
    width: 120px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px 5px 0px 5px;
    border-radius: 7px;
    border: none;
    text-decoration: none;
    overflow: hidden;
    transition:0.2s;
}

.nami_footer_links_link:hover {
    color: inherit;
    filter: brightness(80%);
    text-decoration: underline;
    background: none;
}
</style>
</head>
<body>
<div class="nami_container_wp">

<div class="nami_footer_images">
$--BP--$
</div>
$--BP--$
<div class="nami_footer_links">
$--BP--$
</div>
</div>
</body>`;
}