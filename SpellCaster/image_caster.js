
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
const icon_library_page_size = 50;


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
    icon_links = ['address-book.svg',
    'address-card.svg',
    'bell.svg',
    'bell-slash.svg',
    'bookmark.svg',
    'building.svg',
    'calendar.svg',
    'calendar-check.svg',
    'calendar-days.svg',
    'calendar-minus.svg',
    'calendar-plus.svg',
    'calendar-xmark.svg',
    'chart-bar.svg',
    'chess-bishop.svg',
    'chess-king.svg',
    'chess-knight.svg',
    'chess-pawn.svg',
    'chess-queen.svg',
    'chess-rook.svg',
    'circle.svg',
    'circle-check.svg',
    'circle-dot.svg',
    'circle-down.svg',
    'circle-left.svg',
    'circle-pause.svg',
    'circle-play.svg',
    'circle-question.svg',
    'circle-right.svg',
    'circle-stop.svg',
    'circle-up.svg',
    'circle-user.svg',
    'circle-xmark.svg',
    'clipboard.svg',
    'clock.svg',
    'clone.svg',
    'closed-captioning.svg',
    'comment.svg',
    'comment-dots.svg',
    'comments.svg',
    'compass.svg',
    'copy.svg',
    'copyright.svg',
    'credit-card.svg',
    'envelope.svg',
    'envelope-open.svg',
    'eye.svg',
    'eye-slash.svg',
    'face-angry.svg',
    'face-dizzy.svg',
    'face-flushed.svg',
    'face-frown.svg',
    'face-frown-open.svg',
    'face-grimace.svg',
    'face-grin.svg',
    'face-grin-beam.svg',
    'face-grin-beam-sweat.svg',
    'face-grin-hearts.svg',
    'face-grin-squint.svg',
    'face-grin-squint-tears.svg',
    'face-grin-stars.svg',
    'face-grin-tears.svg',
    'face-grin-tongue.svg',
    'face-grin-tongue-squint.svg',
    'face-grin-tongue-wink.svg',
    'face-grin-wide.svg',
    'face-grin-wink.svg',
    'face-kiss.svg',
    'face-kiss-beam.svg',
    'face-kiss-wink-heart.svg',
    'face-laugh.svg',
    'face-laugh-beam.svg',
    'face-laugh-squint.svg',
    'face-laugh-wink.svg',
    'face-meh.svg',
    'face-meh-blank.svg',
    'face-rolling-eyes.svg',
    'face-sad-cry.svg',
    'face-sad-tear.svg',
    'face-smile.svg',
    'face-smile-beam.svg',
    'face-smile-wink.svg',
    'face-surprise.svg',
    'face-tired.svg',
    'file.svg',
    'file-audio.svg',
    'file-code.svg',
    'file-excel.svg',
    'file-image.svg',
    'file-lines.svg',
    'filenames.txt',
    'file-pdf.svg',
    'file-powerpoint.svg',
    'file-video.svg',
    'file-word.svg',
    'file-zipper.svg',
    'flag.svg',
    'floppy-disk.svg',
    'folder.svg',
    'folder-closed.svg',
    'folder-open.svg',
    'font-awesome.svg',
    'futbol.svg',
    'gem.svg',
    'hand.svg',
    'hand-back-fist.svg',
    'hand-lizard.svg',
    'hand-peace.svg',
    'hand-point-down.svg',
    'hand-pointer.svg',
    'hand-point-left.svg',
    'hand-point-right.svg',
    'hand-point-up.svg',
    'hand-scissors.svg',
    'handshake.svg',
    'hand-spock.svg',
    'hard-drive.svg',
    'heart.svg',
    'hospital.svg',
    'hourglass.svg',
    'hourglass-half.svg',
    'id-badge.svg',
    'id-card.svg',
    'image.svg',
    'images.svg',
    'keyboard.svg',
    'lemon.svg',
    'life-ring.svg',
    'lightbulb.svg',
    'map.svg',
    'message.svg',
    'money-bill-1.svg',
    'moon.svg',
    'newspaper.svg',
    'note-sticky.svg',
    'object-group.svg',
    'object-ungroup.svg',
    'paper-plane.svg',
    'paste.svg',
    'pen-to-square.svg',
    'rectangle-list.svg',
    'rectangle-xmark.svg',
    'registered.svg',
    'share-from-square.svg',
    'snowflake.svg',
    'square.svg',
    'square-caret-down.svg',
    'square-caret-left.svg',
    'square-caret-right.svg',
    'square-caret-up.svg',
    'square-check.svg',
    'square-full.svg',
    'square-minus.svg',
    'square-plus.svg',
    'star.svg',
    'star-half.svg',
    'star-half-stroke.svg',
    'sun.svg',
    'thumbs-down.svg',
    'thumbs-up.svg',
    'trash-can.svg',
    'user.svg',
    'window-maximize.svg',
    'window-minimize.svg',
    'window-restore.svg',
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