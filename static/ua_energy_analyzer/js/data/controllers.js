class Protocol{
    OPC_UA = 10 //constant to define OPC UA Communication Devices
    MQTT = 20 //constant to define MQTT Communication Devices
    LORA_WAN = 30 //constant to define Lora Wan Communication Devices
    ZIGBEE = 40 //constant to define Zigbee Communication Devices

    static stringify(protocol){
      if(protocol == 10){
        return "OPC_UA";
      }
      else if(protocol == 20){
        return "MQTT";
      }
      else if(protocol == 30){
        return "LORA_WAN";
      }
      else if(protocol == 40){
        return "ZIGBEE";
      }
      else{
        return "Não definido";
      }
    }
}


class Field{
    constructor(document, name, container, decimal_places, unit){
        this.document = document;
        this.name = name;
        this.container = container;
        this.decimal_places = decimal_places
        this.unit = unit
        this.value = null;
    }

    update_container(container){
        this.container = container;
    }

    set_value(value){
        if(this.document.getElementById(this.name) == null){
        }
        else{
            let processed_value = parseFloat(value).toFixed(this.decimal_places);
            let output = processed_value+" "+this.unit;
            this.document.getElementById(this.name).value = output;
            this.value = processed_value;
        }
    }

    get_value(){
        return this.document.getElementById(this.name).value;
    }

    set_decimal_places(decimal_places){
        this.decimal_places = decimal_places;
    }

    set_unit(unit){
        if(this.value == null || this.document.getElementById(this.name) == null){
            this.unit = unit;
        }
        else{
            this.unit = unit;
            let output = this.value+" "+this.unit;
            this.document.getElementById(this.name).value = output;
        }
    }

    clear_container(){
        if(this.document.getElementById(this.name) == null){
        }
        else{
            this.document.getElementById(this.name).value = "";
        }
    }
}

class DeviceAnimation{
    constructor(document, canvas, openc_lines, closec_lines, warning_lines, closec_arrows, warning_arrows){
        this.document = document;
        this.canvas = canvas;
        this.img_contactor_off = new Image();
        this.img_contactor_off.src = "/static/ua_energy_analyzer/img/contactor_open.png";
        this.img_contactor_on = new Image();
        this.img_contactor_on.src =  '/static/ua_energy_analyzer/img/contactor_closed.png';
        this.openc_lines = openc_lines;
        this.closec_lines = closec_lines;
        this.warning_lines = warning_lines;
        this.closec_arrows = closec_arrows;
        this.warning_arrows = warning_arrows;
        this.contactor_state = false;
        this.last_contactor_state = false;
        this.first_update = false;

        this.elements = {}; //Dictionary that holds all elements of a device animation

        this.update_animations = setInterval(this.update_animations_handler.bind(this), 10);
    }

    update_animations_handler = () => {
        if(this.check_elements_valid()){
            if(this.contactor_state != this.last_contactor_state || !this.first_update){
                if(this.contactor_state){
                    //this.set_elements_closed();
                    this.set_elements_open();
                }
                else{
                    //this.set_elements_open();
                    this.set_elements_closed();
                }
                this.last_contactor_state = this.contactor_state;
                this.first_update = true;
            }
        }
        else{
            this.first_update = false;
        }
    }

    set_contactor_closed(){
        this.contactor_state = true;
    }

    set_contactor_open(){
        this.contactor_state = false;
    }

    check_elements_valid(){
        if(this.document.getElementById(this.canvas) != null){
            return true;
        }
        else{
            return false;
        }
    }

    set_elements_closed(){
        let openc_elements = this.document.getElementsByClassName(this.openc_lines);
        let closec_elements = this.document.getElementsByClassName(this.closec_lines);
        let closec_elements_arrows = this.document.getElementsByClassName(this.closec_arrows);
        let ctx = this.document.getElementById(this.canvas).getContext('2d');
        this.document.getElementById(this.canvas).width = this.img_contactor_on.width;
        this.document.getElementById(this.canvas).height = this.img_contactor_on.height;
        ctx.drawImage(this.img_contactor_on, 0, 0);
        for(let i = 0; i < openc_elements.length; i++){
            let element = openc_elements[i];
            element.style.display = "none";
        }
        for(let i = 0; i < closec_elements.length; i++){
            let element = closec_elements[i];
            element.style.display = "block";
        }
        for(let i = 0; i < closec_elements_arrows.length; i++){
            let element = closec_elements_arrows[i];
            element.style.display = "block";
        }
    }

