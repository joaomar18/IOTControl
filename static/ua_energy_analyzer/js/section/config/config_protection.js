/*************************** PROTECTION DISPLAY MANAGEMENT ***************************/

class ProtectionDisplay{
    constructor(document , activated, text_values , bar_values, bar_containers, adjust_select, initial_values,
                limits_max, limits_min, limits_unit, update_btn, cancel_btn){
        this.document = document;
        this.activated = activated;

        this.text_values = text_values;
        this.text_value_elements = [];
        this.check_valid_text_values = setInterval(this.check_valid_text_values_handler.bind(this), 10);
        this.text_values_valid = false;

        this.bar_values = bar_values;
        this.bar_value_elements = [];
        this.check_valid_bar_values = setInterval(this.check_valid_bar_values_handler.bind(this), 10);
        this.bar_values_valid = false;

        this.bar_containers = bar_containers;
        this.bar_container_elements = [];
        this.check_valid_bar_containers = setInterval(this.check_valid_bar_containers_handler.bind(this), 10);
        this.bar_containers_valid = false;

        this.adjust_select = adjust_select;
        this.adjust_select_element = null;
        this.check_valid_adjust_select = setInterval(this.check_valid_adjust_select_handler.bind(this), 10);
        this.adjust_select_valid = false;
        this.adjust_select_last_index = null;


        this.new_bar_markers = [];
        this.current_bar_markers = [];
        this.new_bar_markers_text = [];
        this.current_bar_markers_text = [];
        this.bar_markers_init = false;


        this.check_valid_elements = setInterval(this.check_valid_elements_handler.bind(this), 10);

        this.run = null;

        this.initial_values = initial_values;

        this.limits_max = limits_max;
        this.limits_min = limits_min;
        this.limits_unit = limits_unit;


        this.update_btn = update_btn;
        this.update_btn_element = null;
        this.check_valid_update_btn = setInterval(this.check_valid_update_btn_handler.bind(this), 10);
        this.update_btn_valid = false;


        this.cancel_btn = cancel_btn;
        this.cancel_btn_element = null;
        this.check_valid_cancel_btn = setInterval(this.check_valid_cancel_btn_handler.bind(this), 10);
        this.cancel_btn_valid = false;
        

        this.elements_ready = [false, false, false, false, false, false];

        this.last_limit_value = [null, null, null];
        this.current_limit_value = [null, null, null];

        this.first_run = true;

        this.changes_available = false;
    }

    check_valid_text_values_handler = () => {
        if(!this.text_values_valid){
            this.text_values_valid = true;
            for(let text_value of this.text_values){
                let text_value_element = this.document.getElementById(text_value);
                if(!text_value_element){
                    this.text_values_valid = false;
                    break;
                }
            }
        }
        else{
            for(let text_value of this.text_values){
                let text_value_element = this.document.getElementById(text_value);
                this.text_value_elements.push(text_value_element);
            }
            clearInterval(this.check_valid_text_values);
            this.elements_ready[0] = true;
            this.check_valid_text_values = null;
        }
    }

    check_valid_bar_values_handler = () => {
        if(!this.bar_values_valid){
            this.bar_values_valid = true;
            for(let bar_value of this.bar_values){
                let bar_value_element = this.document.getElementById(bar_value);
                if(!bar_value_element){
                    this.bar_values_valid = false;
                    break;
                }
            }
        }
        else{
            for(let bar_value of this.bar_values){
                let bar_value_element = this.document.getElementById(bar_value);
                this.bar_value_elements.push(bar_value_element);
            }
            clearInterval(this.check_valid_bar_values);
            this.elements_ready[1] = true;
            this.check_valid_bar_values = null;
        }        
    }


    check_valid_bar_containers_handler = () => {
        if(!this.bar_containers_valid){
            this.bar_containers_valid = true;
            for(let bar_container of this.bar_containers){
                let bar_container_element = this.document.getElementById(bar_container);
                if(!bar_container_element){
                    this.bar_containers_valid = false;
                    break;
                }
            }
        }
        else{
            for(let bar_container of this.bar_containers){
                let bar_container_element = this.document.getElementById(bar_container);
                this.bar_container_elements.push(bar_container_element);
            }
            clearInterval(this.check_valid_bar_containers);
            this.elements_ready[2] = true;
            this.check_valid_bar_containers = null;
        }        
    }

    check_valid_adjust_select_handler = () => {
        if(!this.adjust_select_valid){
            if(this.document.getElementById(this.adjust_select) != null){
                this.adjust_select_element = this.document.getElementById(this.adjust_select);
                this.adjust_select_valid = true;
                clearInterval(this.check_valid_adjust_select);
                this.elements_ready[3] = true;
                this.check_valid_adjust_select = null;
            }
        }   
    }

