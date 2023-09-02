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
            //no_prio_errors.set_error("Erro de comunicação");
            config_temporary_alerts.create_temporary_warning("danger", "config", "Erro de comunicação");
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
                    //no_prio_errors.set_error("O seletor de permissão não está ativo.");
                    config_temporary_alerts.create_temporary_warning("info", "config", "O seletor de permissão não está ativo.");
                }
            }
            else{
                //no_prio_errors.set_error("O dispositivo "+ active_device.name +" não está conectado.");
                config_temporary_alerts.create_temporary_warning("warning", "config", "O dispositivo "+ active_device.name +" não está conectado.");
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
            config_temporary_alerts.create_temporary_warning("danger", "config", "Erro de comunicação");
            //no_prio_errors.set_error("Erro de comunicação");
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
                    //no_prio_errors.set_error("O dispositivo "+ active_device.name +" não está conectado.");
                    config_temporary_alerts.create_temporary_warning("warning", "config", "O dispositivo "+ active_device.name +" não está conectado.");
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
    constructor(document, window, main_container, menu_name,button_name, submenu_name, down_arrow_name, up_arrow_name){
        this.document = document;
        this.window = window;
        this.main_container = main_container;
        this.menu_name = menu_name;
        this.button_name = button_name;
        this.submenu_name = submenu_name;
        this.down_arrow_name = down_arrow_name;
        this.up_arrow_name = up_arrow_name;
        this.check_element = setInterval(this.check_element_handler.bind(this), 10);
        this.check_window = setInterval(this.check_window_handler.bind(this), 10);
        this.update_height = null;
        this.last_height = null;
        this.button_valid = false;
        this.submenu_state = false;
        this.last_submenu_state = null;
        this.initial_validation = false;
        this.margin_bottom_reset = false;
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
        this.document.getElementById(this.submenu_name).style.display = "flex";
        if(this.update_height == null){
            this.update_height = setInterval(this.update_height_handler.bind(this), 10);
        }
        this.document.getElementById(this.up_arrow_name).style.display = "none";

    }

    update_height_handler = () => {
        if(this.document.getElementById(this.submenu_name) != null){
            if(this.document.getElementById(this.submenu_name).style.display != 'none'){
                let height = this.document.getElementById(this.submenu_name).offsetHeight;
                if (height != this.last_height){
                    this.document.getElementById(this.main_container).style.marginBottom = "calc( 7.1rem + " + String(height) + "px )";
                    this.document.getElementById(this.button_name).style.bottom = "calc( " + String(height) + "px + 3.1rem )" ;
                    this.last_height = height;
                }
            }
            else{
                if(this.update_height != null){
                    clearInterval(this.update_height);
                    this.document.getElementById(this.main_container).style.marginBottom = " 7.1rem ";
                    this.update_height = null;
                    this.last_height = null;
                }
            }
        }  
        else{
            if(this.update_height != null){
                clearInterval(this.update_height);
                this.update_height = null;
                this.last_height = null;
            }
        }

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
                if(this.margin_bottom_reset && this.update_height == null){
                    this.document.getElementById(this.main_container).style.marginBottom = " 0rem ";
                    this.margin_bottom_reset = false;
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
                if(!this.margin_bottom_reset){
                    this.margin_bottom_reset = true;
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

class SubScreen{
    constructor(document, screen_title, controls, controls_small, sub_screen_names, sub_screen_containers, initial_sub_screen){
        this.document = document;
        this.screen_title = screen_title;
        this.controls = controls;
        this.controls_small = controls_small;
        this.sub_screen_names = sub_screen_names;
        this.sub_screen_containers = sub_screen_containers;
        this.initial_sub_screen = initial_sub_screen;
        this.sub_screen_number = null;
        this.check_sub_screen = setInterval(this.check_sub_screen_handler.bind(this), 10);
    }

    check_sub_screen_handler = () => {
        if(this.document.getElementById(this.screen_title) != null){
            if(this.sub_screen_number == null){
                this.changeSubScreen(this.initial_sub_screen);

            }
        }
        else{
            if(this.sub_screen_number != null){
                this.sub_screen_number = null;
            }
        }
    }

    changeSubScreen(screen_number){
        let valid_section = this.screen_title != null;
        if(valid_section && this.sub_screen_number != screen_number){
            this.document.getElementById(this.screen_title).innerText = this.sub_screen_names[screen_number];

            let controls_elements = this.document.getElementsByClassName(this.controls);
            let controls_elements_small = this.document.getElementsByClassName(this.controls_small);

            let controls_elements_array = Array.from(controls_elements);
            let controls_elements_small_array = Array.from(controls_elements_small);

            for (let control_element of controls_elements_array){
                control_element.style.fontWeight = "400";
            }

            for (let control_element of controls_elements_small_array){
                control_element.style.fontWeight = "400";
            }

            let container_elements = [];

            for(let sub_screen_container of this.sub_screen_containers){
                container_elements.push(this.document.getElementById(sub_screen_container));
            }

            for(let container_element of container_elements){
                if(container_element.style.display != 'none'){
                    container_element.style.display = "none";
                }
            }
            controls_elements_array[screen_number].style.fontWeight = "600";
            controls_elements_small_array[screen_number].style.fontWeight = "600";
            container_elements[screen_number].style.display = 'flex';
            this.sub_screen_number = screen_number;
        }
    }
}