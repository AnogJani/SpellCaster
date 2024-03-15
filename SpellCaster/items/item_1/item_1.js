let item_num = 1;
let main_settings = ["true","true","true","false","true"];
let bg_image = "";
let logo_image = "";

let code;
loadCode();

/*
//Push Functions
*/
function pushMainSettings () {
    //side_bar
    let side_bar_boolean = document.getElementById("checkbox1_input3");
    main_settings[0] = side_bar_boolean.checked;

    //nav_bar
    let nav_bar_boolean = document.getElementById("checkbox2_input3");
    main_settings[1] = nav_bar_boolean.checked;

    //fixed_bg
    let fixed_bg_boolean = document.getElementById("checkbox3_input3");
    main_settings[2] = fixed_bg_boolean.checked;

    //scroll_removal
    let scroll_removal_boolean = document.getElementById("checkbox4_input3");
    main_settings[3] = scroll_removal_boolean.checked;

    //SharePoint bar
    let SharePoint_bar_boolean = document.getElementById("checkbox5_input3");
    main_settings[4] = SharePoint_bar_boolean.checked;

    GiveUserOutput();
}

function pushImageInfo () {
    let image = document.getElementById("image_input1").value;
    bg_image = image;
    GiveUserOutput();
    

}

function pushLogoInfo () {
    let logo = document.getElementById("logo_input1").value;
    logo_image = logo;

    GiveUserOutput();
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_image = document.getElementById("code_preview_image");
    let final_code_copy = document.getElementById("final_code_copy");

    let final_code_bg_image = "";
    let final_code_side_nav = "";
    let final_code_up_nav = "";
    let final_code_nav_marg = "";
    let final_code_fixed_bg = "";
    let final_code_cont_marg = "";
    let final_code_nav_hiding_script = "";
    let final_code_scroll_removal_script = "";
    let final_logo_script = "";

    final_code_bg_image = bg_image;
    let valid_background_image = Filter_White_Text(bg_image) ? `url('${bg_image}')` : ``;
    document.getElementById("preview_background").style.backgroundImage = valid_background_image;
    document.getElementById("preview_logo").src = Filter_White_Text(logo_image) ? logo_image : `../../PublishingImages/SP_logo.png`;    
    if (Filter_White_Text(logo_image)) {final_logo_script = `
    let favicon = document.getElementById("favicon");
    favicon.href = "${logo_image}";
    `;}
    if(main_settings[0]) {final_code_side_nav = `#sideNavBox {display:none;}`;}
    if(main_settings[1]) {final_code_up_nav = `#s4-titlerow {display: none !important;}`;}
    if(main_settings[4]) {final_code_up_nav += `
    #suiteBarDelta {
        display: none;
    }
    #reveal_sp_top_nav {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgb(211, 211, 211);
        position: fixed;
        top: 8px;
        left: 10px;
        cursor: pointer;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: background-color 0.1s ease-in-out;
    }
    #reveal_sp_top_nav .settings_icon{
        background-image: url("/_layouts/15/images/spcommon.png");
        width: 100%;
        height: 100%;
        background-size: 240px;
        background-position: 85px 140px;
    }
    #reveal_sp_top_nav:hover {
        background-color: rgb(192, 192, 192);
      }
    #fullscreenmodebox {
        display: none;
    }
    #RibbonContainer-TabRowRight {
        padding-left: 30px;  
    }`;}
    if(!main_settings[0] && main_settings[1]) {final_code_nav_marg = `margin-right: 220px;`;}
    if(main_settings[0] || main_settings[1]) {final_code_cont_marg = `margin: 0px;`;}
    if(!main_settings[2]) {final_code_fixed_bg = `background-attachment: fixed;`;}
    if (main_settings[3]) {final_code_scroll_removal_script = `
    var sp_workspace = document.getElementById("s4-workspace");
    var edit_mode = document.getElementById("Ribbon.EditingTools.CPEditTab");
    if (!edit_mode) {sp_workspace.style.overflowY = 'hidden'}`;}
    if(main_settings[4]) {final_code_nav_hiding_script = `
    <div id="reveal_sp_top_nav" title="פתיחת ניווט עליון &#013(עוצב באמצעות מחולל הכישופים)" onclick='
    var top_nav = document.getElementById("suiteBarDelta");
    var top_nav_hover_div = document.getElementById("reveal_sp_top_nav");
    if (top_nav.style.display == "block") {
        try { /*Explorer is Sh!t*/
            top_nav.style.setAttribute("display","none");
            top_nav_hover_div.style.setAttribute("top","8px");
        } catch (err) {
            top_nav.style="display:none";
            top_nav_hover_div.style="top:8px";
        }
    } else {
        try { /*Explorer is S@t@n*/
            top_nav.style.setAttribute("display","block");
            top_nav_hover_div.style.setAttribute("top","58px");
        } catch (err) {
            top_nav.style="display:block";
            top_nav_hover_div.style="top:58px";
        }
    }'>
        <span class="settings_icon"></span>
    </div>`;}

    let ID = Create_Identification_Code (item_num,[main_settings,bg_image,logo_image]); //code id
    let final_code = AssembleCode(code,ID,[final_code_side_nav + "\n" + final_code_up_nav,final_code_bg_image,final_code_fixed_bg,final_code_bg_image,final_code_fixed_bg,final_code_cont_marg,final_code_nav_marg,final_code_nav_hiding_script,final_code_scroll_removal_script,final_logo_script]);
    //code_preview_image.setAttribute("src",bg_image);
    //code_preview_image.setAttribute("style","max-width:50%");
    //code_preview_image.setAttribute("style","width:500px");
    final_code_copy.innerHTML = final_code; //copy
    showPreview();
}