    check_valid_update_btn_handler = () => {
        if(!this.update_btn_valid){
            if(this.document.getElementById(this.update_btn) != null){
                this.update_btn_element = this.document.getElementById(this.update_btn);
                this.update_btn_valid = true;
                clearInterval(this.check_valid_update_btn);
                this.elements_ready[4] = true;
                this.check_valid_update_btn = null;
            }
        }   
    }

    check_valid_cancel_btn_handler = () => {
        if(!this.cancel_btn_valid){
            if(this.document.getElementById(this.cancel_btn) != null){
                this.cancel_btn_element = this.document.getElementById(this.cancel_btn);
                this.cancel_btn_valid = true;
                clearInterval(this.check_valid_cancel_btn);
                this.elements_ready[5] = true;
                this.check_valid_cancel_btn = null;
            }
        }   
    }

    check_valid_elements_handler = () => {
        if(this.check_valid_elements){
            let elements_valid = true;
            for(let ready of this.elements_ready){
                if(!ready){
                    elements_valid = false;
                }
            }
            if(elements_valid){
                clearInterval(this.check_valid_elements);
                this.check_valid_elements = null;
                this.run = setInterval(this.run_handler.bind(this), 10);
            }
        }
    }

    run_handler = () => {
        if(!this.bar_markers_init){
            for(let bar_container of this.bar_container_elements){

                let new_bar_marker = this.document.createElement("div");
                new_bar_marker.className = "protection-bar-marker protection-new-bar-marker";
                let new_bar_marker_content = this.document.createElement("div");
                new_bar_marker_content.className = "protection-bar-marker-content";
                let new_bar_marker_text = this.document.createElement("span");
                new_bar_marker_text.className = "protection-bar-marker-text protection-new-bar-marker-text";
                let new_bar_marker_line = this.document.createElement("div");
                new_bar_marker_line.className = "protection-bar-marker-line protection-new-bar-marker-line";
                new_bar_marker_content.appendChild(new_bar_marker_text);
                new_bar_marker_content.appendChild(new_bar_marker_line);
                new_bar_marker.appendChild(new_bar_marker_content);


                let current_bar_marker = this.document.createElement("div");
                current_bar_marker.className = "protection-bar-marker protection-current-bar-marker";
                let current_bar_marker_content = this.document.createElement("div");
                current_bar_marker_content.className = "protection-bar-marker-content";
                let current_bar_marker_text = this.document.createElement("span");
                current_bar_marker_text.className = "protection-bar-marker-text protection-current-bar-marker-text";
                let current_bar_marker_line = this.document.createElement("div");
                current_bar_marker_line.className = "protection-bar-marker-line protection-current-bar-marker-line";
                current_bar_marker_content.appendChild(current_bar_marker_text);
                current_bar_marker_content.appendChild(current_bar_marker_line);
                current_bar_marker.appendChild(current_bar_marker_content);


                bar_container.appendChild(current_bar_marker);
                bar_container.appendChild(new_bar_marker);

                this.new_bar_markers.push(new_bar_marker);
                this.current_bar_markers.push(current_bar_marker);
                this.new_bar_markers_text.push(new_bar_marker_text);
                this.current_bar_markers_text.push(current_bar_marker_text);

            }

            this.bar_markers_init = true;
        
        }

        if(!this.document.getElementById(this.activated).hidden){
            if(this.first_run){
                this.cancel_btn_listener = this.cancel_btn_handler.bind(this);
                this.cancel_btn_element.addEventListener("click", this.cancel_btn_listener);
                this.first_run = false;
            }
            this.init(false);
            this.process();
        }
        else{
            if(!this.first_run){
                this.cancel_btn_element.removeEventListener("click", this.cancel_btn_listener);
                this.init(true);
                this.update_changes();
                this.cancel_btn_listener = null;
                this.first_run = true;
            }
        }

    }



    cancel_btn_handler(){
        if(this.changes_available){
            for(let i = 0; i < this.bar_value_elements.length; i++){
                this.set_new_bar(i, this.adjust_select_last_index, this.current_limit_value[i]);
            }
        }
    }

    init(force){

        let adjust_select_index = this.adjust_select_element.selectedIndex;

        if(adjust_select_index != this.adjust_select_last_index || force){
            let i = 0;
            for(let bar of this.bar_value_elements){
                bar.value = this.value_to_percentage(this.initial_values[i][adjust_select_index], this.limits_max[i][adjust_select_index], this.limits_min[i][adjust_select_index]); 
                this.update_current_bar(i, adjust_select_index);
                this.update_new_bar(i, adjust_select_index, true);
                i++; 
            }
            this.adjust_select_last_index = adjust_select_index;
        }

    }

    process(){
        this.update_new_bar(0, this.adjust_select_last_index, false);
        this.update_new_bar(1, this.adjust_select_last_index, false);
        this.update_new_bar(2, this.adjust_select_last_index, false);
        this.update_changes();
    }
    
    
    percentage_to_value(value, max, min){
        let range = max - min;
        return ((value/100)*range)+min;
    }

