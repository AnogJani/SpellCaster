let item_num = 5;
let main_settings = [false];
let hash = "";

let code;
loadCode();

let image;
let image_width;
let hotspots = [];
let selected_hotspot;
let selected_handle = [];
let current_mouse_pos = [];
let current_shape;
let current_link;
let current_alt;
let current_target;
let current_coords = [];
let is_real_image = false;

let side_bar_menu_buttons = document.getElementsByClassName("side_bar_menu_button");
let side_bar_content = document.getElementById("side_bar_content");
let side_bar_content_menus = document.getElementsByClassName("side_bar_content_menu");
let image_input_element = document.getElementById("main_image_input_link");
let image_element_container = document.getElementById("main_image_container");
let image_element = document.getElementById("main_image");
let main_image_width_tester = document.getElementById("main_image_width_tester");
let svg_element = document.getElementById("main_svg_container");
let hotspot_list = document.getElementById("hotspot_list");


function pushImageInfo (is_premade = false) {
    image = image_input_element.value;
    is_real_image = false;
    image_element.src = image;
    main_image_width_tester.src = image;
    if (!is_premade) {
        image_width = main_image_width_tester.width;
        document.getElementById("image_width_input").value = image_width;
    }
    pushMainSettings();
    document.getElementById("main_text_div").style = "display:none";
}

function pushMainSettings () {
    let checkbox_input_center = document.getElementById("checkbox_input_center");
    main_settings[0] = checkbox_input_center.checked;
    let width = document.getElementById("image_width_input").value;
    main_settings[1] = width;

    GiveUserOutput();
}


function pushHotspotInfo () {
    hotspots[selected_hotspot][1] = document.getElementById("hotspot_link_input").value;
    if (hotspots[selected_hotspot][1] == "") {hotspots[selected_hotspot][1] = "#"}
    hotspots[selected_hotspot][4] = document.getElementById("hotspot_alt_input").value;
    let tar = hotspots[selected_hotspot][2] = document.getElementById("hotspot_target_input").checked;
    if (tar == true) {hotspots[selected_hotspot][2] = "_blank"} else {hotspots[selected_hotspot][2] = "_self"}
}   


function GiveUserOutput () {
    let final_code_copy = document.getElementById("final_code_copy");
    let final_code_hotspots = "";
    let final_code_center_start = "";
    let final_code_center_end = "";

    hash = CreateHash();

    if(main_settings[0]) {
        final_code_center_start = `<center>`;
        final_code_center_end = `</center>`;
    } else {
        final_code_center_start = ``;
        final_code_center_end = ``;
    }
    //generating all links (code)
    for (let i = 0 ; i < hotspots.length ; i++) {
        let coords_element;
        let title_element;
        if (hotspots[i][0] == 'circle') { //calc radius
            coords_element = mapAllCoords(hotspots[i][3],image_width,main_settings[1]);    
            coords_element[0].push(Math.sqrt(Math.pow(coords_element[1][0]-coords_element[0][0],2)+Math.pow(coords_element[1][1]-coords_element[0][1],2)));
            coords_element.splice(1,1);
            coords_element = coords_element.join(",");
        } else {
            coords_element = mapAllCoords(hotspots[i][3],image_width,main_settings[1]).join(",");
        }
        if (hotspots[i].length == 5) {title_element = hotspots[i][4]} else {title_element = ""}
        let hotspot_element = `<area shape="${hotspots[i][0]}" href="${hotspots[i][1]}" title='${title_element}' target="${hotspots[i][2]}" coords="${coords_element}">\n`;
        final_code_hotspots += hotspot_element;
    }

    let ID = Create_Identification_Code (item_num,[hash,main_settings,hotspots,image]); //code id
    let final_code = AssembleCode(code, ID, [final_code_center_start, hash, final_code_hotspots, image, main_settings[1], hash, final_code_center_end]);
    final_code_copy.innerHTML = final_code; //copy
}

