/*************************** HOUR PERIOD DISPLAY MANAGEMENT ***************************/

class HourPeriodDisplay{
    constructor(document, entries, scrolls, add_period_show_btn, remove_period_show_btn, add_period_cancel_btn, remove_period_cancel_btn, mask, add_popup, remove_popup, day_of_week_xs_view, section){ 
        this.document = document;   
        //ENTRIES//
        this.entries = entries;
        this.entries_valid = false;
        this.entries_elements = null;
        this.check_valid_entries = setInterval(this.check_valid_entries_handler.bind(this), 10);

        //SCROLLS//
        this.scrolls = scrolls;
        this.scrolls_valid = false;
        this.scrolls_elements = null;
        this.scrolls_handlers = null;
        this.check_valid_scrolls = setInterval(this.check_valid_scrolls_handler.bind(this), 10);


        //SHOW ADD PERIOD BUTTON
        this.add_period_show_btn = add_period_show_btn;
        this.add_period_show_btn_valid = false;
        this.add_period_show_btn_elements = null;
        this.check_valid_add_period_show_btn = setInterval(this.check_valid_add_period_show_btn_handler.bind(this), 10);

        //SHOW REMOVE PERIOD BUTTON
        this.remove_period_show_btn = remove_period_show_btn;
        this.remove_period_show_btn_valid = false;
        this.remove_period_show_btn_elements = null;
        this.check_valid_remove_period_show_btn = setInterval(this.check_valid_remove_period_show_btn_handler.bind(this), 10);

        //CANCEL ADD PERIOD BUTTON
        this.add_period_cancel_btn = add_period_cancel_btn;
        this.add_period_cancel_btn_valid = false;
        this.add_period_cancel_btn_element = null;
        this.check_valid_add_period_cancel_btn = setInterval(this.check_valid_add_period_cancel_btn_handler.bind(this), 10);


        //CANCEL REMOVE PERIOD BUTTON
        this.remove_period_cancel_btn = remove_period_cancel_btn;
        this.remove_period_cancel_btn_valid = false;
        this.remove_period_cancel_btn_element = null;
        this.check_valid_remove_period_cancel_btn = setInterval(this.check_valid_remove_period_cancel_btn_handler.bind(this), 10);


        //SECTION HANDLER
        this.elements_ready = [false, false, false, false, false, false];
        this.init_done = false;
        this.section = section;
        this.events_processed = false;
        this.check_section = setInterval(this.check_section_handler.bind(this), 10);

        //MASK
        this.mask = mask;

        //ADD PERIOD POPUP
        this.add_popup = add_popup;

        //REMOVE PERIOD POPUP
        this.remove_popup = remove_popup;

        //WEEK DAY SELECTOR EXTRA SMALL VIEW
        this.day_of_week_xs_view = day_of_week_xs_view;
    }

    check_valid_entries_handler = () => {
        if(!this.entries_valid){
            this.entries_valid = true;
            for(let entrie of this.entries){
                let entrie_elements = this.document.getElementsByClassName(entrie);
                entrie_elements = Array.from(entrie_elements);
                if(entrie_elements.length == 0){
                    this.entries_valid = false;
                }
            }
        }
        else{
            this.entries_elements = [];
            for(let entrie of this.entries){
                let entrie_elements = this.document.getElementsByClassName(entrie);
                entrie_elements = Array.from(entrie_elements);
                this.entries_elements.push(entrie_elements);
            }
            console.log(this.entries_elements)
            clearInterval(this.check_valid_entries);
            this.elements_ready[0] = true;
            this.check_valid_entries = null;
        }
    }

    check_valid_scrolls_handler = () => {
        if(!this.scrolls_valid){
            this.scrolls_valid = true;
            for(let scroll of this.scrolls){
                let scroll_elements = this.document.getElementsByClassName(scroll);
                scroll_elements = Array.from(scroll_elements);
                if(scroll_elements.length == 0){
                    this.scrolls_valid = false;
                }
            }
        }
        else{
            this.scrolls_elements = [];
            this.scrolls_handlers = [];
            let i = 0;
            for(let scroll of this.scrolls){
                let scroll_elements = this.document.getElementsByClassName(scroll);
                scroll_elements = Array.from(scroll_elements);
                this.scrolls_elements.push(scroll_elements);
                this.scrolls_handlers.push([]);
                for(let scroll_element of scroll_elements){
                    this.scrolls_handlers[i].push(null);
                }
                i++;
            }
            console.log(this.scrolls_elements)
            clearInterval(this.check_valid_scrolls);
            this.elements_ready[1] = true;
            this.check_valid_scrolls = null;
        }
    }