    value_to_percentage(value, max, min){
        let value_out = (((value - min) * (100)) / (max - min)).toFixed(0);
        return value_out;
    }

    update_new_bar(number, index, force){
        let limit_value = Number(this.bar_value_elements[number].value);

        if(this.last_limit_value[number] != limit_value || force){
            this.new_bar_markers[number].style.left = "calc( " + String(limit_value)+"% " + "- 2.25rem )";
            let value = this.percentage_to_value(limit_value, this.limits_max[number][index], this.limits_min[number][index]);
            this.new_bar_markers_text[number].innerText = value.toFixed(2) + " " + this.limits_unit[number][index];
            this.last_limit_value[number] = limit_value;
        }
    }

    set_new_bar(number,index,value_in){
        this.bar_value_elements[number].value = value_in.toFixed(0);
        this.new_bar_markers[number].style.left = "calc( " + String(value_in)+"% " + "- 2.25rem )";
        let value = this.percentage_to_value(value_in, this.limits_max[number][index], this.limits_min[number][index]);
        this.new_bar_markers_text[number].innerText = value.toFixed(2) + " " + this.limits_unit[number][index];
    }

    update_current_bar(number, index){
        this.current_limit_value[number] = Number(this.bar_value_elements[number].value);
        this.current_bar_markers[number].style.left = "calc( " + String(this.current_limit_value[number])+"% " + "- 2.25rem )";
        let value = this.percentage_to_value(this.current_limit_value[number], this.limits_max[number][index], this.limits_min[number][index]);
        this.current_bar_markers_text[number].innerText = value.toFixed(2) + " " + this.limits_unit[number][index];
    }

    update_changes(){
        this.changes_available = false;
        for(let i = 0; i < this.new_bar_markers_text.length; i++){
            if(this.new_bar_markers_text[i].innerText != this.current_bar_markers_text[i].innerText){
                this.changes_available = true;
            }
        }
        if(this.changes_available){
            if(!this.update_btn_element.classList.contains("btn-primary")){
                this.update_btn_element.classList.add("btn-primary");
                this.update_btn_element.classList.remove("btn-light");

                this.cancel_btn_element.classList.add("btn-warning");
                this.cancel_btn_element.classList.remove("btn-secondary");
            }
        }
        else{
            if(this.update_btn_element.classList.contains("btn-primary")){
                this.update_btn_element.classList.remove("btn-primary");
                this.update_btn_element.classList.add("btn-light");

                this.cancel_btn_element.classList.remove("btn-warning");
                this.cancel_btn_element.classList.add("btn-secondary");
            }
        }
    }

}

let voltage_text_values = [];
let voltage_bar_values = ["voltage_protection_upper_limit_bar", "voltage_protection_lower_limit_bar", "voltage_protection_trigger_time_bar"];
let voltage_bar_containers = ["voltage_protection_upper_limit_container", "voltage_protection_lower_limit_container", "voltage_protection_trigger_container"];
let voltage_adjust_select = "voltage_protection_adjust_select";
let voltage_initial_upper_limits = [250, 260, 280];
let voltage_initial_lower_limits = [215, 225, 235];
let voltage_initial_triggers = [10, 5, 3];

let voltage_initial_values = [voltage_initial_upper_limits, voltage_initial_lower_limits, voltage_initial_triggers];

let voltage_initial_upper_limits_max = [270, 280, 300];
let voltage_initial_upper_limits_min = [230, 240, 260];

let voltage_initial_upper_limits_unit = ["V", "V", "V"];

let voltage_initial_lower_limits_max = [230, 240, 250];
let voltage_initial_lower_limits_min = [200, 210, 220];

let voltage_initial_lower_limits_unit = ["V", "V", "V"];

let voltage_initial_triggers_max = [12, 7, 5];
let voltage_initial_triggers_min = [8, 3, 1];

let voltage_initial_triggers_unit = ["s", "s", "s"];

let voltage_limits_max = [voltage_initial_upper_limits_max, voltage_initial_lower_limits_max, voltage_initial_triggers_max];
let voltage_limits_min = [voltage_initial_upper_limits_min, voltage_initial_lower_limits_min, voltage_initial_triggers_min];

let voltage_limits_unit = [voltage_initial_upper_limits_unit, voltage_initial_lower_limits_unit, voltage_initial_triggers_unit]; 

let voltage_protection_update_btn =  "update_voltage_protection_btn";
let voltage_protection_cancel_btn = "cancel_update_voltage_protection_btn";

let sub_screen_element = "protecao_limitacao_content";


let voltage_protection_display = new ProtectionDisplay(document, sub_screen_element, voltage_text_values, voltage_bar_values, voltage_bar_containers, 
                                                       voltage_adjust_select, voltage_initial_values,
                                                       voltage_limits_max, voltage_limits_min, voltage_limits_unit,
                                                       voltage_protection_update_btn, voltage_protection_cancel_btn);
                                                       
