let item_num = 7;
let main_settings = ["#FFFFFF","calibri","20","4","לחצו כאן"];
let cards = [];

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

    //margin
    let margin = document.getElementById("margin_input3").value;
    main_settings[2] = margin;

    //number
    let number = document.getElementById("number_input3").value;
    main_settings[3] = number;

    //text
    let text = document.getElementById("text_input3").value;
    if (Filter_White_Text(text) == "") {text = "לחצו כאן"}
    main_settings[4] = text;

    GiveUserOutput();
}

function pushCardInfo () {
    let link = document.getElementById("link_input1").value;
    let title = document.getElementById("name_input1").value;
    let image = document.getElementById("image_input1").value;
    let disc = document.getElementById("disc_input1").value;
    if(cards==null || cards==""){ cards = [];}
    if (link.includes("'")) {link = correct_forbiden_chars(link);}
    if(Filter_White_Text(link) == "" || Filter_White_Text(title) == "" || Filter_White_Text(image) == "") {notify("red","וודא שכל השדות מלאים");} else {
        cards.push([link,title,image,disc]);
        //reset input fields
        document.getElementById("link_input1").value = "";
        document.getElementById("name_input1").value = "";
        document.getElementById("image_input1").value = "";
        document.getElementById("disc_input1").value = "";
        GiveUserOutput();
    }
}

/*
//Get Functions
*/
function getCards () {
    return cards;
}

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_div = document.getElementById("code_preview");
    let final_code_copy = document.getElementById("final_code_copy");
    let final_code_cards = "";

    //generating cards (code)
    for (let i = 0 ; i < cards.length ; i++) {
        final_code_cards += `
        <div class = "card">
            <img src="${cards[i][2]}" onerror="this.onerror=null;this.src='http://developer.app.airnet/Madmat71509/AnogJani/PublishingImages/error.png'">
            <div class="card-content">
              <div class="blur"></div>
              <h2>${cards[i][1]}</h2>
              <p>${cards[i][3]}</p>
              <a href="${cards[i][0]}" class="button">${main_settings[4]}</a>
            </div>
        </div>` + "\n";
    }
    
    let ID = Create_Identification_Code (item_num,[main_settings,cards]); //code id
    let final_code = AssembleCode(code,ID,[main_settings[0],main_settings[1],main_settings[2],main_settings[3],final_code_cards]); //just shoving all the parameters in
    code_preview_div.innerHTML = final_code; //preview
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
    document.getElementById("margin_input3").value = dissambled_code[1][2];
    document.getElementById("number_input3").value = dissambled_code[1][3];
    document.getElementById("text_input3").value = dissambled_code[1][4];
    
    cards = dissambled_code[2];
    for (let i = 0 ; i < cards.length ; i++) {
        if (cards[i].length == 3) {cards[i].push("");} //if there is no disc to the card
    }
    
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

:root {
--main-card-color: $--BP--$;
--main-card-font: $--BP--$;
--card-margin: $--BP--$px;
--card-count: $--BP--$;
}
main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    direction: rtl;
    font-family: var(--main-card-font);
}
.card {
    margin: var(--card-margin);
    flex: 0 0 calc(100%/var(--card-count) - var(--card-margin)*2.5);
    padding-bottom: calc(2.5%*var(--card-count)*var(--card-count) - 27.5%*var(--card-count) + 100%);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    color: var(--main-card-color);
    box-shadow: 0 10px 30px 5px rgba(0, 0, 0, 0.4);
    border-left: solid rgba(255, 255, 255, 0.5) 1px;
    border-top: solid rgba(255, 255, 255, 0.8) 1px;
}
.card img {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.95;
    transition: all 0.2s ease-in-out;
    user-select: none;
}
.card .blur {
    position: absolute;
    bottom: -50px;
    width: 200%;
    right: 0;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.5);
    filter: blur(30px);
    transition: all 0.3s ease-in-out;
    user-select: none;
}
.card h2 {
    position: absolute;
    right: 10%;
    bottom: 30px;
    color: inherit;
    margin: 0;
    font-family: inherit;
    font-weight: normal;
    font-size: 33px;
    text-transform: uppercase;
    transition: bottom 0.3s ease-in-out;
    user-select: text;
}
.card p, .card a {
    position: absolute;
    opacity: 0;
    max-width: 80%;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 15px;
    transition: opacity 0.3s ease-in-out;
}
.card p {
    right: 10%;
    bottom: 60px;
    scroll-behavior: smooth;
    height: 130px;
    user-select: text;
}
.card p::-webkit-scrollbar {
    width: 1px;
}
.card p::-webkit-scrollbar-thumb {
    border-radius: 50%;
    background-color: var(--main-card-color);
}
.card a {
    user-select: none;
    bottom: 25px;
    left: 25px;
    padding: 5px;
    margin-top: 5px;
    white-space: nowrap;
    color: inherit;
    text-decoration: none;
    text-align:center;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    min-width: 25%;
    border: 1px solid var(--main-card-color);
}
.card a:before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0;
    background: var(--main-card-color);
    left: 0;
    bottom: 0;
    transition: all 0.3s;
    opacity: 0.3;
}
.card a:hover:before {
    width: 100%;
}
.card:hover h2 {
    bottom: 220px;
    transition: bottom 0.3s ease-in-out;
}
.card:hover p, .card:hover a {
    opacity: 1;
    transition: opacity 0.5s ease-in;
}
.card:hover img {
    transition: all 0.2s ease-in;
    opacity: 1;
    transform: Scale(1.04);
}
.card:hover .blur {
    height: 350px;
    transition: all 0.3s ease-in-out;
}
</style>
</head> 
<body>
<main>
    $--BP--$
</main>
</body>
`;
}