    check_valid_add_period_show_btn_handler = () => {
        if(!this.add_period_show_btn_valid){
            this.add_period_show_btn_valid = true;
            for(let button of this.add_period_show_btn){
                let button_element = this.document.getElementById(button);
                if(button_element == null){
                    this.add_period_show_btn_valid = false;
                }
            }
        }
        else{
            this.add_period_show_btn_elements = [];
            for(let button of this.add_period_show_btn){
                let button_element = this.document.getElementById(button);
                this.add_period_show_btn_elements.push(button_element);
            }
            clearInterval(this.check_valid_add_period_show_btn);
            this.elements_ready[2] = true;
            this.check_valid_add_period_show_btn = null;
        }
    }


    check_valid_remove_period_show_btn_handler = () => {
        if(!this.remove_period_show_btn_valid){
            this.remove_period_show_btn_valid = true;
            for(let button of this.remove_period_show_btn){
                let button_element = this.document.getElementById(button);
                if(button_element == null){
                    this.remove_period_show_btn_valid = false;
                }
            }
        }
        else{
            this.remove_period_show_btn_elements = [];
            for(let button of this.remove_period_show_btn){
                let button_element = this.document.getElementById(button);
                this.remove_period_show_btn_elements.push(button_element);
            }
            clearInterval(this.check_valid_remove_period_show_btn);
            this.elements_ready[3] = true;
            this.check_valid_remove_period_show_btn = null;
        }
    }

    check_valid_add_period_cancel_btn_handler = () => {
        if(!this.add_period_cancel_btn_valid){
            if(this.document.getElementById(this.add_period_cancel_btn) != null){
                this.add_period_cancel_btn_valid = true;
            }
        }
        else{
            this.add_period_cancel_btn_element = this.document.getElementById(this.add_period_cancel_btn);
            clearInterval(this.check_valid_add_period_cancel_btn);
            this.elements_ready[4] = true;
            this.check_valid_add_period_cancel_btn = null;
        }
    }


    check_valid_remove_period_cancel_btn_handler = () => {
        if(!this.remove_period_cancel_btn_valid){
            if(this.document.getElementById(this.remove_period_cancel_btn) != null){
                this.remove_period_cancel_btn_valid = true;
            }
        }
        else{
            this.remove_period_cancel_btn_element = this.document.getElementById(this.remove_period_cancel_btn);
            clearInterval(this.check_valid_remove_period_cancel_btn);
            this.elements_ready[5] = true;
            this.check_valid_remove_period_cancel_btn = null;
        }
    }

    check_section_handler = () => {
        if(!this.init_done){
            let checker = true;
            console.log(this.elements_ready);
            for(let element_valid of this.elements_ready){
                if(!element_valid){
                    checker = false;
                }
            }
            if(checker){
                this.init_done = true;
            }
        }
        else{
            if(!this.document.getElementById(this.section).hidden){
                if(!this.events_processed){
                    //ADD EVENT LISTENERS TO ELEMENTS
                    let i = 0;
                    console.log(this.scrolls_handlers);
                    for(let scrolls of this.scrolls_elements){
                        if(i == 0){ //Left Scrolls
                            let j = 0;
                            for(let left_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[0], j,  left_scroll, this.entries_elements[0][j], "left");
                                j++;
                            }
                        }
                        else if(i == 1){ //Right Scrolls
                            let j = 0;
                            for(let right_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[1], j, right_scroll, this.entries_elements[0][j], "right");
                                j++;
                            }
                        }
                        else if(i == 2){ //Top scrolls small
                            let j = 0;
                            for(let top_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[2], j, top_scroll, this.entries_elements[1][j], "top");
                                j++;
                            }
                        }
                        else if(i == 3){ //Bottom scrolls small
                            let j = 0;
                            for(let bottom_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[3], j, bottom_scroll, this.entries_elements[1][j], "bottom");
                                j++;
                            }
                        }
                        else if(i == 4){ //Top scroll extra small
                            let j = 0;
                            for(let top_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[4], j, top_scroll, this.entries_elements[2][j], "top");
                                j++;
                            }
                        }
                        else if(i == 5){ //Bottom scroll extra small
                            let j = 0;
                            for(let bottom_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[5], j, bottom_scroll, this.entries_elements[2][j], "bottom");
                                j++;
                            }
                        }
                        i++;
                    }
                    this.events_processed = true;
                    console.log(this.scrolls_handlers);
                }
            }
            else{
                if(this.events_processed){
                    //CLEAN EVENT LISTENERS
                    this.events_processed = false;
                }
            }
        }
    }

    //ASSIGN SCROLL HANDLER

    assign_scroll_handler(scroll_handler, handler_position, scroll_element, entrie_element, scroll_type){
        let scroll_speedup = null;
        let scroll_interval = 20;
        //console.log(scroll_element);
        //console.log(scroll_handler);
        if(scroll_handler[handler_position] == null){
            scroll_handler[handler_position] = this.scroll_function.bind(this, entrie_element, scroll_type, scroll_interval);
            scroll_element.addEventListener("click", scroll_handler[handler_position]);
        }
    }

    //SCROLL FUNCTION//

    scroll_function(entrie_element, scroll_type, scroll_interval){
        console.log("im running");
        if(scroll_type == "left"){
            entrie_element.scrollLeft -= scroll_interval;
        }
        else if(scroll_type == "right"){
            entrie_element.scrollLeft += scroll_interval;
        }
        else if(scroll_type == "top"){
            entrie_element.scrollTop -= scroll_interval;
        }
        else if(scroll_type == "bottom"){
            entrie_element.scrollTop += scroll_interval;
        }
        else{
            console.log("error in scroll function");
        }
    }

}

