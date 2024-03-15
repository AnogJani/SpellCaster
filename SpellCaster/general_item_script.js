/*
// A function that copies the text from any text-area (with the "id" argument) into the clipboard
*/
function copy_code(id) {
    let copy_text = document.getElementById(id);
    copy_text.focus();
    copy_text.select();
    notify("copy","הקוד הועתק");

    return new Promise((res, rej) => {
        document.execCommand('copy') ? res() : rej();
    });
}


/*
// A function that lets you edit items of an array with a cool GUI
// arr: the array that you want to edit it's content
// k: because the objects we want to edit (links for example are built from: link & text), we need to choose which element inside of that will be displayed
//    ([link,text] ==> when k=1 the text will be shown to the user as an indication of what element he is selecting)
// m: the mode of the "edit nodes" feature here are it's possible values:
// * mode = 0 ==> regular
// * mode = 1 ==> openable objects (nested objects) like top-nav
// * mode = 1.5 ==> end of openable object (the final nest) like inside a top-nav item
*/
let active_node;
let main_arr;
let index_to_show;
let mode = 0;
function edit_nodes(arr, k, m) {
    active_node = -1;
    main_arr = arr;
    index_to_show = k;
    mode = m;
    open_general_dialog("_edit_nodes");
    create_window_edit_nodes();
    update_nodes();
    update_dialog_buttons();
}


/*
// A function that sets a specific node as "active" which means that we want to do all opperations on it
*/
function set_active(index) {
    active_node = index;
    let all_nodes = document.querySelectorAll(".node");
    for (let i = 0 ; i < all_nodes.length ; i++) {all_nodes[i].classList.remove("active_node");}
    if (index >= 0 && index <= all_nodes.length-1){
        all_nodes[active_node].classList.add("active_node"); // do only if in the right range
    }
    update_dialog_buttons();
}

/*
// A function that updates the nodes (you f*cking tipesh, what is wrong with you, go to the store and buy some IQ)
*/
function update_nodes() {
    let array_nodes = document.querySelector("#edit_nodes_dialog_main");
    
        array_nodes.innerHTML = ""; //reseting everything

        for (let i = 0 ; i < main_arr.length ; i++) { //creating all the nodes with the right properties
            let new_node = document.createElement("div");
            new_node.setAttribute("id", "node" + i);
            new_node.setAttribute("class", "node");
            new_node.setAttribute("onclick", `set_active(${i});`);
            new_node.innerHTML = `
                <div>
                    <p class="order_number">${i+1}.</p>
                    <p class="text">${main_arr[i][index_to_show]}</p>
                </div>
                <button class="text_button" onclick="set_active(${i});edit_node_content();"><i class="fas fa-pen-to-square"></i></button>`;
            if (mode == 1) {
                new_node.innerHTML = `
                <div>
                    <p class="order_number">${i+1}.</p>
                    <p class="text">${main_arr[i][0][index_to_show]}</p>
                </div>`;
            }
            if (mode == 1.5 && i == 0) {new_node.setAttribute("class", "node first_node");}
            if (mode == 1) {new_node.setAttribute("ondblclick", "dialog_button_open();");} //openable node
            if (mode != 1) {new_node.setAttribute("ondblclick", "edit_node_content();");} //edit node content
            array_nodes.appendChild(new_node);
        }

        set_active(active_node);
}

/*
// A function that controls the usability of the dialog buttons
// (disabling buttons when they can't be used)
*/
function update_dialog_buttons() {
    let all_buttons = document.querySelectorAll(".dialog_button");

    //disable / enable all buttons based on if any of the nodes are selected
    if (active_node < 0) {
        for (let i = 0 ; i < all_buttons.length ; i++) {
            all_buttons[i].setAttribute("disabled","");
        }
    } else {
        for (let i = 0 ; i < all_buttons.length ; i++) {
            all_buttons[i].removeAttribute("disabled");
        }
    }

    //if at the very top can't move more up
    if (active_node == 0) {
        document.querySelector("#dialog_button_up").setAttribute("disabled","");
    }

    //if at bottom can't move more down
    if (active_node == main_arr.length-1) {
        document.querySelector("#dialog_button_down").setAttribute("disabled","");
    }

    //new should always be open
    if (mode == 1.5) {
        document.querySelector("#dialog_button_new").removeAttribute("disabled");
    }

    //can't delete node from within itself
    if (mode == 1.5 && main_arr.length <= 1) {
        document.querySelector("#dialog_button_delete").setAttribute("disabled","");
    }
}

