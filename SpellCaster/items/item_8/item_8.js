let item_num = 8;
let main_settings = ["#FFFFFF","500","false","10"];
let slides = [];
let hash = "";

let code;
loadCode();

let timer_started = false;

/*
//Push Functions
*/
function pushMainSettings () {
    //color
    let color = document.getElementById("color_input3").value;
    if(color != null || color != ""){
        main_settings[0] = color;
    }

    //height
    let height = document.getElementById("height_input3").value;
    main_settings[1] = height;

    //autoplay
    let autoplay = document.getElementById("checkbox_input3");
    main_settings[2] = autoplay.checked;
    preview_run = autoplay.checked;

    //seconds
    let seconds = document.getElementById("second_input3").value;
    main_settings[3] = seconds;
    preview_slowness = seconds;

    GiveUserOutput();
}

function pushSlideInfo () {
    let image = document.getElementById("image_input1").value;
    let link = document.getElementById("link_input1").value;
    if(slides==null || slides==""){ slides = [];}
    if (link.includes("'")) {link = correct_forbiden_chars(link);}
    if(Filter_White_Text(image) == "") {notify("red","וודא שכל השדות מלאים");} else {
        slides.push([image,link]);
        //reset input fields
        document.getElementById("image_input1").value = "";
        document.getElementById("link_input1").value = "";
        GiveUserOutput();
    }
}

/*
//Get Functions
*/
function getSlides () {
    return slides;
}