let hour_period_entries = ["table-horizontal-row-content", "table-vertical-col-content", "hour-control-table-extra-small"];
let hour_period_scrolls = ["arrow-container-left", "arrow-container-right", "arrow-container-top", "arrow-container-bottom", "arrow-container-top-xs", "arrow-container-bottom-xs"];
let show_add_period_popup_btn = ["show_add_period_popup_btn", "show_add_period_popup_btn_s", "show_add_period_popup_btn_xs"];
let show_remove_period_popup_btn = ["show_remove_period_popup_btn", "show_remove_period_popup_btn_s", "show_remove_period_popup_btn_xs"];
let cancel_add_hour_period_btn = "cancel_add_hour_period_btn";
let cancel_remove_hour_period_btn = "cancel_remove_hour_period_btn";
let hour_period_mask = "hour_period_mask";
let hour_period_add_popup = "add_period_popup";
let hour_period_remove_popup = "remove_period_popup";
let day_of_week_selector_xs = "day_of_week_selector_xs";

let hour_period_display = new HourPeriodDisplay(document, hour_period_entries, hour_period_scrolls, show_add_period_popup_btn, show_remove_period_popup_btn, cancel_add_hour_period_btn, cancel_remove_hour_period_btn, hour_period_mask, hour_period_add_popup, hour_period_remove_popup, day_of_week_selector_xs, "config_content");