/*Helper function*/
function generate_hotspot_list_from_array() {
    hotspot_list.innerHTML = ""; //reset

    if (selected_hotspot == undefined || isNaN(selected_hotspot)) {
        //DO SOMETHING
        hotspot_list.innerHTML = "";
    } else {
        //overflowing
        if (selected_hotspot < 1) {focusHotspot(0);}
        if (selected_hotspot >= hotspots.length-1) {focusHotspot(hotspots.length-1);}
        //setting pages
        let start = (selected_hotspot);
        let end = (selected_hotspot+1);
        //more overflowing
        if (end > hotspots.length) {end = hotspots.length;}
        
        document.getElementById("page_text").innerHTML = `${start+1} / ${hotspots.length}`;

        for (let i = start ; i < end ; i++) {
            let hotspot_inputs = document.createElement("div");
            let hotspot_link = hotspots[i][1];
            if (hotspot_link == '#') {hotspot_link = '';}
            let hotspot_target = hotspots[i][2];
            if (hotspot_target == '_self') {hotspot_target = '';} else {hotspot_target = 'checked';}
            let hotspot_alt = hotspots[i][4];
            if (hotspot_alt == undefined) {hotspot_alt = '';}
            hotspot_inputs.innerHTML = 
            `
            <h6><div></div><span>לינק:</span><div></div></h6>
            <input type="link" id="hotspot_link_input" class="text_input" placeholder="הזן לינק" oninput="pushHotspotInfo();" value="${hotspot_link}">
            <h6><div></div><span>תיאור צף:</span><div></div></h6>
            <input type="text" id="hotspot_alt_input" class="text_input" placeholder="הזן תיאור צף" oninput="pushHotspotInfo();" value='${hotspot_alt}'>
            <h6><div></div><span>פתיחה בחלון חדש:</span><div></div></h6>
            <input type="checkbox" id="hotspot_target_input" class="checkbox_input input3" onchange="pushHotspotInfo();" ${hotspot_target}>
            <button id="delete_hotspot_button" title="מחק" onclick="deleteHotSpot(selected_hotspot);"><i class="fas fa-trash"></i></button>
            `;
            hotspot_list.appendChild(hotspot_inputs);
        }
    }
}

/*A function that handles the activation of the side bar top buttons*/
function handle_side_bar_menu_buttons (pressed_button) {
    for (let i = 0 ; i < side_bar_menu_buttons.length ; i++) {
        side_bar_menu_buttons[i].classList.remove("active");
    }
    pressed_button.classList.add("active");
    handle_menus();
}


/*A function that handles the displaying of the side bar menus*/
function handle_menus (pressed_button) {
    for (let i = 0 ; i < side_bar_content_menus.length ; i++) {
        side_bar_content_menus[i].classList.remove("shown");
    }
    if (side_bar_menu_buttons[0].classList.contains("active")) {
        side_bar_content_menus[0].classList.add("shown");
    }
    if (side_bar_menu_buttons[1].classList.contains("active")) {
        side_bar_content_menus[1].classList.add("shown");
    }
}

function createShape (shape) {
    resetCurrentHotSpot();
    current_shape = shape;
    focusHotspot(undefined);
    svg_element.addEventListener('mousedown', coordsPush);
}

function endShape () {
    if ((current_coords.length > 1  && current_shape !="polygon") || (current_coords.length > 2  && current_shape =="polygon")) {
        log(`create_${current_shape}_hotspot`,'click');
        svg_element.removeEventListener('mouseup', coordsPush);
        svg_element.removeEventListener('mousedown', coordsPush);
        hotspots.push([current_shape,current_link || '#',current_target || '_self',current_coords,current_alt || '']);
        resetCurrentHotSpot();
        drawAllHotspots();
        focusHotspot(hotspots.length-1);
        generate_hotspot_list_from_array(); //update page scrolling
    }
}

function coordsPush (){
    //shape ending
    if (current_shape != undefined) {
        current_coords.push(mapCoords(current_mouse_pos,image_element.width,image_width)); //resize to the original image size
        if (current_coords.length >= 2 && current_shape != "polygon") {
            endShape();
        }
    }

    //drag n drop
    if (current_coords.length >= 1 && current_shape != "polygon") {
        svg_element.removeEventListener('mousedown', coordsPush);
        setTimeout(function() {
            svg_element.addEventListener('mouseup', coordsPush);
        }, 200); //single click will become a drag n drop after this amount of mil-secs
    }
}

function resetCurrentHotSpot () {
    current_shape = current_link = current_alt = current_target = selected_hotspot = undefined;
    current_coords = selected_handle = [];
    svg_element.removeEventListener('mouseup', coordsPush);
    drawAllHotspots();
}

function deleteHotSpot (index) {
    if (current_shape == undefined) {
        hotspots.splice(index,1);
        drawAllHotspots();
        focusHotspot(selected_hotspot);
    }
}

function moveHotspot (index, dir) {
    let step = 5; //Arbitrary
    for (let i = 0 ; i < hotspots[index][3].length ; i++) {
        if (dir == "UP") {
            hotspots[index][3][i][1] = (parseInt(hotspots[index][3][i][1]) - step) + "";
        }
        if (dir == "DOWN") {
            hotspots[index][3][i][1] = (parseInt(hotspots[index][3][i][1]) + step) + "";
        }
        if (dir == "LEFT") {
            hotspots[index][3][i][0] = (parseInt(hotspots[index][3][i][0]) - step) + "";
        }
        if (dir == "RIGHT") {
            hotspots[index][3][i][0] = (parseInt(hotspots[index][3][i][0]) + step) + "";
        }
    }
    drawAllHotspots();
}