/*
// A function that sets up all the windows and buttons and so on of the edit nodes feature
*/
function create_window_edit_nodes() {
    let window = document.querySelector("#general_dialog_carpet_edit_nodes");
    window.innerHTML = 
    `
    <div id="edit_nodes_dialog_window" class="general_dialog_window">
    <div id="edit_nodes_dialog_nav">
        <div id="top_navi_dialog_buttons">
            <button type="button" class="dialog_exit_button" onclick="exit_general_dialog('_edit_nodes');GiveUserOutput();"><i class="fas fa-times"></i></button>
        </div>
        <div id="dialog_main_buttons">
            <button type="button" class="nami_button dialog_button up" id="dialog_button_up" onclick="dialog_button_up()">
                הזז למעלה<i class="fa-solid fa-arrow-up"></i>
            </button>
            <button type="button" class="nami_button dialog_button down" id="dialog_button_down" onclick="dialog_button_down()">
                הזז למטה<i class="fa-solid fa-arrow-down"></i>
            </button>
            <button type="button" class="nami_button dialog_button delete" id="dialog_button_delete" onclick="dialog_button_delete()">
                מחק<i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    </div>
    <div id="edit_nodes_dialog_main"></div>
    </div>
    `;

    //more modes//
    if (mode == 1) {
        let open_button = document.createElement("button");
        open_button.innerHTML = `פתח<i class="fa-solid fa-list"></i>`;
        open_button.setAttribute("class","nami_button dialog_button open");
        open_button.setAttribute("id","dialog_button_open");
        open_button.setAttribute("onclick","dialog_button_open()");
        document.getElementById("dialog_main_buttons").appendChild(open_button);
    }
    if (mode == 1.5) {
        let back_button = document.createElement("div");
        back_button.innerHTML = `<button type="button" class="dialog_back_button" onclick="back_edit_nodes();"><i class="fas fa-arrow-left-long"></i></button>`;
        document.getElementById("top_navi_dialog_buttons").appendChild(back_button);

        let new_button = document.createElement("button");
        new_button.innerHTML = `חדש<i class="fa-solid fa-plus"></i>`;
        new_button.setAttribute("class","nami_button dialog_button new");
        new_button.setAttribute("id","dialog_button_new");
        new_button.setAttribute("onclick","dialog_button_new()");
        document.getElementById("dialog_main_buttons").appendChild(new_button);
    }
}

/*
// A function that goes back one dialog in the edit nodes feature
*/
function back_edit_nodes() {
    exit_general_dialog('_edit_nodes');
    edit_nodes(getLinks(),1,1);
}

/*
// A function that let's you open a dialog in which you can edit the values inside the selected node
*/
function edit_node_content() {
    open_general_dialog("_edit_node_content",2);
    let window = document.querySelector("#general_dialog_carpet_edit_node_content");
    window.innerHTML = 
    `
    <div id="edit_nodes_dialog_window" class="general_dialog_window" style="width:550px;height:auto">
    <div id="edit_nodes_dialog_nav">
        <div id="top_navi_dialog_buttons">
            <button type="button" class="dialog_exit_button" onclick="exit_general_dialog('_edit_node_content',true);"><i class="fas fa-times"></i></button>
        </div>
    </div>
    <div id="dialog_main"><div id="edit_node_content_fields"></div></div>
    </div>
    `;
    let dialog_main = document.querySelector("#general_dialog_carpet_edit_node_content #dialog_main");
    let edit_node_content_fields = document.querySelector("#general_dialog_carpet_edit_node_content #dialog_main #edit_node_content_fields");
    for (let i = 0 ; i < main_arr[active_node].length ; i++) {
        edit_node_content_fields.innerHTML += `<input class='text_input' type='text' value='${main_arr[active_node][i]}'>`;
    }
    dialog_main.innerHTML += `
    <div class="flex">
        <button class="nami_button push_button" type="button" onclick="submit_edit_node_content();log('edited_node_content','click')">
            <i class="fas fa-save"></i> שמירה
        </button>
    </div>`
}