/*
// 
*/
function showPreview() {
    document.getElementById("preview_side_nav").style.display = ""+main_settings[0] == "true"? 'none':'block';
    document.getElementById("preview_top_nav").style.display = ""+main_settings[1] == "true"? 'none':'block';
    document.getElementById("preview_SP_nav").style.display = ""+main_settings[4] == "true"? 'none':'block';
    document.getElementById("preview_background").style.overflowY = ""+main_settings[3] == "true"? 'hidden':'scroll';
    document.getElementById("preview_background").style.backgroundAttachment = ""+main_settings[2] == "true"? 'local':'scroll';
}

function loadPremadeCode(premade_code) {
    let dissambled_code = Identification_Code_Decoder(premade_code);
    if(dissambled_code[1][0] == "true"){document.getElementById("checkbox1_input3").checked = true;}
    else {document.getElementById("checkbox1_input3").checked = false;}
    if(dissambled_code[1][1] == "true"){document.getElementById("checkbox2_input3").checked = true;}
    else {document.getElementById("checkbox2_input3").checked = false;}
    if(dissambled_code[1][2] == "true"){document.getElementById("checkbox3_input3").checked = true;}
    else {document.getElementById("checkbox3_input3").checked = false;}
    if(dissambled_code[1][3] == "true"){document.getElementById("checkbox4_input3").checked = true;}
    else {document.getElementById("checkbox4_input3").checked = false;}
    if(dissambled_code[1][4] == "true"){document.getElementById("checkbox5_input3").checked = true;}
    else {document.getElementById("checkbox5_input3").checked = false;}

    document.getElementById("image_input1").value = dissambled_code[2];

    document.getElementById("logo_input1").value = dissambled_code[3];
    
    pushMainSettings(); //already gives user output in the function itself
    pushImageInfo();
    pushLogoInfo();
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
code = `<head>
<style>
    $--BP--$
    #s4-bodyContainer {
        background-image:url("$--BP--$");
        background-position: center top;
        background-repeat: no-repeat;
        background-size: cover;
        min-height: calc(100% - 35px);
        $--BP--$
    }
    #s4-workspace {
        background-image:url("$--BP--$");
        background-size: cover;
        $--BP--$
    }
    #contentBox {
        $--BP--$
        $--BP--$
    }
    [id^="status_quotactl00"] {
        display: none;  /*storage warning*/
    }
</style>
</head>
<body>
$--BP--$
<script>$--BP--$
</script>
<script>$--BP--$
</script>
</body>`;
}