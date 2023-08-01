class ControlButton{
    constructor(document, name, element){
        this.document = document;
        this.name = name;
        this.state = false;
        this.element = element;
        this.feedback = false;
    }

    check_feedback_handler = () => {
        if(!this.feedback){
            clearInterval(this.check_feedback);
            clearTimeout(this.check_feedback_timeout);
        }
    }

    check_feedback_timeout_handler = () => {
        if(!this.feedback){
            clearInterval(this.check_feedback);
            clearTimeout(this.check_feedback_timeout);
        }
        else{
            //communication error
            clearInterval(this.check_feedback);
            clearTimeout(this.check_feedback_timeout);
            no_prio_errors.set_error("Erro de comunicação");
            this.feedback_done();
        }
    }

    set_control_on(){
        this.document.getElementById(this.name).style.backgroundColor = "rgb(255, 103, 103)";
        this.document.getElementById(this.name).style.borderColor = "rgb(255, 103, 103)";
        this.document.getElementById(this.name).value = "Desligar";
        this.state = true;
    }

    set_control_off(){
        this.document.getElementById(this.name).style.backgroundColor = "rgb(108, 117, 125)";
        this.document.getElementById(this.name).style.borderColor = "rgb(108, 117, 125)";
        this.document.getElementById(this.name).value = "Ligar";
        this.state = false;
    }

    invert_button(){
        if(active_device != null && !this.feedback){
            if(active_device.connected){
                if(manual_selector.state){
                    if(!this.feedback){
                        if(this.state){
                            this.set_control_off();
                        }
                        else{
                            this.set_control_on();
                        }
                        let message = active_device.name+";"+this.name+";"+String(this.state);
                        ws_client.send(message);
                        this.feedback = true;
                        this.check_feedback = setInterval(this.check_feedback_handler.bind(this), 10);
                        this.check_feedback_timeout = setTimeout(this.check_feedback_timeout_handler.bind(this), 3000);
                    }
                }
                else{
                    no_prio_errors.set_error("O seletor de permissão não está ativo.");
                }
            }
            else{
                no_prio_errors.set_error("O dispositivo "+ active_device.name +" não está conectado.");
            }
        }
    }

    feedback_done(){
        this.feedback = false;
    }

}

class ControlSelector{
    constructor(document, name, element){
        this.document = document;
        this.name = name;
        this.state = false;
        this.element = element;
        this.check_element = setInterval(this.check_element_handler.bind(this), 10);
        this.feedback = false;
        this.element_valid = false;
    }

    check_element_handler = () => {
        if(this.document.getElementById(this.name) != null){
            if(!this.element_valid){
                this.document.getElementById(this.name).addEventListener("click", () => {
                    if(!this.feedback){
                        this.invert_selector();
                    }
                    else{
                        if(this.state){
                            this.set_selector_on();
                        }
                        else{
                            this.set_selector_off();
                        }
                    }
                });
                this.element_valid = true;
            }
        }
        else{
            if(this.element_valid){
                this.element_valid = false;
            }
        }
    }


    check_feedback_handler = () => {
        if(!this.feedback){
            clearInterval(this.check_feedback);
            clearTimeout(this.check_feedback_timeout);
        }
    }

    check_feedback_timeout_handler = () => {
        if(!this.feedback){
            clearInterval(this.check_feedback);
            clearTimeout(this.check_feedback_timeout);
        }
        else{
            //communication error
            clearInterval(this.check_feedback);
            clearTimeout(this.check_feedback_timeout);
            no_prio_errors.set_error("Erro de comunicação");
            this.feedback_done();
        }
    }


    invert_selector(){
        if(this.element_valid){
            if(active_device != null && !this.feedback){
                if(active_device.connected){
                    if(!this.state){
                        this.set_selector_on();
                        let message = active_device.name+";"+this.name+";"+String(this.state);
                        ws_client.send(message);
                        this.feedback = true;
                        this.check_feedback = setInterval(this.check_feedback_handler.bind(this), 10);
                        this.check_feedback_timeout = setTimeout(this.check_feedback_timeout_handler.bind(this), 3000);
                    }
                    else if(this.state){
                        this.set_selector_off();
                        let message = active_device.name+";"+this.name+";"+String(this.state);
                        ws_client.send(message);
                        this.feedback = true;
                        this.check_feedback = setInterval(this.check_feedback_handler.bind(this), 10);
                        this.check_feedback_timeout = setTimeout(this.check_feedback_timeout_handler.bind(this), 3000);
                    }
                }
                else{
                    console.log("not connected");
                    no_prio_errors.set_error("O dispositivo "+ active_device.name +" não está conectado.");
                    this.set_selector_off();
                }
            }
        }
    }