/*

let datetime_pickers = [];

// Function to initialize Flatpickr and destroy the old instances
function initializeFlatpickr() {
    // Destroy the old instances
    datetime_pickers.forEach(function (picker) {
        picker.destroy();
    });

    // Create new instances and store them in the array
    datetime_pickers = flatpickr(".daily-time-period-picker", {
        enableTime: true,
        time_24hr: true,
        altInput: true,
        noCalendar: true,
        altFormat: "H:i:S",
        dateFormat: "H:i:S",
        disableMobile: true, // Note: Removed the quotes around "true"
        enableSeconds: true
    });
}

function init_hour_period_display(){

    let show_add_period_popup_btn = document.getElementById("show_add_period_popup_btn");

    let show_add_period_popup_btn_xs = document.getElementById("show_add_period_popup_btn_xs");

    let show_add_period_popup_btn_s = document.getElementById("show_add_period_popup_btn_s");

    let show_remove_period_popup_btn = document.getElementById("show_remove_period_popup_btn");

    let show_remove_period_popup_btn_xs = document.getElementById("show_remove_period_popup_btn_xs");

    let show_remove_period_popup_btn_s = document.getElementById("show_remove_period_popup_btn_s");



    let cancel_add_hour_period_btn = document.getElementById("cancel_add_hour_period_btn");
    let cancel_remove_hour_period_btn = document.getElementById("cancel_remove_hour_period_btn");
    let hour_period_mask = document.getElementById("hour_period_mask");


    let entries = document.getElementsByClassName("table-horizontal-row-content");
    let left_scrolls = document.getElementsByClassName("arrow-container-left");
    let right_scrolls = document.getElementsByClassName("arrow-container-right");

    let s_entries = document.getElementsByClassName("table-vertical-col-content");
    let top_scrolls = document.getElementsByClassName("arrow-container-top");
    let bottom_scrolls = document.getElementsByClassName("arrow-container-bottom");

    let xs_entries = document.getElementById("table_extra_small_content");
    let xs_top_scroll = document.getElementById("btn_top_scroll_xs_hp");
    let xs_bottom_scroll = document.getElementById("btn_bottom_scroll_xs_hp");
    let day_of_week_selector_xs = document.getElementById("day_of_week_selector_xs");



  
        

    let left_interval = null;
    let left_interval_step = 0;
    let right_interval = null;
    let right_interval_step = 0


    let top_interval_xs = null;
    let top_interval_xs_step = 0;
    let bottom_interval_xs = null;
    let bottom_interval_xs_step = 0;

    let top_interval = null;
    let top_interval_step = 0;
    let bottom_interval = null;
    let bottom_interval_step = 0;



    function scroll_up_xs(){
        let top_scroll_speedup = null;
        if(top_interval_xs == null){
            top_interval_xs = setInterval(top_scroll_xs_handler, 1);
            top_interval_xs_step = 1;
            document.addEventListener('mouseup', buttonReleaseHandler);
            document.addEventListener('touchend', buttonReleaseHandler, {passive: true});
        }
        function top_scroll_xs_handler(){
            xs_entries.scrollTop -= top_interval_xs_step;
            if(top_scroll_speedup == null){
                top_scroll_speedup = setTimeout(top_scroll_speedup_handler, 1500);
            }
            function top_scroll_speedup_handler(){
                top_interval_xs_step = 2;
            }
        }
        function buttonReleaseHandler() {
            while(top_interval_xs != null){
                clearInterval(top_interval_xs);
                clearInterval(top_scroll_speedup);
                top_interval_xs = null;
                top_scroll_speedup = null;
            }
            document.removeEventListener('mouseup', buttonReleaseHandler);
            document.removeEventListener('touchend', buttonReleaseHandler);
        }
    }

    function scroll_down_xs(){
        let bottom_scroll_speedup = null;
        if(bottom_interval_xs == null){
            bottom_interval_xs = setInterval(bottom_scroll_xs_handler, 1);
            bottom_interval_xs_step = 1;
            document.addEventListener('mouseup', buttonReleaseHandler);
            document.addEventListener('touchend', buttonReleaseHandler, {passive: true});
        }
        function bottom_scroll_xs_handler(){
            xs_entries.scrollTop += bottom_interval_xs_step;
            if(bottom_scroll_speedup == null){
                bottom_scroll_speedup = setTimeout(bottom_scroll_speedup_handler, 1500);
            }
            function bottom_scroll_speedup_handler(){
                bottom_interval_xs_step = 2;
            }
        }
        function buttonReleaseHandler() {
            while(bottom_interval_xs != null){
                clearInterval(bottom_interval_xs);
                clearInterval(bottom_scroll_speedup);
                bottom_interval_xs = null;
                bottom_scroll_speedup_handler_scroll_speedup = null;
            }
            document.removeEventListener('mouseup', buttonReleaseHandler);
            document.removeEventListener('touchend', buttonReleaseHandler);
        }
    }

    function scroll_top(event){
        let top_scroll_speedup = null;
        let i = -1;
        if(top_interval == null){
            top_interval = setInterval(top_scroll_handler, 1); 
            top_interval_step = 1;
            document.addEventListener('mouseup', buttonReleaseHandler); 
            document.addEventListener('touchend', buttonReleaseHandler, {passive: true});
        }
        function top_scroll_handler(){
            if (i == -1){
                let element_id = event.target.id;
                if(element_id == "btn_top_scroll_first_hp"){
                    i = 0;
                }
                else if(element_id == "btn_top_scroll_second_hp"){
                    i = 1;
                }
                else if(element_id == "btn_top_scroll_third_hp"){
                    i = 2;
                }
            }
            s_entries.item(i).scrollTop -= top_interval_step;
            if(top_scroll_speedup == null){
                top_scroll_speedup = setTimeout(top_scroll_speedup_handler, 1500);
            }
            function top_scroll_speedup_handler(){
                top_interval_step = 2;
            }
        }
        function buttonReleaseHandler() {
            while(top_interval != null){
                clearInterval(top_interval);
                clearInterval(top_scroll_speedup);
                top_interval = null;
                top_scroll_speedup = null;
            }
            document.removeEventListener('mouseup', buttonReleaseHandler);
            document.removeEventListener('touchend', buttonReleaseHandler);
        }
    }

    function scroll_bottom(event){
        let bottom_scroll_speedup = null;
        let i = -1;
        if(bottom_interval == null){
            bottom_interval = setInterval(bottom_scroll_handler, 1); 
            bottom_interval_step = 1;
            document.addEventListener('mouseup', buttonReleaseHandler); 
            document.addEventListener('touchend', buttonReleaseHandler, {passive: true});
        }
        function bottom_scroll_handler(){
            if (i == -1){
                let element_id = event.target.id;
                if(element_id == "btn_bottom_scroll_first_hp"){
                    i = 0;
                }
                else if(element_id == "btn_bottom_scroll_second_hp"){
                    i = 1;
                }
                else if(element_id == "btn_bottom_scroll_third_hp"){
                    i = 2;
                }
            }
            s_entries.item(i).scrollTop += bottom_interval_step;
            if(bottom_scroll_speedup == null){
                bottom_scroll_speedup = setTimeout(bottom_scroll_speedup_handler, 1500);
            }
            function bottom_scroll_speedup_handler(){
                bottom_interval_step = 2;
            }
        }
        function buttonReleaseHandler() {
            while(bottom_interval != null){
                clearInterval(bottom_interval);
                clearInterval(bottom_scroll_speedup);
                bottom_interval = null;
                bottom_scroll_speedup = null;
            }
            document.removeEventListener('mouseup', buttonReleaseHandler);
            document.removeEventListener('touchend', buttonReleaseHandler);
        }
    }



    function scroll_left(event){
        let left_scroll_speedup = null;
        let i = -1;
        if(left_interval == null){
            left_interval = setInterval(left_scroll_handler, 1); 
            left_interval_step = 1;
            document.addEventListener('mouseup', buttonReleaseHandler); 
            document.addEventListener('touchend', buttonReleaseHandler, {passive: true});
        }
        function left_scroll_handler(){
            if (i == -1){
                let element_id = event.target.id;
                if(element_id == "btn_left_scroll_monday_hp"){
                    i = 0;
                }
                else if(element_id == "btn_left_scroll_tuesday_hp"){
                    i = 1;
                }
                else if(element_id == "btn_left_scroll_wednesday_hp"){
                    i = 2;
                }
                else if(element_id == "btn_left_scroll_thursday_hp"){
                    i = 3;
                }
                else if(element_id == "btn_left_scroll_friday_hp"){
                    i = 4;
                }
                else if(element_id == "btn_left_scroll_saturday_hp"){
                    i = 5;
                }
                else if(element_id == "btn_left_scroll_sunday_hp"){
                    i = 6;
                }
            }
            entries.item(i).scrollLeft -= left_interval_step;
            if(left_scroll_speedup == null){
                left_scroll_speedup = setTimeout(left_scroll_speedup_handler, 1500);
            }
            function left_scroll_speedup_handler(){
                left_interval_step = 2;
            }
        }
        function buttonReleaseHandler() {
            while(left_interval != null){
                clearInterval(left_interval);
                clearInterval(left_scroll_speedup);
                left_interval = null;
                left_scroll_speedup = null;
            }
            document.removeEventListener('mouseup', buttonReleaseHandler);
            document.removeEventListener('touchend', buttonReleaseHandler);
        }
    }

    function scroll_right(event){
        let right_scroll_speedup = null;
        let i = -1;
        if(right_interval == null){
            right_interval = setInterval(right_scroll_handler, 1);
            right_interval_step = 1;
            document.addEventListener('mouseup', buttonReleaseHandler);
            document.addEventListener('touchend', buttonReleaseHandler, {passive: true});
        }
        function right_scroll_handler(){
            if (i == -1){
                let element_id = event.target.id;
                if(element_id == "btn_right_scroll_monday_hp"){
                    i = 0;
                }
                else if(element_id == "btn_right_scroll_tuesday_hp"){
                    i = 1;
                }
                else if(element_id == "btn_right_scroll_wednesday_hp"){
                    i = 2;
                }
                else if(element_id == "btn_right_scroll_thursday_hp"){
                    i = 3;
                }
                else if(element_id == "btn_right_scroll_friday_hp"){
                    i = 4;
                }
                else if(element_id == "btn_right_scroll_saturday_hp"){
                    i = 5;
                }
                else if(element_id == "btn_right_scroll_sunday_hp"){
                    i = 6;
                }
            }
            entries.item(i).scrollLeft += right_interval_step;
            if(right_scroll_speedup == null){
                right_scroll_speedup = setTimeout(right_scroll_speedup_handler, 1500);
            }
            function right_scroll_speedup_handler(){
                right_interval_step = 2;
            }
        }
        function buttonReleaseHandler() {
            while(right_interval != null){
                clearInterval(right_interval);
                clearInterval(right_scroll_speedup);
                right_interval = null;
                right_scroll_speedup = null;
            }
            document.removeEventListener('mouseup', buttonReleaseHandler);
            document.removeEventListener('touchend', buttonReleaseHandler);
        }
    }


    xs_top_scroll.addEventListener('mousedown', scroll_up_xs);  
    xs_top_scroll.addEventListener('touchstart', scroll_up_xs, {passive: true});  


    xs_bottom_scroll.addEventListener('mousedown', scroll_down_xs);
    xs_bottom_scroll.addEventListener('touchstart', scroll_down_xs, {passive: true});


    for(let top_scroll of top_scrolls){
        top_scroll.addEventListener('mousedown', function(event) {
            scroll_top(event);
        });
        top_scroll.addEventListener('touchstart', function(event) {
            scroll_top(event);
        }, {passive: true});
    }

    for(let bottom_scroll of bottom_scrolls){
        bottom_scroll.addEventListener('mousedown', function(event) {
            scroll_bottom(event);
        });
        bottom_scroll.addEventListener('touchstart', function(event) {
            scroll_bottom(event);
        }, {passive: true});
    }


    for(let left_scroll of left_scrolls){
        left_scroll.addEventListener('mousedown', function(event) {
            scroll_left(event);
        });
        left_scroll.addEventListener('touchstart', function(event) {
            scroll_left(event);
        }, {passive: true});
    }


    for(let right_scroll of right_scrolls){
        right_scroll.addEventListener('mousedown', function(event) {
            scroll_right(event);
        });
        right_scroll.addEventListener('touchstart', function(event) {
            scroll_right(event);
        }, {passive: true});
    }


    hour_period_mask.addEventListener("click", (event) => {
        if (!event.target.closest("#add_period_popup")){
            document.getElementById("add_period_popup").style.display = "none";
            document.getElementById("remove_period_popup").style.display = "none";
            document.getElementById("hour_period_mask").style.display = "none";    
            cleanHourPeriodPopup(datetime_pickers);                        
        }
    });
    show_add_period_popup_btn.addEventListener('click', function() {
        if(document.getElementById("add_period_popup").style.display != "flex"){
            document.getElementById("add_period_popup").style.display = "flex";
            document.getElementById("hour_period_mask").style.display = "block";
        }
    });

        
    show_add_period_popup_btn_s.addEventListener('click', function() {
        if(document.getElementById("add_period_popup").style.display != "flex"){
            document.getElementById("add_period_popup").style.display = "flex";
            document.getElementById("hour_period_mask").style.display = "block";
        }
    });

    show_add_period_popup_btn_xs.addEventListener('click', function() {
        let week_day = day_of_week_selector_xs.selectedIndex;
        document.getElementById("add_day_of_week_selector").selectedIndex = week_day;
        if(document.getElementById("add_period_popup").style.display != "flex"){
            document.getElementById("add_period_popup").style.display = "flex";
            document.getElementById("hour_period_mask").style.display = "block";
        }
    });
        

    cancel_add_hour_period_btn.addEventListener('click', function() {
        if(document.getElementById("add_period_popup").style.display == "flex"){
            document.getElementById("add_period_popup").style.display = "none";
            document.getElementById("hour_period_mask").style.display = "none";
            cleanHourPeriodPopup(datetime_pickers);
        }
    });
        
    show_remove_period_popup_btn.addEventListener('click', function() {
        if(document.getElementById("remove_period_popup").style.display != "flex"){
            document.getElementById("remove_period_popup").style.display = "flex";
            document.getElementById("hour_period_mask").style.display = "block";
        }
    });

    show_remove_period_popup_btn_s.addEventListener('click', function() {
        if(document.getElementById("remove_period_popup").style.display != "flex"){
            document.getElementById("remove_period_popup").style.display = "flex";
            document.getElementById("hour_period_mask").style.display = "block";
        }
    });

    show_remove_period_popup_btn_xs.addEventListener('click', function() {
        let week_day = day_of_week_selector_xs.selectedIndex;
        document.getElementById("remove_day_of_week_selector").selectedIndex = week_day;
        if(document.getElementById("remove_period_popup").style.display != "flex"){
            document.getElementById("remove_period_popup").style.display = "flex";
            document.getElementById("hour_period_mask").style.display = "block";
        }
    });
        
    cancel_remove_hour_period_btn.addEventListener('click', function() {
        if(document.getElementById("remove_period_popup").style.display == "flex"){
            document.getElementById("remove_period_popup").style.display = "none";
            document.getElementById("hour_period_mask").style.display = "none";
        }
    });
    initializeFlatpickr();
}

*/

