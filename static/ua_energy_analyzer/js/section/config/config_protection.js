/*************************** PROTECTION DISPLAY MANAGEMENT ***************************/

class ProtectionDisplay{
    constructor(document ,text_values ,bar_values, bar_containers, adjust_select, initial_upper_limits, initial_lower_limits, initial_triggers){
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


        this.new_bar_markers = [];
        this.current_bar_markers = [];
        this.new_bar_markers_text = [];
        this.current_bar_markers_text = [];
        this.bar_markers_init = false;


        this.check_valid_elements = setInterval(this.check_valid_elements_handler.bind(this), 10);

        this.run = null;

        this.initial_upper_limits = initial_upper_limits;
        this.initial_lower_limits = initial_lower_limits;
        this.initial_triggers = initial_triggers;

        this.elements_ready = [false, false, false, false];
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
        else{
            let upper_limit_value = Number(this.bar_value_elements[0].value);
            this.new_bar_markers[0].style.left = "calc( " + String(upper_limit_value)+"% " + "- 2.25rem )";
            this.new_bar_markers_text[0].innerText = String(upper_limit_value);
        }

    }

}

let voltage_text_values = [];
let voltage_bar_values = ["voltage_protection_upper_limit_bar", "voltage_protection_lower_limit_bar", "voltage_protection_trigger_time_bar"];
let voltage_bar_containers = ["voltage_protection_upper_limit_container", "voltage_protection_lower_limit_container", "voltage_protection_trigger_container"];
let voltage_adjust_select = "voltage_protection_adjust_select";
let voltage_initial_upper_limits = [250, 260, 280];
let voltage_initial_lower_limits = [215, 205, 195];
let voltage_initial_triggers = [10, 5, 3];

let voltage_protection_display = new ProtectionDisplay(document, voltage_text_values, voltage_bar_values, voltage_bar_containers, 
                                                       voltage_adjust_select, voltage_initial_upper_limits, voltage_initial_lower_limits, voltage_initial_triggers);