    set_elements_open(){
        let openc_elements = this.document.getElementsByClassName(this.openc_lines);
        let closec_elements = this.document.getElementsByClassName(this.closec_lines);
        let closec_elements_arrows = this.document.getElementsByClassName(this.closec_arrows);
        let ctx = this.document.getElementById(this.canvas).getContext('2d');
        this.document.getElementById(this.canvas).width = this.img_contactor_off.width;
        this.document.getElementById(this.canvas).height = this.img_contactor_off.height;
        ctx.drawImage(this.img_contactor_off, 0, 0);
        for(let i = 0; i < closec_elements_arrows.length; i++){
            let element = closec_elements_arrows[i];
            element.style.display = "none";
        }
        for(let i = 0; i < closec_elements.length; i++){
            let element = closec_elements[i];
            element.style.display = "none";
        }
        for(let i = 0; i < openc_elements.length; i++){
            let element = openc_elements[i];
            element.style.display = "block";
        }        
    }

    set_elements(elements){
        this.elements = elements;
    }

    clear_elements(){
        for (let element in this.elements) {
            if(this.elements[element].container != null){
                this.elements[element].clear_container();
            }
        }
    }

}

class HourPeriod{
    constructor(init, end){
        this.init = init;
        this.end = end;
    }
}

class HourPeriods{
    constructor(document, window, content, xs_content, xs_week_day){
        this.monday_periods = [];
        this.tuesday_periods = [];
        this.wednesday_periods = [];
        this.thursday_periods = [];
        this.friday_periods = [];
        this.saturday_periods = [];
        this.sunday_periods = [];
        this.document = document;
        this.window = window;
        this.content = content;
        this.extra_small_view = false;
        this.last_xs_week_day = null;
        this.xs_content = xs_content; 
        this.xs_week_day = xs_week_day;
        this.waiting_fb = false;
        this.update_xs_content = setInterval(this.update_xs_content_handler.bind(this), 10);
        this.init_hour_periods = [false, false, false, false, false, false, false];
    }


    update_xs_content_handler = () => {
        let screenWidth = this.window.innerWidth || this.document.documentElement.clientWidth || this.document.body.clientWidth;
        if(screenWidth < 729){
            this.extra_small_view = true;
        }
        else{
            this.extra_small_view = false;
        }
        if(this.document.getElementById(this.xs_content) != null){
            if(this.extra_small_view){
                if(this.document.getElementById(this.xs_week_day).selectedIndex != this.last_xs_week_day){
                    let week_day = this.document.getElementById(this.xs_week_day).selectedIndex;
                    let str_week_day = null;
                    if(week_day == 0 && this.init_hour_periods[0]){
                        str_week_day = "monday";
                    }
                    else if(week_day == 1 && this.init_hour_periods[1]){
                        str_week_day = "tuesday";
                    }
                    else if(week_day == 2 && this.init_hour_periods[2]){
                        str_week_day = "wednesday";
                    }
                    else if(week_day == 3 && this.init_hour_periods[3]){
                        str_week_day = "thursday";
                    }
                    else if(week_day == 4 && this.init_hour_periods[4]){
                        str_week_day = "friday";
                    }
                    else if(week_day == 5 && this.init_hour_periods[5]){
                        str_week_day = "saturday";
                    }
                    else if(week_day == 6 && this.init_hour_periods[6]){
                        str_week_day = "sunday";
                    }
                    if(str_week_day != null){
                        this.last_xs_week_day = week_day;
                        this.update_xs_container(str_week_day);
                    }
                }
            }
            else{
                this.last_xs_week_day = null;
            }
        }
        else{
            for(let i = 0; i < this.init_hour_periods.length; i++){
                this.init_hour_periods[i] = false;
            }
            this.last_xs_week_day = null;
        }
    }    