function focusHotspot (index) {
    if (index >= hotspots.length) {index = hotspots.length-1;}
    if (index < 0) {index = 0;}
    if (current_shape == undefined) {selected_hotspot = index;} //when not drawing
    let svg_shapes = document.querySelectorAll(".svg_shape");
    if (!isNaN(index) && svg_shapes != null && svg_shapes != undefined && svg_shapes.length != 0) {
        for (let i = 0 ; i < svg_shapes.length ; i++) {svg_shapes[i].classList.remove("selected");}
        if (current_shape == undefined && index != undefined) {svg_shapes[index].classList.add("selected");}
    }
}

function drawAllHotspots () {
    if (!is_real_image) {return;}
    svg_element.innerHTML = '';
    if (hotspots.length > 0) {
        for (let i = 0 ; i < hotspots.length ; i++) {
            drawHotspot(hotspots[i][0],mapAllCoords(hotspots[i][3],image_width,image_element.width),i);
        }
    }
    svg_element.innerHTML = svg_element.innerHTML; //refreshing the SVG
    generate_hotspot_list_from_array();
}

function drawHotspot (shape,coords,index=-1) {
    let svg_shape = document.createElement(shape);
    svg_shape.setAttribute('onclick',`focusHotspot(${index});generate_hotspot_list_from_array();`);
    svg_shape.setAttribute('shape_index',index);
    svg_shape.setAttribute('class',"svg_shape");
    if(shape == "rect") {
        let top_right = [Math.min(coords[0][0],coords[1][0]),Math.min(coords[0][1],coords[1][1])];
        let bottom_left = [Math.max(coords[0][0],coords[1][0]),Math.max(coords[0][1],coords[1][1])];
        svg_shape.setAttribute('x',top_right[0]);
        svg_shape.setAttribute('y',top_right[1]);
        svg_shape.setAttribute('width',bottom_left[0]-top_right[0]);
        svg_shape.setAttribute('height',bottom_left[1]-top_right[1]);
        svg_shape.setAttribute('rx',2); //for aesthetic purposes only 
    }
    if(shape == "circle") {
        svg_shape.setAttribute('cx',coords[0][0]);
        svg_shape.setAttribute('cy',coords[0][1]);
        svg_shape.setAttribute('r',Math.sqrt(Math.pow(coords[1][0]-coords[0][0],2)+Math.pow(coords[1][1]-coords[0][1],2)));
    }
    if(shape == "polygon") {
        let points = [];
        for (let i = 0 ; i < coords.length ; i++) {
            points.push(coords[i][0] + ',' + coords[i][1]);
        }
        svg_shape.setAttribute('points',points.join(','));
    }
    svg_element.appendChild(svg_shape);
    drawHotspotHandles(shape,coords,index);
}

function drawHotspotHandles (shape,coords,shape_index=-1) {
    for (let i = 0 ; i < coords.length ; i++) {
        if (current_shape == undefined || i < coords.length-1 || shape_index != -1) {
            let svg_handle = document.createElement("circle");
            svg_handle.setAttribute('onmousedown',`dragHandleStart(${shape_index},${i},"${shape}");`);
            svg_handle.setAttribute('onmouseup',`dropHandle()`);
            svg_handle.setAttribute('parent_shape',shape);
            svg_handle.setAttribute('shape_index',shape_index);
            svg_handle.setAttribute('handle_index',i);
            svg_handle.setAttribute('class',"svg_handle");
            svg_handle.setAttribute('cx',coords[i][0]);
            svg_handle.setAttribute('cy',coords[i][1]);
            svg_handle.setAttribute('r',image_element.width*0.0055);
            svg_element.appendChild(svg_handle);
        }
    }
}

function mapCoords (coords,old_width,new_width) {
    let ratio = new_width / old_width;
    return [coords[0]*ratio,coords[1]*ratio];
}

function mapAllCoords (all_coords,old_width,new_width) {
    let mapped_coords = [];
    for (let i = 0 ; i < all_coords.length ; i++) {
        mapped_coords.push(mapCoords(all_coords[i],old_width,new_width));
    }
    return mapped_coords;
}

function dragHandleStart (shape_index, handle_index,parent_shape) {
    selected_handle = [shape_index,handle_index,parent_shape];
}

function dragHandle () {
    if (selected_handle[0] >= 0 && selected_handle[1] >= 0) {
        hotspots[selected_handle[0]][3][selected_handle[1]] = mapCoords(current_mouse_pos,image_element.width,image_width);
        drawAllHotspots();
        focusHotspot(selected_handle[0]);
    }
}