/*
// A function that saves the values entered in the dialog opened in the "edit_node_content" function and saves it to the main array
*/
function submit_edit_node_content() {
    let dialog_main = document.querySelector("#general_dialog_carpet_edit_node_content #dialog_main #edit_node_content_fields");
    let new_arr = [];
    for (let i = 0 ; i < dialog_main.children.length ; i++) {
        let val = dialog_main.children[i].value;
        new_arr.push(val);
    }
    main_arr[active_node] = new_arr;
    exit_general_dialog('_edit_node_content',true);
    update_nodes();
}

/***************************************/
/*****DIALOG***BUTTONS***FUNCTIONALITY**/
/***************************************/

/*
// A function that handles the dialog button of type "up"
*/
function dialog_button_up () {
    let temp = main_arr[active_node];
    main_arr[active_node] = main_arr[active_node-1];
    main_arr[active_node-1] = temp;

    active_node--;
    
    update_nodes();
}

/*
// A function that handles the dialog button of type "down"
*/
function dialog_button_down () {
    let temp = main_arr[active_node];
    main_arr[active_node] = main_arr[active_node+1];
    main_arr[active_node+1] = temp;

    active_node++;
    
    update_nodes();
}

/*
// A function that handles the dialog button of type "delete"
*/
function dialog_button_delete () {
    main_arr.splice(active_node,1);

    active_node = -1;
    
    update_nodes();
}

/*
// A function that handles the dialog button of type "open"
*/
function dialog_button_open () {
    exit_general_dialog('_edit_nodes');
    edit_nodes(main_arr[active_node],1,1.5);
}

/*
// A function that handles the dialog button of type "new"
*/
function dialog_button_new () {
    open_general_dialog("_new_item",2);
    let window = document.querySelector("#general_dialog_carpet_new_item");
    window.innerHTML = 
    `
    <div id="edit_nodes_dialog_window" class="general_dialog_window" style="width:550px;height:30%;">
    <div id="edit_nodes_dialog_nav">
        <div id="top_navi_dialog_buttons">
            <button type="button" class="dialog_exit_button" onclick="exit_general_dialog('_new_item',true);"><i class="fas fa-times"></i></button>
        </div>
    </div>
    <div id="dialog_main" style="padding:10px;">
        <div class="input_div">
            <lable class="input_lable">כיתוב</lable>
            <input type="text" class="text_input input2" id="name_input2_dialog" placeholder="הכנס כיתוב">
        </div>
        <div class="input_div">
            <lable class="input_lable">קישור</lable>
            <input type="url" class="text_input input2" id="link_input2_dialog" placeholder="הכנס קישור אליו יוביל הכפתור">
        </div>
        <div class="flex">
            <button class="nami_button push_button" type="button" onclick="if(pushSubLinkInfo()){main_arr.push(pushSubLinkInfo());exit_general_dialog('_new_item',true);update_nodes();};"><i class="fas fa-plus"></i> הוסף תת ניווט </button>
        </div>
    </div>
    </div>
    `;
}

/********************************/
/*Leaving*The*Edit*Nodes*Feature*/
/********************************/

/*
// A function that loads all the fonts into the selecting option
// the "fonts" array is composed of fonts like this ["font","display-name-for-users"]
// i.e: ["'Segoe UI',Tahoma,Arial,sans-serif", "Ariel"]
*/

function load_fonts () {
    let fonts = [
        ["calibri","Calibri"],
        ["aduma,adumafot","Aduma"],
        ["adumafot","Aduma FOT"],
        ["gisha","Gisha"],
        ["segoe ui ","Segoe"],
        
        /*⬆ You Can Add Some More Fonts Here ⬆*/
    ];

    let font_select_inputs = document.querySelectorAll(".font_select_input");
    for (let i = 0 ; i < font_select_inputs.length ; i++) {
        for (let j = 0 ; j < fonts.length ; j++) {
            let option = document.createElement("option");
            option.setAttribute("value",fonts[j][0]);
            option.innerHTML = fonts[j][1];
            font_select_inputs[i].appendChild(option);
        }
    }
}

//calling the functions in this script:
load_fonts();