    set_selector_on(){
        this.state = true;
        this.document.getElementById(this.name).checked = true;
    }

    set_selector_off(){
        this.state = false;
        this.document.getElementById(this.name).checked = false;
    }

    set_element(){
        this.element = this.document.getElementById(this.name);
    }

    feedback_done(){
        this.feedback = false;
    }
}

class VerticalSlider{
    constructor(document, window, menu_name,button_name, submenu_name, left_arrow_name, right_arrow_name, section_subcontent){
        this.document = document;
        this.window = window;
        this.menu_name = menu_name;
        this.button_name = button_name;
        this.submenu_name = submenu_name;
        this.left_arrow_name = left_arrow_name;
        this.right_arrow_name = right_arrow_name;
        this.section_subcontent = section_subcontent;
        this.check_element = setInterval(this.check_element_handler.bind(this), 10);
        this.check_window = setInterval(this.check_window_handler.bind(this), 10);
        this.check_subcontent = setInterval(this.check_subcontent_handler.bind(this), 10);
        this.button_valid = false;
        this.submenu_state = true;
        this.last_submenu_state = null;
        this.initial_validation = false;
    }

    invert_slider(){
        if(this.document.getElementById(this.submenu_name) != null){
            if(this.submenu_state){
                this.close_slider();
                this.submenu_state = false;
            }
            else{
                this.open_slider();
                this.submenu_state = true;
            }
        }
    }

    close_slider(){
        this.document.getElementById(this.left_arrow_name).style.display = "none";
        this.document.getElementById(this.right_arrow_name).style.display = "block";
        this.document.getElementById(this.submenu_name).style.display = "none";
    }

    open_slider(){
        this.document.getElementById(this.left_arrow_name).style.display = "block";
        this.document.getElementById(this.right_arrow_name).style.display = "none";
        this.document.getElementById(this.submenu_name).style.display = "flex";
    }

    check_window_handler = () => {
        if(this.button_valid){
            let window_width = this.window.innerWidth;
            if(window_width >= 992){
                if(this.last_submenu_state != null || !this.initial_validation){
                    this.document.getElementById(this.menu_name).style.display = "flex";
                    if(this.last_submenu_state != null){
                        if(this.last_submenu_state){
                            this.open_slider();
                            this.submenu_state = true;
                        }
                        else{
                            this.close_slider();
                            this.submenu_state = false;
                        }
                   
                    }
                    else{
                        if(this.submenu_state){
                            this.open_slider();
                        }
                        else{
                            this.close_slider();
                        }
                    }
                    this.last_submenu_state = null;
                    this.initial_validation = true;
                }
            }
            else{
                if(this.last_submenu_state == null || !this.initial_validation){
                    this.last_submenu_state = this.submenu_state;
                    this.document.getElementById(this.menu_name).style.display = "none";
                    this.initial_validation = true;
                }
            }
        }
    }

    check_element_handler = () => {
        if(this.document.getElementById(this.button_name) != null){
            if(!this.button_valid){
                this.document.getElementById(this.button_name).addEventListener("click", () => {
                    this.invert_slider();
                });
                this.button_valid = true;
            }
        }
        else{
            if(this.button_valid){
                this.button_valid = false;
                this.initial_validation = false;
            }
        }
    }
    
    check_subcontent_handler = () => {
        if(this.button_valid){
            let viewport_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            let subcontent_height = this.document.getElementById(this.section_subcontent).offsetHeight;
            let style_height;
            let viewport_calc_height;
            let subcontent_calc_height;
            if(viewport_height >= 992){
                viewport_calc_height = viewport_height - (5.1*16) - (7.1*16);
                subcontent_calc_height = subcontent_height + (5.1*16);
            }
            else{
                viewport_calc_height = viewport_height - (5.1*14) - (7.1*14);
                subcontent_calc_height = subcontent_height + (5.1*14);

            }
            if(viewport_calc_height > subcontent_calc_height){
                style_height = "calc("+ String(viewport_height)+"px - 5.1rem - 7.1rem)";
            }
            else{
                style_height = "calc("+ String(subcontent_height)+"px + 5.1rem)";
            }
            if(this.document.getElementById(this.menu_name).style.height != style_height){
                this.document.getElementById(this.menu_name).style.height = style_height;
            }
        }
    }
}