    update_periods(week_day, new_periods){
        if(week_day == "monday"){
            this.monday_periods = new_periods;
            this.init_hour_periods[0] = true;
        }
        else if(week_day == "tuesday"){
            this.tuesday_periods = new_periods;
            this.init_hour_periods[1] = true;
        }
        else if(week_day == "wednesday"){
            this.wednesday_periods = new_periods;
            this.init_hour_periods[2] = true;
        }
        else if(week_day == "thursday"){
            this.thursday_periods = new_periods;
            this.init_hour_periods[3] = true;
        }
        else if(week_day == "friday"){
            this.friday_periods = new_periods;
            this.init_hour_periods[4] = true;
        }
        else if(week_day == "saturday"){
            this.saturday_periods = new_periods;
            this.init_hour_periods[5] = true;
        }
        else if(week_day == "sunday"){
            this.sunday_periods = new_periods;
            this.init_hour_periods[6] = true;
        }
    }

    set_waiting_fb(){
        this.waiting_fb = true;
    }

    reset_waiting_fb(){
        this.waiting_fb = false;
    }

    update_xs_container(week_day){
        if(this.document.getElementById(this.xs_content) != null){
            let week_day_index = null;
            if(week_day == "monday"){
                week_day_index = 0;
            }
            else if(week_day == "tuesday"){
                week_day_index = 1;
            }
            else if(week_day == "wednesday"){
                week_day_index = 2;
            }
            else if(week_day == "thursday"){
                week_day_index = 3;
            }
            else if(week_day == "friday"){
                week_day_index = 4;
            }
            else if(week_day == "saturday"){
                week_day_index = 5;
            }
            else if(week_day == "sunday"){
                week_day_index = 6;
            }
            if (week_day_index == this.last_xs_week_day && week_day_index != null){
                let content_element = this.document.getElementById(this.xs_content);
                let new_hour_periods = [];
                if(week_day == "monday" && this.init_hour_periods[0]){
                    new_hour_periods = this.monday_periods;
                    console.log(new_hour_periods);
                }
                else if(week_day == "tuesday" && this.init_hour_periods[1]){
                    new_hour_periods = this.tuesday_periods;
                }
                else if(week_day == "wednesday" && this.init_hour_periods[2]){
                    new_hour_periods = this.wednesday_periods;
                }
                else if(week_day == "thursday" && this.init_hour_periods[3]){
                    new_hour_periods = this.thursday_periods;
                }
                else if(week_day == "friday" && this.init_hour_periods[4]){
                    new_hour_periods = this.friday_periods;
                }
                else if(week_day == "saturday" && this.init_hour_periods[5]){
                    new_hour_periods = this.saturday_periods;
                }
                else if(week_day == "sunday" && this.init_hour_periods[6]){
                    new_hour_periods = this.sunday_periods;
                }
                if(content_element != null){
                    while (content_element.firstChild) {
                        content_element.removeChild(content_element.firstChild);
                    }
                }
                for(let hour_period of new_hour_periods){
                    let new_hour_period = document.createElement("div");
                    new_hour_period.className = "hour-period-entry-xs";
                    new_hour_period.innerText = hour_period.init + " - " + hour_period.end;
                    content_element.appendChild(new_hour_period);
                } 
            }
        }
    }

    update_container(week_day){
        if(this.document.getElementsByClassName(this.content) != null){
            let content_element = null;
            let new_hour_periods = [];
            if(week_day == "monday"){
                content_element = (this.document.getElementsByClassName(this.content))[0];
                new_hour_periods = this.monday_periods;
            }
            else if(week_day == "tuesday"){
                content_element = (this.document.getElementsByClassName(this.content))[1];
                new_hour_periods = this.tuesday_periods;
            }
            else if(week_day == "wednesday"){
                content_element = (this.document.getElementsByClassName(this.content))[2];
                new_hour_periods = this.wednesday_periods;
            }
            else if(week_day == "thursday"){
                content_element = (this.document.getElementsByClassName(this.content))[3];
                new_hour_periods = this.thursday_periods;
            }
            else if(week_day == "friday"){
                content_element = (this.document.getElementsByClassName(this.content))[4];
                new_hour_periods = this.friday_periods;
            }
            else if(week_day == "saturday"){
                content_element = (this.document.getElementsByClassName(this.content))[5];
                new_hour_periods = this.saturday_periods;
            }
            else if(week_day == "sunday"){
                content_element = (this.document.getElementsByClassName(this.content))[6];
                new_hour_periods = this.sunday_periods;
            }
            if(content_element != null){
                while (content_element.firstChild) {
                    content_element.removeChild(content_element.firstChild);
                }
            }
            for(let hour_period of new_hour_periods){
                let new_hour_period = document.createElement("div");
                new_hour_period.className = "hour-period-entry";
                new_hour_period.innerText = hour_period.init + " - " + hour_period.end;
                content_element.appendChild(new_hour_period);
            } 
        }
    }
}

