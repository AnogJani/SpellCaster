let item_num = 3;
let main_settings = ["#000000","#444444","calibri","30","true"];
let link = ["#",""];
let hash = "";

const font_enlargening = 4;

let code;
loadCode();

/*
//Push Functions
*/
function pushMainSettings () {
    //bgcolor
    let bgcolor = document.getElementById("color_input3_1").value;
    if(bgcolor != null || bgcolor != ""){
        main_settings[0] = bgcolor;
    }

    //bgcolor on hover
    let bgcolorhover = document.getElementById("color_input3_2").value;
    if(bgcolorhover != null || bgcolorhover != ""){
        main_settings[1] = bgcolorhover;
    }

    //font
    let font = document.getElementById("select_input3").value;
    main_settings[2] = font;

    //font size
    let fontsize = document.getElementById("number_input3").value;
    main_settings[3] = fontsize;

    //new tab
    let newtab = document.getElementById("checkbox1_input3").checked;
    main_settings[4] = newtab;

    GiveUserOutput();
}

/*
//Push Functions
*/
function pushButtonInfo () {
    let link_val = document.getElementById("link_input1").value;
    let name_val = document.getElementById("name_input1").value;
    if (link_val.includes("'")) {link_val = correct_forbiden_chars(link_val);}
    if(Filter_White_Text(link_val) == "" || Filter_White_Text(name_val) == "") {notify("red","וודא שכל השדות מלאים");} else {
        link = [link_val,name_val];
        GiveUserOutput();
    }
}

// Helper function
function FontColor (main_color) {
    let main_color_RGB = HEXtoRGB(main_color);
    let brightness = (main_color_RGB[0] + main_color_RGB[1] + main_color_RGB[2]) / 3; // calculating brightness
    let font_color = "white"; //start at white
    const brightness_cutoff = 200; //RGB goes from 0(black) -> 255(white)

    if (brightness >= brightness_cutoff) {
        font_color = "black"; // if light color, change to black
    }

    return font_color;
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_div = document.getElementById("code_preview");
    let final_code_copy = document.getElementById("final_code_copy");
    let final_new_tab = "_self";

    if (main_settings[4]) {final_new_tab = "_blank"}

    hash = CreateHash();

    let ID = Create_Identification_Code (item_num,[hash,main_settings,link]); //code id
    let final_code = AssembleCode(code,ID,[hash,main_settings[2],main_settings[3],main_settings[0],FontColor(main_settings[0]),hash,parseInt(main_settings[3])+font_enlargening,main_settings[1],hash,link[0],final_new_tab,link[1]]);
    code_preview_div.innerHTML = final_code; // preview
    final_code_copy.innerHTML = final_code; //copy
}

/*
// A function that gets a premade code and sets all the settings in the page to fit that original code
// This function is called from the "PremadeCodeHandler" script that is in the file "page_base_script.js"
*/
function loadPremadeCode(premade_code) {
    let dissambled_code = Identification_Code_Decoder(premade_code);

    //hash
    if (hash == "") {hash = CreateHash();} else {hash = dissambled_code[1];}

    //main settings
    document.getElementById("color_input3_1").value = dissambled_code[2][0];
    document.getElementById("color_input3_2").value = dissambled_code[2][1];
    document.getElementById("select_input3").value = dissambled_code[2][2];
    document.getElementById("number_input3").value = dissambled_code[2][3];
    if(dissambled_code[2][4] == "false"){document.getElementById("checkbox1_input3").checked = false;}
    else {document.getElementById("checkbox1_input3").checked = true;}

    //main button
    document.getElementById("link_input1").value = dissambled_code[3][0];
    document.getElementById("name_input1").value = dissambled_code[3][1];
    
    pushMainSettings(); //already gives user output in the function itself
    pushButtonInfo(); //already gives user output in the function itself
}


/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
code = `<head>
<style>

    .$--BP--$.hover_button {
        position: relative;
        padding: 0px;
        margin: 0px;
        font-family: $--BP--$;
        font-size: $--BP--$px;
        min-width: 200px;
        max-width: 300px;
        height: 100px;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.527) 0px 3px 10px;
        border: none;
        border-top: 1px solid rgb(180, 180, 180);
        border-left: 1px solid rgb(180, 180, 180);
        background-color: $--BP--$;
        text-align: center;
        color: $--BP--$;
        cursor: pointer;
        transition: 0.15s;
        user-select: none;
    }

    .$--BP--$.hover_button:hover {
        font-size: $--BP--$px;
        background-color: $--BP--$;
        box-shadow: rgba(0, 0, 0, 0.527) 0px 3px 12px;
    }

    .hover_button:focus {
        outline-width: 0px;
    }
</style>
</head>
<body>
<button type="button" class="$--BP--$ hover_button" onclick="window.open('$--BP--$','$--BP--$');">$--BP--$</button>
</body>`;
}
