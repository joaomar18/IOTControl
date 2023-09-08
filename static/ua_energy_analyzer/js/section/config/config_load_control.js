/*************************** HOUR PERIOD DISPLAY MANAGEMENT ***************************/

class HourPeriodDisplay{
    constructor(document, entries, scrolls, add_period_show_btn, remove_period_show_btn, add_period_cancel_btn, remove_period_cancel_btn, mask, add_popup, remove_popup, day_of_week_xs_view, add_day_of_week_selector, remove_day_of_week_selector, timepickers_class, section){ 
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
        this.scroll_function_handlers = null;
        this.check_valid_scrolls = setInterval(this.check_valid_scrolls_handler.bind(this), 10);


        //SHOW ADD PERIOD BUTTON
        this.add_period_show_btn = add_period_show_btn;
        this.add_period_show_btn_valid = false;
        this.add_period_show_btn_elements = null;
        this.add_period_show_btn_handlers = null;
        this.check_valid_add_period_show_btn = setInterval(this.check_valid_add_period_show_btn_handler.bind(this), 10);

        //SHOW REMOVE PERIOD BUTTON
        this.remove_period_show_btn = remove_period_show_btn;
        this.remove_period_show_btn_valid = false;
        this.remove_period_show_btn_elements = null;
        this.remove_period_show_btn_handlers = null;
        this.check_valid_remove_period_show_btn = setInterval(this.check_valid_remove_period_show_btn_handler.bind(this), 10);

        //CANCEL ADD PERIOD BUTTON
        this.add_period_cancel_btn = add_period_cancel_btn;
        this.add_period_cancel_btn_valid = false;
        this.add_period_cancel_btn_element = null;
        this.add_period_cancel_btn_handler = null;
        this.check_valid_add_period_cancel_btn = setInterval(this.check_valid_add_period_cancel_btn_handler.bind(this), 10);


        //CANCEL REMOVE PERIOD BUTTON
        this.remove_period_cancel_btn = remove_period_cancel_btn;
        this.remove_period_cancel_btn_valid = false;
        this.remove_period_cancel_btn_element = null;
        this.remove_period_cancel_btn_handler = null;
        this.check_valid_remove_period_cancel_btn = setInterval(this.check_valid_remove_period_cancel_btn_handler.bind(this), 10);


        //SECTION HANDLER
        this.elements_ready = [false, false, false, false, false, false];
        this.init_done = false;
        this.section = section;
        this.events_processed = false;
        this.check_section = setInterval(this.check_section_handler.bind(this), 10);

        //MASK
        this.mask = mask;
        this.mask_handler = null;

        //ADD PERIOD POPUP
        this.add_popup = add_popup;

        //REMOVE PERIOD POPUP
        this.remove_popup = remove_popup;

        //WEEK DAY SELECTOR EXTRA SMALL VIEW
        this.day_of_week_xs_view = day_of_week_xs_view;

        this.add_day_of_week_selector = add_day_of_week_selector;
        this.remove_day_of_week_selector = remove_day_of_week_selector;


        //TIMEPICKERS
        this.timepickers_class = timepickers_class;
        this.datetime_pickers = null;

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
            this.scroll_function_handlers = [];
            let i = 0;
            for(let scroll of this.scrolls){
                let scroll_elements = this.document.getElementsByClassName(scroll);
                scroll_elements = Array.from(scroll_elements);
                this.scrolls_elements.push(scroll_elements);
                this.scrolls_handlers.push([]);
                this.scroll_function_handlers.push([]);
                for(let scroll_element of scroll_elements){
                    this.scrolls_handlers[i].push(null);
                    this.scroll_function_handlers[i].push([null, null]);
                }
                i++;
            }
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
            this.add_period_show_btn_handlers = [];
            for(let button of this.add_period_show_btn){
                let button_element = this.document.getElementById(button);
                this.add_period_show_btn_elements.push(button_element);
                this.add_period_show_btn_handlers.push(null);
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
            this.remove_period_show_btn_handlers = [];
            for(let button of this.remove_period_show_btn){
                let button_element = this.document.getElementById(button);
                this.remove_period_show_btn_elements.push(button_element);
                this.remove_period_show_btn_handlers.push(null);
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

                    //SCROLLS//

                    for(let scrolls of this.scrolls_elements){
                        if(i == 0){ //Left Scrolls
                            let j = 0;
                            for(let left_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[0], this.scroll_function_handlers, j, i,  left_scroll, this.entries_elements[0][j], "left");
                                j++;
                            }
                        }
                        else if(i == 1){ //Right Scrolls
                            let j = 0;
                            for(let right_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[1], this.scroll_function_handlers, j, i, right_scroll, this.entries_elements[0][j], "right");
                                j++;
                            }
                        }
                        else if(i == 2){ //Top scrolls small
                            let j = 0;
                            for(let top_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[2], this.scroll_function_handlers, j, i, top_scroll, this.entries_elements[1][j], "top");
                                j++;
                            }
                        }
                        else if(i == 3){ //Bottom scrolls small
                            let j = 0;
                            for(let bottom_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[3], this.scroll_function_handlers, j, i, bottom_scroll, this.entries_elements[1][j], "bottom");
                                j++;
                            }
                        }
                        else if(i == 4){ //Top scroll extra small
                            let j = 0;
                            for(let top_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[4], this.scroll_function_handlers, j, i, top_scroll, this.entries_elements[2][j], "top");
                                j++;
                            }
                        }
                        else if(i == 5){ //Bottom scroll extra small
                            let j = 0;
                            for(let bottom_scroll of scrolls){
                                this.assign_scroll_handler(this.scrolls_handlers[5], this.scroll_function_handlers, j, i, bottom_scroll, this.entries_elements[2][j], "bottom");
                                j++;
                            }
                        }
                        i++;
                    }

                    i = 0;

                    for(let button of this.add_period_show_btn_elements){
                        let type = "normal";
                        if(i == 2){
                            type = "small";
                        }
                        this.assign_period_show_btn_handler(this.add_period_show_btn_handlers, i, button, this.add_popup, this.mask, this.day_of_week_xs_view, this.add_day_of_week_selector, type);
                        i++;
                    }

                    i = 0;

                    for(let button of this.remove_period_show_btn_elements){
                        let type = "normal"
                        if( i == 2){
                            type = "small"; 
                        }
                        this.assign_period_show_btn_handler(this.remove_period_show_btn_handlers, i, button, this.remove_popup, this.mask, this.day_of_week_xs_view, this.remove_day_of_week_selector, type);
                        i++;
                    }

                    //CANCEL ADD HOUR PERIOD BUTTON
 
                    this.add_period_cancel_btn_handler = this.cancel_period_show_btn_function.bind(this, this.add_popup, this.mask);
                    this.add_period_cancel_btn_element.addEventListener("click", this.add_period_cancel_btn_handler);

                    //CANCEL REMOVE HOUR PERIOD BUTTON

                    this.remove_period_cancel_btn_handler = this.cancel_period_show_btn_function.bind(this, this.remove_popup, this.mask);
                    this.remove_period_cancel_btn_element.addEventListener("click", this.remove_period_cancel_btn_handler);

                    //MASK

                    this.mask_handler = this.mask_main_handler.bind(this);

                    this.document.getElementById(this.mask).addEventListener("click", this.mask_handler);

                    this.init_datetime_pickers(this.timepickers_class);


                    this.events_processed = true;
                }
            }
            else{
                if(this.events_processed){
                    let i = 0;
                    for(let scrolls of this.scrolls_elements){
                        if(i == 0){ //Left Scrolls
                            let j = 0;
                            for(let left_scroll of scrolls){
                                this.remove_scroll_handler(this.scrolls_handlers[0], j,  left_scroll);
                                j++;
                            }
                        }
                        else if(i == 1){ //Right Scrolls
                            let j = 0;
                            for(let right_scroll of scrolls){
                                this.remove_scroll_handler(this.scrolls_handlers[1], j,  right_scroll);
                                j++;
                            }
                        }
                        else if(i == 2){ //Top scrolls small
                            let j = 0;
                            for(let top_scroll of scrolls){
                                this.remove_scroll_handler(this.scrolls_handlers[2], j,  top_scroll);                                
                                j++;
                            }
                        }
                        else if(i == 3){ //Bottom scrolls small
                            let j = 0;
                            for(let bottom_scroll of scrolls){
                                this.remove_scroll_handler(this.scrolls_handlers[3], j,  bottom_scroll);
                                j++;
                            }
                        }
                        else if(i == 4){ //Top scroll extra small
                            let j = 0;
                            for(let top_scroll of scrolls){
                                this.remove_scroll_handler(this.scrolls_handlers[4], j,  top_scroll);
                                j++;
                            }
                        }
                        else if(i == 5){ //Bottom scroll extra small
                            let j = 0;
                            for(let bottom_scroll of scrolls){
                                this.remove_scroll_handler(this.scrolls_handlers[5], j,  bottom_scroll);
                                j++;
                            }
                        }
                        i++;
                    }


                    i = 0;

                    for(let button of this.add_period_show_btn_elements){
                        this.remove_period_show_btn_handler(this.add_period_show_btn_handlers, i, button);
                        i++;
                    }

                    i = 0;

                    for(let button of this.remove_period_show_btn_elements){
                        this.remove_period_show_btn_handler(this.remove_period_show_btn_handlers, i, button);
                        i++;
                    }

                    this.add_period_cancel_btn_element.removeEventListener("click", this.add_period_cancel_btn_handler);
                    this.add_period_cancel_btn_handler = null;

                    this.remove_period_cancel_btn_element.removeEventListener("click", this.remove_period_cancel_btn_handler);
                    this.remove_period_cancel_btn_handler = null;

                    this.document.getElementById(this.mask).removeEventListener("click", this.mask_handler);
                    this.mask_handler = null;

                    this.destroy_datetime_pickers();

                    //CLEAN EVENT LISTENERS
                    this.events_processed = false;
                }
            }
        }
    }

    //ASSIGN ADD/REMOVE PERIOD SHOW BUTTON HANDLER


    assign_period_show_btn_handler(handlers, handler_position ,button, popup, mask, day_of_week, day_of_week_selector, type){
        if(type == "normal"){
            if(handlers[handler_position] == null){
                handlers[handler_position] = this.period_show_btn_function.bind(this, popup, mask);
                button.addEventListener("click", handlers[handler_position]);
            }
        }
        else if(type == "small"){
            if(handlers[handler_position] == null){
                handlers[handler_position] = this.period_show_btn_small_function.bind(this, popup, mask, day_of_week, day_of_week_selector);
                button.addEventListener("click", handlers[handler_position]);
            }
        }
        else{
            console.log("error in assign add/remove period show button handler");
            return;
        }
    }

    remove_period_show_btn_handler(handlers, handler_position, button){
        if(handlers[handler_position] != null){
            button.removeEventListener("click", handlers[handler_position]);
            handlers[handler_position] = null;
        }
    }

    //ADD/REMOVE PERIOD SHOW BUTTON FUNCTIONS

    period_show_btn_function(popup, mask){
        if(this.document.getElementById(popup).style.display != "flex"){
            this.document.getElementById(popup).style.display = "flex";
            this.document.getElementById(mask).style.display = "block";
        }
    }

    period_show_btn_small_function(popup, mask, day_of_week, day_of_week_selector){
        let week_day = this.document.getElementById(day_of_week).selectedIndex;
        console.log(week_day);
        this.document.getElementById(day_of_week_selector).selectedIndex = week_day;
        if(this.document.getElementById(popup).style.display != "flex"){
            this.document.getElementById(popup).style.display = "flex";
            this.document.getElementById(mask).style.display = "block";
        }
    }

    //CANCEL ADD/REMOVE PERIOD FUNCTIONS

    cancel_period_show_btn_function(popup, mask){
        if(document.getElementById(popup).style.display == "flex"){
            document.getElementById(popup).style.display = "none";
            document.getElementById(mask).style.display = "none";
            this.clean_datetime_pickers();
        }
    }

    mask_main_handler(event){
        this.mask_period_function(event, this.add_popup, this.remove_popup, this.mask);
    }

    mask_period_function(event, add_popup, remove_popup, mask){
        if (!event.target.closest("#"+add_popup) && !event.target.closest("#"+remove_popup)){
            this.document.getElementById(add_popup).style.display = "none";
            this.document.getElementById(remove_popup).style.display = "none";
            this.document.getElementById(mask).style.display = "none";    
            this.clean_datetime_pickers();                     
        }
    }


    //INIT DATE TIME PICKERS

    init_datetime_pickers(timepickers_class){
        // Create new instances and store them in the array
        this.datetime_pickers = [];
        
        this.datetime_pickers = flatpickr("." + timepickers_class, {
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

    //DESTROY DATE TIME PICKERS

    destroy_datetime_pickers(){
        this.datetime_pickers.forEach(function (picker) {
            picker.destroy();
        });
    }

    //CLEAN DATE TIME PICKERS

    clean_datetime_pickers(){
        for(let datetime_picker in this.datetime_pickers){
            this.datetime_pickers[datetime_picker].setDate("");
        }
    
        this.document.getElementById(this.add_day_of_week_selector).selectedIndex = 0;
    
        this.document.getElementById(this.remove_day_of_week_selector).selectedIndex = 0;
    }


    //ASSIGN SCROLL HANDLER

    assign_scroll_handler(scroll_handler, scroll_function_handlers, handler_position, scroll_position, scroll_element, entrie_element, scroll_type){
        let scroll_speedup = null;
        let scroll_interval = 10;
        if(scroll_handler[handler_position] == null){
            scroll_handler[handler_position] = this.scroll_function.bind(this, entrie_element, scroll_function_handlers, scroll_position, handler_position, scroll_type, scroll_interval);
            scroll_element.addEventListener("click", scroll_handler[handler_position]);
        }
    }

    remove_scroll_handler(scroll_handler, handler_position, scroll_element){
        if(scroll_handler[handler_position] != null){
            scroll_element.removeEventListener("click", scroll_handler[handler_position]);
            scroll_handler[handler_position] = null;
        }
    }

    //SCROLL FUNCTION//

    scroll_function(entrie_element, scroll_function_handlers, scroll_position, handler_position, scroll_type, scroll_interval){
        if(scroll_type == "left"){
            let init_width = 0;
            if(scroll_function_handlers[scroll_position+1][handler_position][1] != null){
                clearInterval(scroll_function_handlers[scroll_position+1][handler_position][1]);
                scroll_function_handlers[scroll_position+1][handler_position][1] = null;
            }
            if(scroll_function_handlers[scroll_position][handler_position][0] == null){
                let offsetWidth = entrie_element.offsetWidth;
                let scrollWidth = entrie_element.scrollWidth;
                let seen_elements_width = 182;
                let width_to_scroll = ((Math.floor(offsetWidth / seen_elements_width))*seen_elements_width)-30;
                scroll_function_handlers[scroll_position][handler_position][0] = setInterval(function() {
                    if(scroll_function_handlers[scroll_position][handler_position][0] != null && scroll_function_handlers[scroll_position+1][handler_position][1] == null){
                        entrie_element.scrollLeft -= scroll_interval;
                        if(offsetWidth == scrollWidth || init_width >= width_to_scroll){
                            clearInterval(scroll_function_handlers[scroll_position][handler_position][0]);
                            scroll_function_handlers[scroll_position][handler_position][0] = null;
                        }
                        init_width += scroll_interval;
                    }
                }, 10);
            }
        }
        else if(scroll_type == "right"){
            let init_width = 0;
            if(scroll_function_handlers[scroll_position-1][handler_position][0] != null){
                clearInterval(scroll_function_handlers[scroll_position-1][handler_position][0]);
                scroll_function_handlers[scroll_position-1][handler_position][0] = null;
            }
            if(scroll_function_handlers[scroll_position][handler_position][1] == null){
                let offsetWidth = entrie_element.offsetWidth;
                let scrollWidth = entrie_element.scrollWidth;
                let seen_elements_width = 182;
                let width_to_scroll = ((Math.floor(offsetWidth / seen_elements_width))*seen_elements_width)-30;
                scroll_function_handlers[scroll_position][handler_position][1] = setInterval(function() {
                    if(scroll_function_handlers[scroll_position][handler_position][1] != null && scroll_function_handlers[scroll_position-1][handler_position][0] == null){
                        entrie_element.scrollLeft += scroll_interval;
                        if(offsetWidth == scrollWidth || init_width >= width_to_scroll){
                            clearInterval(scroll_function_handlers[scroll_position][handler_position][1]);
                            scroll_function_handlers[scroll_position][handler_position][1] = null;
                        }
                        init_width += scroll_interval;
                    }
                }, 10);
            }
        }
        else if(scroll_type == "top"){
            let init_height = 0;
            if(scroll_function_handlers[scroll_position+1][handler_position][1] != null){
                clearInterval(scroll_function_handlers[scroll_position+1][handler_position][1]);
                scroll_function_handlers[scroll_position+1][handler_position][1] = null;
            }
            if(scroll_function_handlers[scroll_position][handler_position][0] == null){
                let offsetHeight = entrie_element.offsetHeight;
                let scrollHeight = entrie_element.scrollHeight;
                let window_height = window.innerHeight;
                let seen_elements_height;
                if(window_height >= 992){
                    seen_elements_height = 58;
                }
                else{
                    seen_elements_height = 52;
                }
                let height_to_sroll = ((Math.floor(offsetHeight / seen_elements_height))*seen_elements_height)-30;
                scroll_function_handlers[scroll_position][handler_position][0] = setInterval(function() {
                    if(scroll_function_handlers[scroll_position][handler_position][0] != null && scroll_function_handlers[scroll_position+1][handler_position][1] == null){
                        entrie_element.scrollTop -= scroll_interval;
                        if(offsetHeight == scrollHeight || init_height >= height_to_sroll){
                            clearInterval(scroll_function_handlers[scroll_position][handler_position][0]);
                            scroll_function_handlers[scroll_position][handler_position][0] = null;
                        }
                        init_height += scroll_interval;
                    }
                }, 10);
            }
        }
        else if(scroll_type == "bottom"){
            let init_height = 0;
            if(scroll_function_handlers[scroll_position-1][handler_position][0] != null){
                clearInterval(scroll_function_handlers[scroll_position-1][handler_position][0]);
                scroll_function_handlers[scroll_position-1][handler_position][0] = null;
            }
            if(scroll_function_handlers[scroll_position][handler_position][1] == null){
                let offsetHeight = entrie_element.offsetHeight;
                let scrollHeight = entrie_element.scrollHeight;
                let window_height = window.innerHeight;
                let seen_elements_height;
                if(window_height >= 992){
                    seen_elements_height = 58;
                }
                else{
                    seen_elements_height = 52;
                }
                let height_to_sroll = ((Math.floor(offsetHeight / seen_elements_height))*seen_elements_height)-30;
                scroll_function_handlers[scroll_position][handler_position][1] = setInterval(function() {
                    if(scroll_function_handlers[scroll_position][handler_position][1] != null && scroll_function_handlers[scroll_position-1][handler_position][0] == null){
                        entrie_element.scrollTop += scroll_interval;
                        if(offsetHeight == scrollHeight || init_height >= height_to_sroll){
                            clearInterval(scroll_function_handlers[scroll_position][handler_position][1]);
                            scroll_function_handlers[scroll_position][handler_position][1] = null;
                        }
                        init_height += scroll_interval;
                    }
                }, 10);
            }
        }
        else{
            console.log("error in scroll function");
        }
    }

}

let hour_period_entries = ["table-horizontal-row-content", "table-vertical-col-content", "table-extra-small-content"];
let hour_period_scrolls = ["arrow-container-left", "arrow-container-right", "arrow-container-top", "arrow-container-bottom", "arrow-container-top-xs", "arrow-container-bottom-xs"];
let show_add_period_popup_btn = ["show_add_period_popup_btn", "show_add_period_popup_btn_s", "show_add_period_popup_btn_xs"];
let show_remove_period_popup_btn = ["show_remove_period_popup_btn", "show_remove_period_popup_btn_s", "show_remove_period_popup_btn_xs"];
let cancel_add_hour_period_btn = "cancel_add_hour_period_btn";
let cancel_remove_hour_period_btn = "cancel_remove_hour_period_btn";
let hour_period_mask = "hour_period_mask";
let hour_period_add_popup = "add_period_popup";
let hour_period_remove_popup = "remove_period_popup";
let day_of_week_selector_xs = "day_of_week_selector_xs";
let add_day_of_week_selector = "add_day_of_week_selector";
let remove_day_of_week_selector = "remove_day_of_week_selector";
let timepickers_class = "daily-time-period-picker";

let hour_period_display = new HourPeriodDisplay(document, hour_period_entries, hour_period_scrolls, show_add_period_popup_btn, show_remove_period_popup_btn, cancel_add_hour_period_btn, cancel_remove_hour_period_btn, hour_period_mask, hour_period_add_popup, hour_period_remove_popup, day_of_week_selector_xs, add_day_of_week_selector, remove_day_of_week_selector, timepickers_class, "config_content");



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