/************************* END HOUR PERIOD DISPLAY MANAGEMENT *************************/
/**************************************************************************************/


/************************************ FUNCTIONS ***************************************/


function checkValidTime(hours, minutes, seconds){
    if(hours < 0 || hours > 23 || !Number.isInteger(hours)){
        return false;
    }   
    if(minutes < 0 || minutes > 59 || !Number.isInteger(minutes)){
        return false;
    }
    if(seconds < 0 || seconds > 59 || !Number.isInteger(seconds)){
        return false;
    }
    return true;
}


function checkValidHourPeriod(initial_period_time, final_period_time){
    if(initial_period_time == "" && final_period_time == ""){
        return 1;
    }
    else if(initial_period_time == ""){
        return 2;
    }
    else if(final_period_time == ""){
        return 3;
    }
    let initial_period_content = initial_period_time.split(":");
    let final_period_content = final_period_time.split(":");

    let initial_period_hours = Number(initial_period_content[0]);
    let initial_period_minutes = Number(initial_period_content[1]);
    let initial_period_seconds = Number(initial_period_content[2]);

    let final_period_hours = Number(final_period_content[0]);
    let final_period_minutes = Number(final_period_content[1]);
    let final_period_seconds = Number(final_period_content[2]);
    
    let check_initial_period_time = checkValidTime(initial_period_hours, initial_period_minutes, initial_period_seconds);

    let check_final_period_time = checkValidTime(final_period_hours, final_period_minutes, final_period_seconds);

    if(!check_initial_period_time && !check_final_period_time){
        return -1;
    }
    else if(!check_initial_period_time){
        return -2;
    }
    else if(!check_final_period_time){
        return -3;
    }

    if(final_period_hours > initial_period_hours){
        return 0;
    }
    else if(final_period_hours == initial_period_hours){
        if(final_period_minutes > initial_period_minutes){
            return 0;
        }
        else if(final_period_minutes == initial_period_minutes){
            if(final_period_seconds > initial_period_seconds){
                return 0;
            }
            else{
                return 4;
            }
        }
        else{
            return 4;
        }
    }
    else{
        return 4;
    }
}

