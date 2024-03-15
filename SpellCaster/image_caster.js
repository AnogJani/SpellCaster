
//initial settings
let background_color;
let shape;
let outline_color;
let outline_width;
let image_size;
let logo_color;
let image_link = "";
let is_background_transpatent = false;
let is_icon = false;
let is_first_time = true;

const img = new Image();

let side_bar_menu_buttons = document.getElementsByClassName("side_bar_menu_button");
let side_bar_content = document.getElementById("side_bar_content");
let side_bar_content_menus = document.getElementsByClassName("side_bar_content_menu");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let size = canvas.height;
let save_button = document.getElementById("save_button");
let outline_width_input_slider = document.getElementById("outline_width_input");
let image_size_input_slider = document.getElementById("image_size_input");
let search_icon_input = document.getElementById("search_icon_input");
let icon_library = document.getElementById("icon_library");

let icon_links = [];
let icon_library_page_number = 0;
const icon_library_page_size = 100;


/*
// A function that handles the activation of the side bar top buttons
*/
function handle_side_bar_menu_buttons (pressed_button) {
    for (let i = 0 ; i < side_bar_menu_buttons.length ; i++) {
        side_bar_menu_buttons[i].classList.remove("active");
    }
    pressed_button.classList.add("active");
    handle_menus();
}


/*
// A function that handles the displaying of the side bar menus
*/
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

/*
// A function that is called whenever one of the parameters are changed
*/
function update () {
    // getting the values
    background_color = document.getElementById("background_color_input").value;
    is_background_transpatent = document.getElementById("background_transparent_input").checked;
    if (document.getElementById("background_shape_rect").checked) {shape="rect"} else {shape="circle"} //!!!ONLY FOR 2 SHAPES
    outline_color = document.getElementById("outline_color_input").value;
    outline_width = document.getElementById("outline_width_input").getAttribute("data-before");
    image_size = document.getElementById("image_size_input").getAttribute("data-before");
    logo_color = document.getElementById("icon_color_input").value;
    img.src = image_link;

    //appling the styles
    if (!image_link) {generate_canvas();} else {
        img.onload = function () {
            generate_canvas();
        }
    }

    //disable background-color selection if background is transparent
    document.getElementById("background_color_input").disabled = is_background_transpatent;

    //saving
    const href = canvas.toDataURL();
    save_button.href = href;
}

/*
// A function that's responsible for updating and generating the canvas based on the parameters
*/
function generate_canvas () {
        //--Image Calibration
        //image sizing
        let image_width = img.width;
        let image_height = img.height;
        let image_ratio;
        if (image_height > image_width) {
            image_ratio = image_height/image_size;
            image_height = image_size;
            image_width /= image_ratio;
        } else {
            image_ratio = image_width/image_size;
            image_width = image_size;
            image_height /= image_ratio;
        }

        //saving logo data for use later
        ctx.clearRect(0,0,size,size);
        ctx.drawImage(img,(size-image_width)/2,(size-image_height)/2,image_width,image_height);
        const logo_data = ctx.getImageData(0,0,size,size); 
        const logo_pixels = logo_data.data;

        //--Displaying On The Canvas
        ctx.clearRect(0,0,size,size);

        //background & outline
        if (shape == "rect") {
            ctx.fillStyle = outline_color; //outline
            ctx.fillRect(1,1,size-2,size-2);
            if (is_background_transpatent) { //background
                ctx.clearRect(outline_width,outline_width,size-outline_width*2,size-outline_width*2);
            } else {
                ctx.fillStyle = background_color;
                ctx.fillRect(outline_width,outline_width,size-outline_width*2,size-outline_width*2);
            }
        }
        if (shape == "circle") {
            ctx.beginPath(); //outline
            ctx.fillStyle = outline_color;
            ctx.arc(size/2,size/2,size/2-1,0,Math.PI*2);
            ctx.fill();
            if (is_background_transpatent) { //background
                ctx.beginPath();
                ctx.save();
                ctx.arc(size/2,size/2,size/2-outline_width,0,Math.PI*2);
                ctx.clip();
                ctx.clearRect(outline_width,outline_width,size-outline_width*2,size-outline_width*2);
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.fillStyle = background_color;
                ctx.arc(size/2,size/2,size/2-outline_width,0,Math.PI*2);
                ctx.fill();
            }
        }

        //getting the background data to add the logo onto
        const bg_data = ctx.getImageData(0,0,size,size);
        const bg_pixels = bg_data.data;

        //HEX to RGB convertion of the logo color
        let logo_color_red = HEXtoRGB(logo_color)[0];
        let logo_color_green = HEXtoRGB(logo_color)[1];
        let logo_color_blue = HEXtoRGB(logo_color)[2];

        //going over all the pixels - coloring the logo
        if (image_link != "") {
            for (let i = 0 ; i < logo_pixels.length ; i += 4) {
                if (logo_pixels[i+3] != 0) {
                    if (is_icon) {
                        bg_pixels[i  ] = logo_color_red;
                        bg_pixels[i+1] = logo_color_green;
                        bg_pixels[i+2] = logo_color_blue;
                        bg_pixels[i+3] = 255;
                    } else {
                        bg_pixels[i  ] = logo_pixels[i  ];
                        bg_pixels[i+1] = logo_pixels[i+1];
                        bg_pixels[i+2] = logo_pixels[i+2];
                        bg_pixels[i+3] = 255;
                    }
                }
            }
        }

        //draw full image on canvas
        ctx.putImageData(bg_data,0,0);
}


