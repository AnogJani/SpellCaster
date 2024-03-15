let item_num = 6;
let main_settings = ["#000000","calibri","20","false"];
let images = [];

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

    //font
    let font = document.getElementById("select_input3").value;
    main_settings[1] = font;

    //font size
    let fontsize = document.getElementById("number_input3").value;
    main_settings[2] = fontsize;

    //show only on scroll
    let scroll_boolean = document.getElementById("checkbox_input3");
    main_settings[3] = scroll_boolean.checked;

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

/*
//Get Functions
*/
function getImages () {
    return images;
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_div = document.getElementById("code_preview");
    let final_code_copy = document.getElementById("final_code_copy");
    let final_code_images = "";
    let final_code_scroll = "";

    //generating images (code)
    for (let i = 0 ; i < images.length ; i++) {
        final_code_images += `<a class="a-element" href="${images[i][0]}" style="transition: all 100ms ease-in-out ${i*50}ms,transform 100ms ease-in-out;">
        <img src="${images[i][2]}" onerror="this.onerror=null;this.src='${site_url}/PublishingImages/error.png'">
        <p>${images[i][1]}</p>
        </a>` + "\n";
    }

    //generating scroll functionality (code)
    if(main_settings[3]) {final_code_scroll =
    `<script>
    let nav_element = document.getElementById("nami_side_nav");
    nav_element.className = "hide";
    let content = document.getElementById("s4-workspace");
    function scroll_handle () {
      if (content.scrollTop > 600) {nav_element.className = "show"} else {nav_element.className = "hide"}
    }
    content.addEventListener("scroll",scroll_handle);
    </script>`;
    } else {final_code_scroll = ``;}

    let ID = Create_Identification_Code (item_num,[main_settings,images]); //code id
    let final_preview_code = AssembleCode(code,ID,["relative",main_settings[0],main_settings[1],main_settings[2],final_code_images,final_code_scroll]); //just shoving all the parameters in
    let final_code = AssembleCode(code,ID,["fixed",main_settings[0],main_settings[1],main_settings[2],final_code_images,final_code_scroll]); //just shoving all the parameters in
    code_preview_div.innerHTML = final_preview_code; // preview
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
    document.getElementById("select_input3").value = dissambled_code[1][1];
    document.getElementById("number_input3").value = dissambled_code[1][2];
    if(dissambled_code[1][3] == "true"){document.getElementById("checkbox_input3").checked = true;}
    else {document.getElementById("checkbox_input3").checked = false;}
    
    images = dissambled_code[2];
    
    pushMainSettings(); //update settings and immidiatly give the user-output
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
code = `
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      
#nami_side_nav {
  position: $--BP--$;
  width:80px;
  display:flex;
  align-items:center;
  top: 35%;
  right: 0;
  transition: all 200ms ease-in-out;
  user-select: none;
  z-index: 100;
}

.show .a-element {
    opacity: 1;
    right: 20px;
}

.hide .a-element {
    opacity: 0;
    right: -100px;
}

.elements {
  width:100%;
}

.a-element {
  display:flex;
  align-items:center;
  justify-content:center;
  text-decoration: none;
  position: relative;
  padding: 10px 0px;
}

.a-element:hover {
  transform: translateX(-5px);
}

.a-element img {
  display:block;
  position:relative;
  width: 70px;
  height: 70px;
  object-fit:cover;
  border-radius:50%;
  transition: 100ms ease;
}

.a-element:hover img {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.7);
}

.a-element p {
  color: $--BP--$;
  font-family: $--BP--$;
  font-size: $--BP--$px;
  opacity: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: absolute;
  right: 110%;
  white-space: nowrap;
  transition: 300ms ease;
}

.a-element:hover p {
  opacity: 1;
  transition: 300ms ease;
}
    </style>
</head> 
<body>
    <nav id="nami_side_nav" class="show">
        <div class="elements">
        $--BP--$
        </div>
      </nav>
      $--BP--$
</body>
</html>`;
}