function checkValidEnergyLimit(limit_energy, limit_energy_enabled){
    if(limit_energy_enabled){
        if(limit_energy <= 0){
            return false;
        }
    }
    if(limit_energy < 0){
        return false;
    }
    return true;
}

function addHourPeriod(){
    let day_of_week = document.getElementById("add_day_of_week_selector").value;

    let initial_period_time = document.getElementById("add_initial_hour_period").value;

    let final_period_time = document.getElementById("add_final_hour_period").value;

    let hour_period_valid = checkValidHourPeriod(initial_period_time, final_period_time);
    
    //hour_period_valid possible values:
    //0: valid hour periods
    //1: insert valid hour periods
    //2: insert a valid initial period
    //3: insert a valid final period
    //4: the initial period must start before the final period
    //-1: Invalid Periods
    //-2: Invalid initial period
    //-3: Invalid final period

    if(hour_period_valid != 0){ //Invalid period
        if(hour_period_valid == 1){
            config_temporary_alerts.create_temporary_warning("info", "config", "Insira um período horário válido.");
        }
        else if(hour_period_valid == 2){
            config_temporary_alerts.create_temporary_warning("info", "config", "Insira um período inicial válido.");
        }
        else if(hour_period_valid == 3){
            config_temporary_alerts.create_temporary_warning("info", "config", "Insira um período final válido.");
        }
        else if(hour_period_valid == 4){
            config_temporary_alerts.create_temporary_warning("warning", "config", "O período final deve suceder o período inicial.");
        }
        else if(hour_period_valid == -1){
            config_temporary_alerts.create_temporary_warning("danger", "config", "Os períodos inseridos são inválidos.");
        }
        else if(hour_period_valid == -2){
            config_temporary_alerts.create_temporary_warning("danger", "config", "O período inicial é inválido.");
        }
        else if(hour_period_valid == -3){
            config_temporary_alerts.create_temporary_warning("danger", "config", "O período final é inválido.");
        }
        return;   
    }

    let message = active_device.name+";"+"add_hour_period"+";"+"day_of_week:"+day_of_week+","+"initial_hour_period:"+initial_period_time+","+"final_hour_period:"+final_period_time;


    ws_client.send(message);

    device_hour_periods.set_waiting_fb();


    let first_response_timeout = setTimeout(first_response_timeout_handler, 10000);
    let first_response_check = setInterval(first_response_check_handler, 10);
    let processing_alert = null;

    function first_response_timeout_handler(){
        if(device_hour_periods.waiting_fb){
            if(processing_alert != null){
                config_temporary_alerts.remove_temporary_warning(processing_alert);
                processing_alert = null;
            }            
            config_temporary_alerts.create_temporary_warning("danger", "config", "O servidor não respondeu ao pedido.");
            device_hour_periods.reset_waiting_fb();
            clearInterval(first_response_check);
            clearTimeout(first_response_timeout);
        }
    }

    function first_response_check_handler(){
        if(!device_hour_periods.waiting_fb){
            clearInterval(first_response_check);
            clearTimeout(first_response_timeout);
            if(processing_alert != null){
                config_temporary_alerts.remove_temporary_warning(processing_alert);
                processing_alert = null;
            }
        }
        else{
            processing_alert = config_temporary_alerts.create_temporary_warning("waiter-info", "config", "Processando o pedido...");
        }
    }

}