// Helper function
function ShadeColor (main_color) {
    let main_color_RGB = HEXtoRGB(main_color);
    let brightness = (main_color_RGB[0] + main_color_RGB[1] + main_color_RGB[2]) / 3; // calculating brightness
    let shade_color = "white"; //start at white
    const brightness_cutoff = 180; //RGB goes from 0(black) -> 255(white)

    if (brightness >= brightness_cutoff) {
        shade_color = "black"; // if light color, change to black
    }

    return shade_color;
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_div = document.getElementById("code_preview");
    let final_code_copy = document.getElementById("final_code_copy");
    let final_code_slides = "";
    let final_code_dots = "";
    let final_code_speed = "";

    hash = CreateHash();

    //generating the slides (code)
    for (let i = 0 ; i < slides.length ; i++) {
        let first_slide = " activeSlide";
        let link = `<a class="slide_link" target="_blank" href="${slides[i][1]}"></a>`;
        if (i != 0) {first_slide = "";}
        if (Filter_White_Text(slides[i][1]) == "") {link = `<a class="slide_link disabled_slide_link"></a>`;}
        final_code_slides += `
        <div class="slide${first_slide}">
        <img class="slide_image" src="${slides[i][0]}" onerror="this.onerror=null;this.src='${site_url}/PublishingImages/error.png'">
        ${link}
        </div>` + "\n";
    }

    for (let i = 0 ; i < slides.length ; i++) {
        final_code_dots += `<span class="dot" onclick="set_current_slide(this,${i})"></span>`;
    }
    
    if (main_settings[2]) {final_code_speed = `1`} else {final_code_speed = `0`}

    let ID = Create_Identification_Code (item_num,[hash,main_settings,slides]); //code id
    let final_code = AssembleCode(code,ID,[hash,main_settings[0],ShadeColor(main_settings[0]),main_settings[1],hash,final_code_slides,final_code_dots,main_settings[3],final_code_speed]); //just shoving all the parameters in
    code_preview_div.innerHTML = final_code; //preview
    final_code_copy.innerHTML = final_code; //copy
    set_current_slide(document.querySelector(".nami_container"),0);
    let autoplay_timer = window.setInterval(function () {}, 0);
    if (timer_started) {timer_started = true} else {clearInterval(autoplay_timer);}
    let all_slideshows = document.querySelectorAll(".slideshow_container");
    for (let i = 0; i < all_slideshows.length; i++) {
        set_current_slide(all_slideshows[i], 0);
        start_timer(all_slideshows[i]);
    }
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
    document.getElementById("color_input3").value = dissambled_code[2][0];
    document.getElementById("height_input3").value = dissambled_code[2][1];
    if(dissambled_code[2][2] == "true"){document.getElementById("checkbox_input3").checked = true;}
    else {document.getElementById("checkbox_input3").checked = false;}
    document.getElementById("second_input3").value = dissambled_code[2][3];
    
    //slides
    slides = dissambled_code[3];
    for (let i = 0 ; i < slides.length ; i++) {
        if (slides[i].length == 1) {slides[i].push("");} //if there is no link in the slide
    }
    
    pushMainSettings(); //update settings and immidiatly give the user-output
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
let gallery_functionality_code;
fetch("gallery_functionality_code.js").then(data => {
    data.text().then(txt => {
        eval(txt);
        gallery_functionality_code = txt;
        code = `
<head>
<meta charset="utf-8">
<style>

    #$--BP--$ {
        --main-color: $--BP--$;
        --shade: $--BP--$;
        height: $--BP--$px;
    }

    .nami_container {
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        direction: rtl;
        user-select: none;
    }

    .slideshow_container {
        height: inherit;
        position: relative;
        margin: auto;
        border-radius: 10px;
    }

    .slide {
        opacity: 0;
        width: 100%;
        position: absolute;
        top: 0;
        height: inherit;
    }

    .activeSlide {
        opacity: 1;
    }

    .activeSlide.slide_link {
        z-index: 2;
    }

    /* Next & previous buttons */

    .controls>a {
        cursor: pointer;
        position: absolute;
        text-decoration: none !important;
        top: 50%;
        width: auto;
        padding: 16px;
        margin-top: -22px;
        color: var(--main-color);
        font-weight: bold;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.2);
        transition: 0.6s ease;
        border-radius: 5px 0 0 5px;
    }

    /* On hover, add a black background color with a little bit see-through */

    .controls>a:hover {
        background-color: rgba(0, 0, 0, 0.4);
    }

    /* Position the "next button" to the right */

    .prev_slide_button {
        left: 0;
        border-radius: 0 5px 5px 0 !important;
    }

    /* Image Style */

    .slide_image {
        border-radius: 10px;
        filter: drop-shadow( 0 0.5rem 1rem rgba(0, 0, 0, 0.2)) !important;
        vertical-align: middle;
        object-fit: contain;
        position: absolute;
        width: 100%;
        height: 100%;
        right: 50%;
        transform: translate(50%, 0);
    }

    /* Link Style */

    .slide_link {
        z-index: 1;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 10px;
        margin-top: 10px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        opacity: 0.4;
        box-shadow: 0 0 7px 2px var(--main-color);
        background-image: url("${site_url}/PublishingImages/slideshow_link_image.png");
        background-size: contain;
        transition: 0.15s ease;
    }

    .slide_link:hover {
        opacity: 0.8;
    }

    .disabled_slide_link {
        cursor: auto;
        opacity: 0;
    }

    .disabled_slide_link:hover {
        opacity: 0;
    }

    /* Number text */

    .slide_counter {
        color: var(--main-color);
        background-color: rgba(0, 0, 0, 0.3);
        font-size: 15px;
        padding: 8px 15px;
        position: absolute;
        right: 50%;
        bottom: 0;
        transform: translate(50%, 0);
        border-radius: 5px 5px 0 0;
        direction: ltr;
        user-select: auto;
    }

    /* The dots/bullets/indicators */

    .dot {
        height: 15px;
        width: 15px;
        margin: 12px 4px 0px 4px;
        background-color: var(--main-color);
        border-radius: 50%;
        display: inline-block;
        cursor: pointer;
        opacity: 0.7;
    }

    .activeDot, .activeDot:hover {
        box-shadow: 0 0 0 2px var(--main-color);
    }

    .dot::after {
        content: '';
        display: block;
        border-radius: 50%;
        height: 15px;
        width: 15px;
        background-color: var(--shade);
        transition: opacity 0.6s ease;
        opacity: 0.2;
    }

    .dot:hover::after {
        opacity: 0.4;
    }

    .activeDot::after {
        opacity: 0.6;
    }

    .activeDot:hover::after {
        opacity: 0.8;
    }
</style>
</head>

<body>
<div class="nami_container" id="$--BP--$">
    <div class="slideshow_container">
        $--BP--$
        <div class="controls">
            <a class="next_slide_button" onclick="inc_slide(this,-1)">❮</a>
            <a class="prev_slide_button" onclick="inc_slide(this,1)">❯</a>
        </div>
        <div class="slide_counter"></div>
    </div>
    <div style="text-align:center">
        <div>
            $--BP--$
        </div>
    </div>
    <div class="timer" time="0" slowness="$--BP--$" speed="$--BP--$">
    </div>
</div>
<script>
    ${gallery_functionality_code}
</script>
</body>
`;
    })
})
}