class HorizontalSlider{
    constructor(document, window, menu_name,button_name, submenu_name, down_arrow_name, up_arrow_name){
        this.document = document;
        this.window = window;
        this.menu_name = menu_name;
        this.button_name = button_name;
        this.submenu_name = submenu_name;
        this.down_arrow_name = down_arrow_name;
        this.up_arrow_name = up_arrow_name;
        this.check_element = setInterval(this.check_element_handler.bind(this), 10);
        this.check_window = setInterval(this.check_window_handler.bind(this), 10);
        this.button_valid = false;
        this.submenu_state = false;
        this.last_submenu_state = null;
        this.initial_validation = false;
    }

    invert_slider(){
        if(this.document.getElementById(this.submenu_name) != null){
            if(this.submenu_state){
                this.close_slider();
                this.submenu_state = false;
            }
            else{
                this.open_slider();
                this.submenu_state = true;
            }
        }
    }

    close_slider(){
        this.document.getElementById(this.down_arrow_name).style.display = "none";
        this.document.getElementById(this.button_name).style.bottom = "3.1rem";
        this.document.getElementById(this.up_arrow_name).style.display = "block";
        this.document.getElementById(this.submenu_name).style.display = "none";
    }

    open_slider(){
        this.document.getElementById(this.down_arrow_name).style.display = "block";
        this.document.getElementById(this.button_name).style.bottom = "7.1rem";
        this.document.getElementById(this.up_arrow_name).style.display = "none";
        this.document.getElementById(this.submenu_name).style.display = "flex";
    }

    check_window_handler = () => {
        if(this.button_valid){
            let window_width = this.window.innerWidth;
            if(window_width >= 992){
                if(this.last_submenu_state == null || !this.initial_validation){
                    this.last_submenu_state = this.submenu_state;
                    this.document.getElementById(this.menu_name).style.display = "none";
                    this.document.getElementById(this.button_name).style.display = "none";
                    this.initial_validation = true;
                }
            }
            else{
                if(this.last_submenu_state != null || !this.initial_validation){
                    this.document.getElementById(this.menu_name).style.display = "flex";
                    this.document.getElementById(this.button_name).style.display = "flex";
                    if(this.last_submenu_state != null){
                        if(this.last_submenu_state){
                            this.open_slider();
                            this.submenu_state = true;
                        }
                        else{
                            this.close_slider();
                            this.submenu_state = false;
                        }
                   
                    }
                    else{
                        if(this.submenu_state){
                            this.open_slider();
                        }
                        else{
                            this.close_slider();
                        }
                    }
                    this.last_submenu_state = null;
                    this.initial_validation = true;
                }
            }
        }
    }

    check_element_handler = () => {
        if(this.document.getElementById(this.button_name) != null){
            if(!this.button_valid){
                this.document.getElementById(this.button_name).addEventListener("click", () => {
                    this.invert_slider();
                });
                this.button_valid = true;
            }
        }
        else{
            if(this.button_valid){
                this.button_valid = false;
                this.initial_validation = false;
            }
        }
    }
}


let manual_control = new ControlButton(document, "manual_button", document.getElementById("manual_button"));
let manual_selector = new ControlSelector(document, "manual_selector", document.getElementById("manual_selector"));
let vertical_slider = new VerticalSlider(document, window, "vertical_config_submenu","vertical_config_slider", "vertical_config_submenu_buttons", "config_slider_left_arrow", "config_slider_right_arrow", "config-subcontent-div");
let horizontal_slider = new HorizontalSlider(document, window, "horizontal_config_submenu", "horizontal_config_slider", "horizontal_config_submenu", "config_slider_down_arrow", "config_slider_up_arrow");

function outputManualInvert(){
    manual_control.invert_button();
}