function cleanHourPeriodPopup(datetime_pickers){

    for(let datetime_picker in datetime_pickers){
        datetime_pickers[datetime_picker].setDate("");
    }

    document.getElementById("add_day_of_week_selector").selectedIndex = 0;

    document.getElementById("remove_day_of_week_selector").selectedIndex = 0;
}


function removeHourPeriod(){

    let day_of_week = document.getElementById("remove_day_of_week_selector").value;

    let initial_period_time = document.getElementById("remove_initial_hour_period").value;

    let final_period_time = document.getElementById("remove_final_hour_period").value;

    let hour_period_valid = checkValidHourPeriod(initial_period_time, final_period_time);
    
    //hour_period_valid possible values:
    //0: valid hour periods
    //1: insert valid hour periods
    //2: insert a valid initial period
    //3: insert a valid final period
    //4: the initial period must start before the final period
    //-1: Invalid Periods
    //-2: Invalid initial period
    //-3: Invalid final period

    if(hour_period_valid != 0){ //Invalid period
        if(hour_period_valid == 1){
            config_temporary_alerts.create_temporary_warning("info", "config", "Insira um período horário válido.");
        }
        else if(hour_period_valid == 2){
            config_temporary_alerts.create_temporary_warning("info", "config", "Insira um período inicial válido.");
        }
        else if(hour_period_valid == 3){
            config_temporary_alerts.create_temporary_warning("info", "config", "Insira um período final válido.");
        }
        else if(hour_period_valid == 4){
            config_temporary_alerts.create_temporary_warning("warning", "config", "O período final deve suceder o período inicial.");
        }
        else if(hour_period_valid == -1){
            config_temporary_alerts.create_temporary_warning("danger", "config", "Os períodos inseridos são inválidos.");
        }
        else if(hour_period_valid == -2){
            config_temporary_alerts.create_temporary_warning("danger", "config", "O período inicial é inválido.");
        }
        else if(hour_period_valid == -3){
            config_temporary_alerts.create_temporary_warning("danger", "config", "O período final é inválido.");
        }
        return;   
    }

    let message = active_device.name+";"+"remove_hour_period"+";"+"day_of_week:"+day_of_week+","+"initial_hour_period:"+initial_period_time+","+"final_hour_period:"+final_period_time;

    ws_client.send(message);

    device_hour_periods.set_waiting_fb();

    let first_response_timeout = setTimeout(first_response_timeout_handler, 10000);
    let first_response_check = setInterval(first_response_check_handler, 10);
    let processing_alert = null;

    function first_response_timeout_handler(){
        if(device_hour_periods.waiting_fb){
            if(processing_alert != null){
                config_temporary_alerts.remove_temporary_warning(processing_alert);
                processing_alert = null;
            }            
            config_temporary_alerts.create_temporary_warning("danger", "config", "O servidor não respondeu ao pedido.");
            device_hour_periods.reset_waiting_fb();
            clearInterval(first_response_check);
            clearTimeout(first_response_timeout);
        }
    }

    function first_response_check_handler(){
        if(!device_hour_periods.waiting_fb){
            clearInterval(first_response_check);
            clearTimeout(first_response_timeout);
            if(processing_alert != null){
                config_temporary_alerts.remove_temporary_warning(processing_alert);
                processing_alert = null;
            }
        }
        else{
            processing_alert = config_temporary_alerts.create_temporary_warning("waiter-info", "config", "Processando o pedido...");
        }
    }
}

/********************************** END FUNCTIONS *************************************/
/**************************************************************************************/