/*
// A function that updates the tooltip of the slider input
*/
function update_sliders () {
    outline_width_input_slider.setAttribute('data-before',outline_width_input_slider.value);
    image_size_input_slider.setAttribute('data-before',image_size_input_slider.value);
    /////// un-comment this if the slider's indicator is reversed:
    //outline_width_input_slider.setAttribute('data-before',(parseInt(outline_width_input_slider.max)+parseInt(outline_width_input_slider.min))-outline_width_input_slider.value);
    //image_size_input_slider.setAttribute('data-before',(parseInt(image_size_input_slider.max)+parseInt(image_size_input_slider.min))-image_size_input_slider.value);
}


/*
// A function that loads all the icons from the "icon_lib" library using the SharePoint REST API
*/
async function load_icon_links_from_API () {
    let api = `${site_url}/_api`;
    let listName = "icon_lib";

    //getting the list's item-count
    let itemCount_response = await fetch(api + `/lists/getbytitle('${listName}')/ItemCount`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let itemCount_json = await itemCount_response.json();
    let itemCount = itemCount_json.d.ItemCount;

    //getting the icons
    let response = await fetch(api + `/lists/getbytitle('${listName}')/items?$select=FileLeafRef&$top=${itemCount}`,{
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"}
    });
    let json = await response.json();

    //using the icons we fetched
    for (let i = 0 ; i < itemCount ; i++) {
        icon_links.push(json.d.results[i].FileLeafRef);
    }
    generate_icon_buttons_from_links_array();
}

function load_icon_links_from_directory () {
    icon_links = ['../icon_lib/address-book.svg',
    '../icon_lib/address-card.svg',
    '../icon_lib/bell.svg',
    '../icon_lib/bell-slash.svg',
    '../icon_lib/bookmark.svg',
    '../icon_lib/building.svg',
    '../icon_lib/calendar.svg',
    '../icon_lib/calendar-check.svg',
    '../icon_lib/calendar-days.svg',
    '../icon_lib/calendar-minus.svg',
    '../icon_lib/calendar-plus.svg',
    '../icon_lib/calendar-xmark.svg',
    '../icon_lib/chart-bar.svg',
    '../icon_lib/chess-bishop.svg',
    '../icon_lib/chess-king.svg',
    '../icon_lib/chess-knight.svg',
    '../icon_lib/chess-pawn.svg',
    '../icon_lib/chess-queen.svg',
    '../icon_lib/chess-rook.svg',
    '../icon_lib/circle.svg',
    '../icon_lib/circle-check.svg',
    '../icon_lib/circle-dot.svg',
    '../icon_lib/circle-down.svg',
    '../icon_lib/circle-left.svg',
    '../icon_lib/circle-pause.svg',
    '../icon_lib/circle-play.svg',
    '../icon_lib/circle-question.svg',
    '../icon_lib/circle-right.svg',
    '../icon_lib/circle-stop.svg',
    '../icon_lib/circle-up.svg',
    '../icon_lib/circle-user.svg',
    '../icon_lib/circle-xmark.svg',
    '../icon_lib/clipboard.svg',
    '../icon_lib/clock.svg',
    '../icon_lib/clone.svg',
    '../icon_lib/closed-captioning.svg',
    '../icon_lib/comment.svg',
    '../icon_lib/comment-dots.svg',
    '../icon_lib/comments.svg',
    '../icon_lib/compass.svg',
    '../icon_lib/copy.svg',
    '../icon_lib/copyright.svg',
    '../icon_lib/credit-card.svg',
    '../icon_lib/envelope.svg',
    '../icon_lib/envelope-open.svg',
    '../icon_lib/eye.svg',
    '../icon_lib/eye-slash.svg',
    '../icon_lib/face-angry.svg',
    '../icon_lib/face-dizzy.svg',
    '../icon_lib/face-flushed.svg',
    '../icon_lib/face-frown.svg',
    '../icon_lib/face-frown-open.svg',
    '../icon_lib/face-grimace.svg',
    '../icon_lib/face-grin.svg',
    '../icon_lib/face-grin-beam.svg',
    '../icon_lib/face-grin-beam-sweat.svg',
    '../icon_lib/face-grin-hearts.svg',
    '../icon_lib/face-grin-squint.svg',
    '../icon_lib/face-grin-squint-tears.svg',
    '../icon_lib/face-grin-stars.svg',
    '../icon_lib/face-grin-tears.svg',
    '../icon_lib/face-grin-tongue.svg',
    '../icon_lib/face-grin-tongue-squint.svg',
    '../icon_lib/face-grin-tongue-wink.svg',
    '../icon_lib/face-grin-wide.svg',
    '../icon_lib/face-grin-wink.svg',
    '../icon_lib/face-kiss.svg',
    '../icon_lib/face-kiss-beam.svg',
    '../icon_lib/face-kiss-wink-heart.svg',
    '../icon_lib/face-laugh.svg',
    '../icon_lib/face-laugh-beam.svg',
    '../icon_lib/face-laugh-squint.svg',
    '../icon_lib/face-laugh-wink.svg',
    '../icon_lib/face-meh.svg',
    '../icon_lib/face-meh-blank.svg',
    '../icon_lib/face-rolling-eyes.svg',
    '../icon_lib/face-sad-cry.svg',
    '../icon_lib/face-sad-tear.svg',
    '../icon_lib/face-smile.svg',
    '../icon_lib/face-smile-beam.svg',
    '../icon_lib/face-smile-wink.svg',
    '../icon_lib/face-surprise.svg',
    '../icon_lib/face-tired.svg',
    '../icon_lib/file.svg',
    '../icon_lib/file-audio.svg',
    '../icon_lib/file-code.svg',
    '../icon_lib/file-excel.svg',
    '../icon_lib/file-image.svg',
    '../icon_lib/file-lines.svg',
    '../icon_lib/filenames.txt',
    '../icon_lib/file-pdf.svg',
    '../icon_lib/file-powerpoint.svg',
    '../icon_lib/file-video.svg',
    '../icon_lib/file-word.svg',
    '../icon_lib/file-zipper.svg',
    '../icon_lib/flag.svg',
    '../icon_lib/floppy-disk.svg',
    '../icon_lib/folder.svg',
    '../icon_lib/folder-closed.svg',
    '../icon_lib/folder-open.svg',
    '../icon_lib/font-awesome.svg',
    '../icon_lib/futbol.svg',
    '../icon_lib/gem.svg',
    '../icon_lib/hand.svg',
    '../icon_lib/hand-back-fist.svg',
    '../icon_lib/hand-lizard.svg',
    '../icon_lib/hand-peace.svg',
    '../icon_lib/hand-point-down.svg',
    '../icon_lib/hand-pointer.svg',
    '../icon_lib/hand-point-left.svg',
    '../icon_lib/hand-point-right.svg',
    '../icon_lib/hand-point-up.svg',
    '../icon_lib/hand-scissors.svg',
    '../icon_lib/handshake.svg',
    '../icon_lib/hand-spock.svg',
    '../icon_lib/hard-drive.svg',
    '../icon_lib/heart.svg',
    '../icon_lib/hospital.svg',
    '../icon_lib/hourglass.svg',
    '../icon_lib/hourglass-half.svg',
    '../icon_lib/id-badge.svg',
    '../icon_lib/id-card.svg',
    '../icon_lib/image.svg',
    '../icon_lib/images.svg',
    '../icon_lib/keyboard.svg',
    '../icon_lib/lemon.svg',
    '../icon_lib/life-ring.svg',
    '../icon_lib/lightbulb.svg',
    '../icon_lib/map.svg',
    '../icon_lib/message.svg',
    '../icon_lib/money-bill-1.svg',
    '../icon_lib/moon.svg',
    '../icon_lib/newspaper.svg',
    '../icon_lib/note-sticky.svg',
    '../icon_lib/object-group.svg',
    '../icon_lib/object-ungroup.svg',
    '../icon_lib/paper-plane.svg',
    '../icon_lib/paste.svg',
    '../icon_lib/pen-to-square.svg',
    '../icon_lib/rectangle-list.svg',
    '../icon_lib/rectangle-xmark.svg',
    '../icon_lib/registered.svg',
    '../icon_lib/share-from-square.svg',
    '../icon_lib/snowflake.svg',
    '../icon_lib/square.svg',
    '../icon_lib/square-caret-down.svg',
    '../icon_lib/square-caret-left.svg',
    '../icon_lib/square-caret-right.svg',
    '../icon_lib/square-caret-up.svg',
    '../icon_lib/square-check.svg',
    '../icon_lib/square-full.svg',
    '../icon_lib/square-minus.svg',
    '../icon_lib/square-plus.svg',
    '../icon_lib/star.svg',
    '../icon_lib/star-half.svg',
    '../icon_lib/star-half-stroke.svg',
    '../icon_lib/sun.svg',
    '../icon_lib/thumbs-down.svg',
    '../icon_lib/thumbs-up.svg',
    '../icon_lib/trash-can.svg',
    '../icon_lib/user.svg',
    '../icon_lib/window-maximize.svg',
    '../icon_lib/window-minimize.svg',
    '../icon_lib/window-restore.svg',
    ]
    generate_icon_buttons_from_links_array();
}

/*Helper function*/
function generate_icon_buttons_from_links_array() {
    icon_library.innerHTML = ""; //reset
    let current_icon_names = icon_links.filter((icon_name) => {
        return (icon_name.toLowerCase()).includes(search_icon_input.value.toLowerCase());
    });

    //overflowing
    if (icon_library_page_number < 1) {icon_library_page_number = 0;}
    if (icon_library_page_number > Math.floor(current_icon_names.length / icon_library_page_size)) {icon_library_page_number = Math.floor(current_icon_names.length / icon_library_page_size);}
    //setting pages
    let start = (icon_library_page_number) * icon_library_page_size;
    let end = (icon_library_page_number+1) * icon_library_page_size;
    //more overflowing
    if (end > current_icon_names.length) {end = current_icon_names.length;}
    
    document.getElementById("page_text").innerHTML = ` ${start} - ${end} / ${current_icon_names.length}`;

    for (let i = start ; i < end ; i++) {
        let icon_button = document.createElement("div");
        icon_button.innerHTML = 
        `
        <div class="icon_button" type="button" onclick="sent_icon_data('${current_icon_names[i]}');">
            <img src="../icon_lib/${current_icon_names[i]}" alt="icon_${i}" loading="lazy">
        </div>
        `;
        icon_library.appendChild(icon_button);
    }
}

/*Helper function used in icon buttons*/
function sent_icon_data (icon_name) {
    let icon_name_no_file_ext = icon_name.slice(0,-4);
    document.getElementById("image_file_input").value = ""; //if icon then no image
    document.getElementById("save_button").setAttribute("download",`מחולל התמונות (${icon_name_no_file_ext})`);
    document.getElementById("icon_color_input").disabled = false;
    is_icon = true;
    image_link = "../icon_lib/"+icon_name;
    update();
}

/*Helper function used in file upload*/
function sent_image_data (r) {
    document.getElementById("save_button").setAttribute("download",`מחולל התמונות`);
    document.getElementById("icon_color_input").disabled = true;
    is_icon = false;
    image_link = r;
    update();
}

/*Helper function used in file upload*/
function handle_files (e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = function () {
        sent_image_data(reader.result);
    }
    reader.readAsDataURL(file);
}


/*Event Listeners for file uploads*/
document.getElementById("image_file_input").addEventListener('change',handle_files,false);



/*Functions That Run On Load*/
update_sliders();
//load_icon_links_from_API();
load_icon_links_from_directory();
update(); //Lehathil be regel yemin ;)