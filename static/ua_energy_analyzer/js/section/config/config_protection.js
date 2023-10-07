/*************************** PROTECTION DISPLAY MANAGEMENT ***************************/

class ProtectionDisplay{
    constructor(document ,text_values ,bar_values, bar_containers, adjust_select, initial_values,
                limits_max, limits_min, limits_max_unit, limits_min_unit){
        this.document = document;

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
        this.limits_max_unit = limits_max_unit;
        this.limits_min_unit = limits_min_unit;

        this.elements_ready = [false, false, false, false];

        this.last_upper_limit_value = null;
        this.last_lower_limit_value = null;
        this.last_trigger_time_value = null;
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
                new_bar_marker_text.className = "protection-bar-marker-text";
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
                current_bar_marker_text.className = "protection-bar-marker-text";
                let current_bar_marker_line = this.document.createElement("div");
                current_bar_marker_line.className = "protection-bar-marker-line protection-current-bar-marker-line";
                current_bar_marker_content.appendChild(current_bar_marker_text);
                current_bar_marker_content.appendChild(current_bar_marker_line);
                current_bar_marker.appendChild(current_bar_marker_content);


                bar_container.appendChild(new_bar_marker);
                bar_container.appendChild(current_bar_marker);

                this.new_bar_markers.push(new_bar_marker);
                this.current_bar_markers.push(current_bar_marker);
                this.new_bar_markers_text.push(new_bar_marker_text);
                this.current_bar_markers_text.push(current_bar_marker_text);

            }

            this.bar_markers_init = true;
        
        }

        let adjust_select_index = this.adjust_select_element.selectedIndex;

        if(adjust_select_index != this.adjust_select_last_index){
            let i = 0;
            for(let bar of this.bar_value_elements){
                bar.value = this.initial_values[i][adjust_select_index]; 
                i++; 
            }
            this.adjust_select_last_index = adjust_select_index;
        }

        this.process();

    }

    process(){
        //Values//
        let upper_limit_value = Number(this.bar_value_elements[0].value);
        let lower_limit_value = Number(this.bar_value_elements[1].value);
        let trigger_time_value = Number(this.bar_value_elements[2].value);
        let value = null;

        if(this.last_upper_limit_value != upper_limit_value){
            this.new_bar_markers[0].style.left = "calc( " + String(upper_limit_value)+"% " + "- 2.25rem )";
            value = this.percentage_to_value(upper_limit_value, this.limits_max[0][this.adjust_select_last_index], this.limits_min[0][this.adjust_select_last_index]);
            this.new_bar_markers_text[0].innerText = value.toFixed(2);
            this.last_upper_limit_value = upper_limit_value;
        }

        if(this.last_lower_limit_value != lower_limit_value){
            this.new_bar_markers[1].style.left = "calc( " + String(lower_limit_value)+"% " + "- 2.25rem )";
            value = this.percentage_to_value(lower_limit_value, this.limits_max[1][this.adjust_select_last_index], this.limits_min[1][this.adjust_select_last_index]);
            this.new_bar_markers_text[1].innerText = value.toFixed(2);
            this.last_lower_limit_value = lower_limit_value;
        }

        if(this.last_trigger_time_value != trigger_time_value){
            this.new_bar_markers[2].style.left = "calc( " + String(trigger_time_value)+"% " + "- 2.25rem )";
            value = this.percentage_to_value(trigger_time_value, this.limits_max[2][this.adjust_select_last_index], this.limits_min[2][this.adjust_select_last_index]);
            this.new_bar_markers_text[2].innerText = value.toFixed(2);
            this.last_trigger_time_value = trigger_time_value;
        }
    }
    
    
    percentage_to_value(value, max, min){
        let range = max - min;
        return ((value/100)*range)+min;
    }

}

let voltage_text_values = [];
let voltage_bar_values = ["voltage_protection_upper_limit_bar", "voltage_protection_lower_limit_bar", "voltage_protection_trigger_time_bar"];
let voltage_bar_containers = ["voltage_protection_upper_limit_container", "voltage_protection_lower_limit_container", "voltage_protection_trigger_container"];
let voltage_adjust_select = "voltage_protection_adjust_select";
let voltage_initial_upper_limits = [250, 260, 280];
let voltage_initial_lower_limits = [215, 205, 195];
let voltage_initial_triggers = [10, 5, 3];

let voltage_initial_values = [voltage_initial_upper_limits, voltage_initial_lower_limits, voltage_initial_triggers];

let voltage_initial_upper_limits_max = [270, 310, 330];
let voltage_initial_upper_limits_min = [230, 210, 230];

let voltage_initial_upper_limits_max_unit = ["V", "V", "V"];
let voltage_initial_upper_limits_min_unit = ["V", "V", "V"];

let voltage_initial_lower_limits_max = [265, 255, 245];
let voltage_initial_lower_limits_min = [165, 155, 145];

let voltage_initial_lower_limits_max_unit = ["V", "V", "V"];
let voltage_initial_lower_limits_min_unit = ["V", "V", "V"];

let voltage_initial_triggers_max = [12, 7, 5];
let voltage_initial_triggers_min = [8, 3, 1];

let voltage_initial_triggers_max_unit = ["s", "s", "s"];
let voltage_initial_triggers_min_unit = ["s", "s", "s"];

let voltage_limits_max = [voltage_initial_upper_limits_max, voltage_initial_lower_limits_max, voltage_initial_triggers_max];
let voltage_limits_min = [voltage_initial_upper_limits_min, voltage_initial_lower_limits_min, voltage_initial_triggers_min];

let voltage_limits_max_unit = [voltage_initial_upper_limits_max_unit, voltage_initial_lower_limits_max_unit, voltage_initial_triggers_max_unit];  
let voltage_limits_min_unit = [voltage_initial_upper_limits_min_unit, voltage_initial_lower_limits_min_unit, voltage_initial_triggers_min_unit];



let voltage_protection_display = new ProtectionDisplay(document, voltage_text_values, voltage_bar_values, voltage_bar_containers, 
                                                       voltage_adjust_select, voltage_initial_values,
                                                       voltage_limits_max, voltage_limits_min, voltage_limits_max_unit, voltage_limits_min_unit);