////////////////////////////////HOUR PERIOD DISPLAY MANAGEMENT///////////////////////////////

const config_section_display_checker = setInterval(config_section_display_checker_handler, 10);

let config_section_display_valid = false;

function config_section_display_checker_handler(){
    let show_add_period_popup_btn = document.getElementById("show_add_period_popup_btn");
    if(show_add_period_popup_btn != null){
        let show_remove_period_popup_btn = document.getElementById("show_remove_period_popup_btn");
        let cancel_add_hour_period_btn = document.getElementById("cancel_add_hour_period_btn");
        let cancel_remove_hour_period_btn = document.getElementById("cancel_remove_hour_period_btn");
        let hour_period_mask = document.getElementById("hour_period_mask");
        if(!config_section_display_valid){
            hour_period_mask.addEventListener("click", (event) => {
                if (!event.target.closest("#add_period_popup")){
                    document.getElementById("add_period_popup").style.display = "none";
                    document.getElementById("remove_period_popup").style.display = "none";
                    document.getElementById("hour_period_mask").style.display = "none";                            
                }
            });
            show_add_period_popup_btn.addEventListener('click', function() {
                if(document.getElementById("add_period_popup").style.display != "flex"){
                    document.getElementById("add_period_popup").style.display = "flex";
                    document.getElementById("hour_period_mask").style.display = "block";
                }
            });
            
            cancel_add_hour_period_btn.addEventListener('click', function() {
                if(document.getElementById("add_period_popup").style.display == "flex"){
                    document.getElementById("add_period_popup").style.display = "none";
                    document.getElementById("hour_period_mask").style.display = "none";
                }
            });
            
            show_remove_period_popup_btn.addEventListener('click', function() {
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
            flatpickr(".daily-time-period-picker", {
                enableTime: true,
                time_24hr: true,
                altInput: true,
                noCalendar: true,
                altFormat: "H:i:S",
                dateFormat: "H:i:S",
                enableSeconds: true
            });
            config_section_display_valid = true;
        }
    }
    else{
        config_section_display_valid = false;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////


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

//ADD HOUR PERIOD FUNCTION
function addHourPeriod(){
    let initial_period_time = document.getElementById("add_initial_hour_period").value;

    let final_period_time = document.getElementById("add_final_hour_period").value;

    let limit_active_energy = Number(document.getElementById("hour_period_active_energy_limit").value);
    let limit_active_energy_unit = document.getElementById("active_power_unit_options_selector").value;

    let limit_reactive_energy = Number(document.getElementById("hour_period_reactive_energy_limit").value);
    let limit_reactive_energy_unit = document.getElementById("reactive_power_unit_options_selector").value;

    let limit_active_energy_enabled = document.getElementById("add_hour_period_active_energy_limit_enabled").checked;
    let limit_reactive_energy_enabled = document.getElementById("add_hour_period_reactive_energy_limit_enabled").checked;


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
        config_temporary_warnings.create_temporary_warning("danger", "config", "AVISO!!");
        return;   
    }

    let check_valid_active_energy = checkValidEnergyLimit(limit_active_energy, limit_active_energy_enabled);
    let check_valid_reactive_energy = checkValidEnergyLimit(limit_reactive_energy, limit_reactive_energy_enabled);
    if(!check_valid_active_energy || !check_valid_reactive_energy){
        //Alert message
        return;
    }
    else if(!check_valid_active_energy){
        //Alert message
        return;
    }
    else if(!check_valid_reactive_energy){
        //Alert message
        return;
    }

    let message = active_device.name+";"+"add_hour_period"+";"+"initial_hour_period:"+initial_period_time+","+"final_hour_period:"+final_period_time+",";
    message += "active_energy_limit:"+limit_active_energy+","+"reactive_energy_limit:"+limit_reactive_energy+","+"limit_active_energy_unit:"+limit_active_energy_unit+","+"limit_reactive_energy_unit:"+limit_reactive_energy_unit+",";
    message += "active_energy_limit_enabled:"+limit_active_energy_enabled+","+"reactive_energy_limit_enabled:"+limit_reactive_energy_enabled;


    ws_client.send(message);
}


//REMOVE HOUR PERIOD FUNCTION
function removeHourPeriod(){
    let initial_hour_period = document.getElementById("");
}