function dropHandle () {
    if (selected_handle[0] == -1 && selected_handle[1] == 0 && selected_handle[2] == "polygon") {
        current_coords.pop();
        endShape();
    }
    selected_handle = [];
}

/*EVENT LISTENERS*/

window.addEventListener('resize', (event) => {
    drawAllHotspots();
    svg_element.setAttribute("width",image_element.width);
    svg_element.setAttribute("height",image_element.height);
});

svg_element.addEventListener('mousemove', (event) => {
    /*calculation mouse position*/
    let rect = svg_element.getBoundingClientRect();
    current_mouse_pos = [Math.ceil(event.clientX - rect.left),Math.ceil(event.clientY - rect.top)];
    /*handle dragging*/
    if (selected_handle.length != 0) {
        dragHandle();
    }
    /*shape drawing visualization while creating a new shape*/
    if (current_shape != undefined && current_coords.length > 0) {
        drawAllHotspots();
        let temp_current_coords = current_coords.concat([current_mouse_pos]);
        for (let i = 0 ; i < temp_current_coords.length-1 ; i++) {
            temp_current_coords[i] = mapCoords(temp_current_coords[i],image_width,image_element.width);
        }
        drawHotspot(current_shape,temp_current_coords,-1,false);
        svg_element.innerHTML = svg_element.innerHTML; //refreshing the SVG
    }
});

document.addEventListener('keydown', (event) => {
    let key = event.code;
    let is_in_input = ["INPUT","TEXTAREA","SELECT","OPTION"].includes(event.target.tagName);
    if (key == "Enter") {
        endShape();
    }
    if (key == "Escape") {
        resetCurrentHotSpot();
        selected_handle = [];
    }
    if (key == "Delete" || (key == "Backspace" && !is_in_input)) {
        deleteHotSpot(selected_hotspot);
    }
    if (key == "KeyR" && !is_in_input) {
        createShape('rect');
    }
    if (key == "KeyC" && !is_in_input) {
        createShape('circle');
    }
    if (key == "KeyP" && !is_in_input) {
        createShape('polygon');
    }
    if ((key == "ArrowUp" || key == "KeyW") && !is_in_input) {
        moveHotspot(selected_hotspot,"UP");
    }
    if ((key == "ArrowDown" || key == "KeyS") && !is_in_input) {
        moveHotspot(selected_hotspot,"DOWN");
    }
    if ((key == "ArrowLeft" || key == "KeyA") && !is_in_input) {
        moveHotspot(selected_hotspot,"LEFT");
    }
    if ((key == "ArrowRight" || key == "KeyD") && !is_in_input) {
        moveHotspot(selected_hotspot,"RIGHT");
    }
}, false);


/*stuff from other files*/
function active_sidebar_tab () {
    const radio_tabs = document.getElementsByClassName("sidebar_tabs_radio");
    const lable_tabs = document.getElementsByClassName("sidebar_tabs_lable");
    const content_tabs = document.getElementsByClassName("sidebar_content");
    for (let i = 0 ; i < radio_tabs.length ; i++) {
        if (radio_tabs[i].checked) {
            lable_tabs[i].classList.add("active_sidebar_tab");
            content_tabs[i].classList.add("shown");
        } else {
            lable_tabs[i].classList.remove("active_sidebar_tab");
            content_tabs[i].classList.remove("shown");
        }
    }
}

/*Functions That Run On Load*/
generate_hotspot_list_from_array(); //Lehatkhil be regel yamin ;)

/*
// A function that gets a premade code and sets all the settings in the page to fit that original code
// This function is called from the "PremadeCodeHandler" script that is in the file "page_base_script.js"
*/
function loadPremadeCode(premade_code) {
    let dissambled_code = Identification_Code_Decoder(premade_code);

    //hash
    if (hash == "") {hash = CreateHash();} else {hash = dissambled_code[1];}

    hotspots = dissambled_code[3];
    if (hotspots === '') {hotspots = [];}
    if (hotspots.length != 0) {focusHotspot(0);}

    //main settings
    if(dissambled_code[2][0] == "true"){document.getElementById("checkbox_input_center").checked = true;}
    else {document.getElementById("checkbox_input_center").checked = false;}
    document.getElementById("image_width_input").value = dissambled_code[2][1];
    document.getElementById("main_image_input_link").value = dissambled_code[4];
    
    pushImageInfo(true); //already gives user output in the function itself
}

/*
// Loading The Code (This Function Just Puts The Output Code Last For Organization)
*/
function loadCode () {
    code = `
    $--BP--$
    <map name="$--BP--$">
    $--BP--$
    </map>
    <img src="$--BP--$" border="0" style="width:$--BP--$px" usemap="#$--BP--$"/>
    $--BP--$
`;
}