function sort_hour_periods(hour_periods){
    hour_periods_to_order = hour_periods;
    hours_periods_ordered = [];

    let current_smaller_hour_period = null;

    while(hour_periods_to_order.length > 0){
        for(let hour_period of hour_periods_to_order){
            if(current_smaller_hour_period == null || hour_period.init < current_smaller_hour_period.init){
                current_smaller_hour_period = hour_period;
            }
        }
        let index_to_remove = hour_periods_to_order.indexOf(current_smaller_hour_period);
        if(index_to_remove != -1){
            hour_periods_to_order.splice(index_to_remove, 1);
        }
        hours_periods_ordered.push(current_smaller_hour_period);
        current_smaller_hour_period = null;
    }

    return hours_periods_ordered;
}

class Device{
    constructor(document, id, name, url, port, protocol, state_element, id_element, protocol_element, device_animation){
        this.document = document;
        this.id = id;
        this.name = name;
        this.url = url;
        this.port = port;
        this.protocol = protocol; //Protocol: "OPCUA", "MQTT", "LORA_WAN", "ZIGBEE"
        this.state_element = state_element;
        this.id_element = id_element;
        this.protocol_element = protocol_element;
        this.document.getElementById(this.id_element).innerText = String(this.id);
        this.document.getElementById(this.protocol_element).innerText = Protocol.stringify(this.protocol);

        this.device_animation = device_animation;

        this.connected = false; //Connection status: true: connected, false: not connected;
        this.active_section = null; //current active section on the controller;
        this.elements = {}; //Dictionary that holds all elements of a device
        this.stop_event = true; //initiates the device in disabled mode

        this.clear_elements_function = setInterval(this.clear_elements_handler.bind(this), 10);
        this.check_conn = setInterval(this.check_conn_handler.bind(this), 10);
        this.send_initial_data = setInterval(this.send_initial_data_handler.bind(this), 10);
        this.elements_cleared = false;
        this.last_connected;
        this.first_check = false;
        this.init_sent = false;
        this.output = false;
    }
    
    clear_elements_handler = () => {
        if(this.connected || !this.first_check){
            this.elements_cleared = false;
            this.first_check = true;
        }
        else if(!this.connected){
            if(!this.elements_cleared && this.valid_elements){
                this.clear_elements();
                this.device_animation.clear_elements();
                this.device_animation.set_contactor_open();
                this.elements_cleared = true;
            }
        }
    }

    check_conn_handler = () => {
        if(this.last_connected != this.connected){
            if(this.connected){
                this.document.getElementById(this.state_element).style.backgroundColor = "rgb(73, 255, 73)";
            }
            else{
                this.document.getElementById(this.state_element).style.backgroundColor = "rgb(255, 73, 73)";
            }
            this.last_connected = this.connected;
        }
    }

    send_initial_data_handler = () => {
        if (typeof ws_client === undefined) {
        }
        else{
            if(ws_client.connected){
                if(!this.init_sent){
                    ws_client.send(this.name+";"+"info"+";"+"ask");
                    this.init_sent = true;
                }
            }
            else{
                this.init_sent = false;
            }
        }
    }

    set_active_section(active_section){
        if(active_section != this.active_section){
            this.active_section = active_section;
            this.first_check = false;
            if(typeof ws_client === undefined){
            }
            else{
                if(ws_client.connected){
                    let message = this.name+";"+"update_section"+";"+String(this.active_section);
                    console.log(message);
                    ws_client.send(message);
                }
            }
        }
    }

    receive_parameter_messages(parameter, value){
        if(parameter == "connection"){
            if(value == "ON"){
                this.connected = true;
            }
            else if(value == "OFF"){
                this.connected = false;
                if(this.active_section == 4){
                    manual_selector.set_selector_off();
                    manual_control.set_control_off();
                }
            }
        }
    }

