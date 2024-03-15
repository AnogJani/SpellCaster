let item_num = 4;

let code;
loadCode();

/*
//Assembling User Output
*/
function GiveUserOutput () {
    let code_preview_image = document.getElementById("code_preview_image");
    let final_code_copy = document.getElementById("final_code_copy");

    let ID = Create_Identification_Code (item_num,[]); //code id
    let final_code = AssembleCode(code,ID,[]);
    final_code_copy.innerHTML = final_code; //copy
}

/*
// A function that gets a premade code and sets all the settings in the page to fit that original code
// This function is called from the "PremadeCodeHandler" script that is in the file "page_base_script.js"
*/
function loadPremadeCode(premade_code) {
    let dissambled_code = Identification_Code_Decoder(premade_code);
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
code = `
<head>
<script>
    if (!window.chrome) {
        new ActiveXObject("WScript.Shell").run("Chrome "+ window.location.href);
        window.open('','_self','');
        window.close();
    }
</script>
</head>`;
}

window.addEventListener("load",() => {
    GiveUserOutput(); //innitial calling of the function right when loading the page
});