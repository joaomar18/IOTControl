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
                    config_temporary_alerts.create_temporary_warning("info", "config", "O seletor de permissão não está ativo.");
                }
            }
            else{
                config_temporary_alerts.create_temporary_warning("warning", "config", "O dispositivo "+ active_device.name +" não está conectado.");
            }
        }
    }

    feedback_done(){
        this.feedback = false;
    }
}

class ControlSelector{
    constructor(document, name, element, section){
        this.document = document;
        this.name = name;
        this.state = false;
        this.element = element;
        this.section = section
        this.check_element = setInterval(this.check_element_handler.bind(this), 10);
        this.feedback = false;
        this.element_valid = false;
        this.selector_action_handler = null;
    }

    selector_action(){
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
    }

    check_element_handler = () => {
        if(this.document.getElementById(this.name) != null){
            if(!this.document.getElementById(this.section).hidden){
                if(!this.element_valid){
                    if(this.selector_action_handler == null){
                        this.selector_action_handler = this.selector_action.bind(this);
                        this.document.getElementById(this.name).addEventListener("click", this.selector_action_handler);
                    }
                    this.element_valid = true;
                }
            }
            else{
                if(this.element_valid){
                    if(this.selector_action_handler != null){
                        this.document.getElementById(this.name).removeEventListener("click", this.selector_action_handler);
                        this.selector_action_handler = null;
                    }
                    this.element_valid = false;
                }
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