    receive_node_messages(node, value){
        if(this.connected && this.valid_elements){ //nodes to be received only when device is connected
            if(this.active_section == 1){
                let first_letter = node.charAt(0);
                let unit_change = node.includes("unit");
                let real_node;
                if(unit_change){
                    real_node = node.substring(0, node.indexOf("u"));
                    if(first_letter == "I"){
                        if(value == "False"){
                            this.elements[real_node].set_unit("mA");
                            this.device_animation.elements[real_node].set_unit("mA");
                        }
                        else{
                            this.elements[real_node].set_unit("A");
                            this.device_animation.elements[real_node].set_unit("A");
                        }
                    }
                    else if(first_letter == "P"){
                        if(value == "False"){
                            this.elements[real_node].set_unit("W");
                        }
                        else{
                            this.elements[real_node].set_unit("kW");
                        }
                    }
                    else if(first_letter == "Q"){
                        if(value == "False"){
                            this.elements[real_node].set_unit("VAr");
                        }
                        else{
                            this.elements[real_node].set_unit("kVAr");
                        }
                    }
                    else if(first_letter == "S"){
                        if(value == "False"){
                            this.elements[real_node].set_unit("VA");
                        }
                        else{
                            this.elements[real_node].set_unit("kVA"); 
                        }
                    }
                }
                else{
                    real_node = node;
                    if(this.elements[real_node] === undefined){
                    }
                    else{
                        this.elements[real_node].set_value(value);
                    }
                    if(this.device_animation.elements[real_node] === undefined){
                    }
                    else{
                        this.device_animation.elements[real_node].set_value(value);
                    }
                }
            }
            else if(this.active_section == 4){
                console.log(node);
                if(node == "ModeManual"){
                    if(value == "False"){
                        manual_selector.set_selector_off();
                    }
                    else{
                        manual_selector.set_selector_on();
                    }
                    manual_selector.feedback_done();
                }
                else if(node == "ModeAuto"){
                }
                else if(node == "OrderManual"){
                    if(value == "False"){
                        manual_control.set_control_off();
                    }
                    else{
                        manual_control.set_control_on();
                    }
                }
            }
            if(node == "OutputContactor"){
                if(value == "False"){
                    this.output = false;
                    this.device_animation.set_contactor_open();
                }
                else{
                    this.output = true;
                    this.device_animation.set_contactor_closed();
                }
                manual_control.feedback_done();
            }
        }
        else if(this.valid_elements){ //nodes that can be received when the device is not connected
            if(this.active_section == 1){

            }
            else if(this.active_section == 4){
                if(node == "hour_period_info"){
                    let week_day;
                    let hour_periods;
                    if(value.includes(";")){
                        week_day = value.substring(0, value.indexOf(";"));
                        hour_periods = value.substring(value.indexOf(";")+1);
                        hour_periods = hour_periods.split(";");
                    }
                    else{
                        week_day = value;
                        hour_periods = [];
                    }                    
                    let new_hour_periods = [];
                    for(let hour_period of hour_periods){
                        let initial_period = hour_period.substring(hour_period.indexOf("init:")+5, hour_period.indexOf(","));
                        let final_period = hour_period.substring(hour_period.indexOf("end:")+4);
                        new_hour_periods.push(new HourPeriod(initial_period, final_period));
                    }
                    new_hour_periods = sort_hour_periods(new_hour_periods);
                    device_hour_periods.update_periods(week_day, new_hour_periods);
                    device_hour_periods.update_container(week_day);
                    if(device_hour_periods.extra_small_view){
                        device_hour_periods.update_xs_container(week_day);
                    }
                    if(device_hour_periods.waiting_fb){
                        config_temporary_alerts.create_temporary_warning("success", "config", "Os períodos horários foram atualizados com exito.");
                        device_hour_periods.reset_waiting_fb();
                    }
                }
            }
        }
    }


    set_connection(state){
        this.connected = state;
    }

    set_elements(elements){
        this.elements = elements;
    }

    clear_elements(){
        for (let element in this.elements) {
            if(this.elements[element].container != null){
                this.elements[element].clear_container();
            }
        }
    }

    add_element(){ //abstact method (to define in child classes)
    }

    enable(){ //enables the device handler (activate the device)
        this.stop_event = false;
    }

    disable(){ //disables the device handler (disables the device)
        this.stop_event = true;
    }
}


let device_animation = new DeviceAnimation(document, "realtime-image-animation", "openc-line", "closec-line", "warning-line", "closec-arrow", "warning-arrow");
let device_hour_periods = new HourPeriods(document, window, "table-horizontal-row-content", "table_extra_small_content", "day_of_week_selector_xs");

let devices = {}; //dictionary with all working devices
let active_device = null;