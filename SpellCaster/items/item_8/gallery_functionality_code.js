{
    function inc_slide(sender, inc_value, autoplay) {
        let this_slideshow_ID = get_id_from_sender(sender);
        let slides = document.querySelectorAll("#" + this_slideshow_ID + " .slide");
        let next_slide_index = get_current_slide(sender) + inc_value;
        //rotating slides
        if (next_slide_index >= slides.length) { next_slide_index = 0 }
        if (next_slide_index < 0) { next_slide_index = slides.length - 1 }
        set_current_slide(sender, next_slide_index, autoplay);
    }

    function get_current_slide(sender) {
        let this_slideshow_ID = get_id_from_sender(sender);
        let slides = document.querySelectorAll("#" + this_slideshow_ID + " .slide");
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].className.includes("activeSlide")) {
                return i;
            }
        }
    }

    function set_current_slide(sender, slide_num, autoplay) {
        let this_slideshow_ID = get_id_from_sender(sender);
        let slides = document.querySelectorAll("#" + this_slideshow_ID + " .slide");
        let dots = document.querySelectorAll("#" + this_slideshow_ID + " .dot");
        let slide_counter = document.querySelector("#" + this_slideshow_ID + " .slide_counter");
        let timer = document.querySelector("#" + this_slideshow_ID + " .timer");

        //remove fading caused by auto-play
        if (timer) {timer.setAttribute("time", 0);}//reset autoplay timer
        if (!autoplay) { for (let i = 0; i < slides.length; i++) { slides[i].style.transition = "none" } }
        //clear actives
        for (let i = 0; i < slides.length; i++) { slides[i].className = slides[i].className.replace(" activeSlide", "") }
        for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" activeDot", "") }
        //assign new actives
        if (slides.length > 0) {
            slides[slide_num].className += " activeSlide";
            dots[slide_num].className += " activeDot";
        }
        //set text to correct slide
        if (slide_counter) {slide_counter.innerHTML = (slide_num + 1) + " / " + (slides.length);}
    }

    function get_id_from_sender(sender) {
        let id;
        while (!sender.className.includes("nami_container")) {
            sender = sender.parentElement;
        }
        return sender.id;
    }
    
    function start_timer(sender) {
        let all_timers = document.querySelectorAll(".timer");
        let this_slideshow_ID = get_id_from_sender(sender);
        let this_timer = document.querySelector("#" + this_slideshow_ID + " .timer");

        let is_there_already_a_timer;
        if (all_timers.length > 1) {is_there_already_a_timer = true}
        
        if (this_timer != all_timers[all_timers.length-1]) {all_timers = document.querySelectorAll(".timer");return;}
        autoplay_timer = window.setInterval(function () { //start clock
            for (let i = 0 ; i < all_timers.length ; i++) {
                let timer = all_timers[i];
                let this_slideshow_ID = get_id_from_sender(timer);
                let slides = document.querySelectorAll("#" + this_slideshow_ID + " .slide");
                timer.setAttribute("time", parseInt(timer.getAttribute("time")) + parseInt(timer.getAttribute("speed")));
                if (parseInt(timer.getAttribute("time")) >= timer.getAttribute("slowness")) {
                    timer.setAttribute("time", 0);
                    for (let j = 0; j < slides.length; j++) { slides[j].style.transition = "1s ease" }
                    inc_slide(timer, 1, true);
                }
            }
        }, 1000);
    }

    //initialization
    window.addEventListener("load",(event) => {
        let autoplay_timer = window.setInterval(function () {}, 0);
        let all_slideshows = document.querySelectorAll(".slideshow_container");
        for (let i = 0; i < all_slideshows.length; i++) {
            set_current_slide(all_slideshows[i], 0);
            start_timer(all_slideshows[i]);
        }
    });
    }