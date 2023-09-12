let full_loader = document.getElementById("full-loader");
let connect_display = document.getElementById("connecting-div");
let warning_display = document.getElementById("connect-error-div");
let connect_error_message = document.getElementById("error_text_message");
let content_div = document.getElementById("content");
let main_app_section = document.getElementById("app_logo_text");

let statePopup = document.getElementById("state-footer");
let buttonState = document.getElementById("controller-state-footer");

let dropdown_button_div = document.getElementById("dropdown_button_div");

let main_dashboard = document.getElementById("main_dashboard");

dropdown_button_div.addEventListener("click", function(){
    if(main_dashboard.classList.contains("closed")){
        main_dashboard.classList.remove("closed");
    }
    else{
        main_dashboard.classList.add("closed");
    }
});

class PopoverUtil{
    constructor(document){
        this.document = document;
        this.active_popover = false; //true: there is an active popover
        this.check_active_popover = setInterval(this.check_active_popover_handler.bind(this), 10);
        this.active_popovers = [];
        this.document.addEventListener("click", (event) => {
            if(this.active_popover){
                if (!event.target.closest(".popover") && !event.target.closest(".popover-body") && !event.target.closest(".info-popup-image")){
                    this.active_popovers.forEach((element) => {
                        element.hide();
                    });
                }
            }
        });
    }


    check_active_popover_handler = () => {
        let activePopovers = document.getElementsByClassName('popover');
        let activePopoversArray = Array.from(activePopovers);
        if(activePopoversArray.length>0){
            this.active_popover = true;
        }
        else{
            this.active_popover = false;
        }
    }

    update_dynamic_elements() {
        this.active_popovers.splice(0);
    
        let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    
        let popoverList = popoverTriggerList.map((popoverTrigger) => {
            let new_popover = new bootstrap.Popover(popoverTrigger);
            this.active_popovers.push(new_popover);
            return new_popover;
        });
    }
}

class DropDownMenuExit { //Drop down that exits when another element on the window is clicked
    constructor(document, drop_down_element, button_element){
        this.document = document;
        this.drop_down_element = drop_down_element;
        this.button_element = button_element;
        this.drop_down_visible = false;
        this.document.addEventListener("click", (event) => {
            if (!event.target.closest("#state-footer") && !event.target.closest("#controller-state-footer")){
                if(this.drop_down_visible){
                    this.drop_down_element.style.display = 'none';
                    this.drop_down_visible = false;        
                }
            }
        });
        this.button_element.addEventListener("click", () => {
            if(this.drop_down_visible == false){
                this.drop_down_element.style.display = 'block';
                this.drop_down_visible = true;
            }
            else{
                this.drop_down_element.style.display = 'none';
                this.drop_down_visible = false;
            }
        });
    }
}

class ScreenLoader{
    constructor(loader_element,connect_display, warning_display,connect_error_message, timeout){
        this.loader_element = loader_element;
        this.connect_display = connect_display;
        this.warning_display = warning_display;
        this.connect_error_message = connect_error_message;
        this.loaded = false;
        this.check_loading = setInterval(this.loading_handler.bind(this), 100);
        this.loader_timeout = setTimeout(this.timeout_handler.bind(this), timeout);
        this.final_load_timeout = null;
        this.error_message = null;
    }

    loading_handler = () => {
        if(this.loaded && this.error_message == null){
            clearInterval(this.check_loading);
            clearTimeout(this.loader_timeout);
            this.final_load_timeout = setTimeout(this.final_load_handler.bind(this), 100);
        }
        else if(this.error_message != null){
            clearInterval(this.check_loading);
            clearTimeout(this.loader_timeout);
            this.connect_display.style.display = 'none';
            this.warning_display.style.display = 'flex';
        }
    }

    final_load_handler = () => {
        this.loader_element.style.display = 'none';
        clearTimeout(this.final_load_timeout);
    }

    timeout_handler = () => {
        this.set_error_message("Não foi possível iniciar a aplicação.");
        clearInterval(this.check_loading);
        clearTimeout(this.loader_timeout);
    }

    set_loaded(){
        this.loaded = true;
    }

    set_error_message(error_message){
        this.error_message = error_message;
        this.connect_error_message.innerText = this.error_message;

    }
}

class DeviceInfo{
    constructor(document, device_name_element, device_type_element){
        this.document = document;
        this.device_name_element = device_name_element;
        this.device_type_element = device_type_element;
        this.check_device_name = setInterval(this.check_device_name_handler.bind(this), 10);
    }
    check_device_name_handler = () => {
        if(ws_client != null && this.document.getElementById(this.device_name_element).innerText != null){
            ws_client.active_device_name = this.document.getElementById(this.device_name_element).innerText;
            ws_client.active_device_type = this.document.getElementById(this.device_type_element).innerText;
            clearInterval(this.check_device_name);
        }
    }
}

class ContentLoader{
    constructor(document, elements, files, sub_files, css_files, js_files, files_directory, sub_files_directory, css_files_directory, js_files_directory){
        this.document = document;
        this.elements = elements;
        this.files = files;
        this.sub_files = sub_files;
        this.css_files = css_files;
        this.js_files = js_files;
        this.files_directory = files_directory;
        this.sub_files_directory = sub_files_directory;
        this.css_files_directory = css_files_directory;
        this.js_files_directory = js_files_directory;
        this.elements_loaded = [];
        for(let element of this.elements){
            this.elements_loaded.push(false);
        }
        this.loaded_count = 0;
        this.load_content = null;
    }

    startLoadingOthers(){
        this.load_content = setInterval(this.load_content_handler.bind(this), 10);
    }


    load_content_handler = () => {
        if(this.loaded_count < this.elements_loaded.length){
            this.load_element(this.loaded_count);
            this.loaded_count++;
        }
        else{
            clearInterval(this.load_content);
            this.load_content = null;
        }
    } 

    async load_element(element_number){
        if(this.elements_loaded[element_number] != null){
            if(!this.elements_loaded[element_number]){
                for(let css_file of this.css_files[element_number]){
                    this.loadCSS(this.css_files_directory+css_file);
                }
                for(let js_file of this.js_files[element_number]){
                    this.loadJS(this.js_files_directory+js_file);
                }
                this.elements[element_number].innerHTML = await this.fetch_html_as_text(this.files_directory+this.files[element_number]);

                let sub_elements = this.elements[element_number].querySelectorAll('.subcontent-div');


                let i = 0;
                for(let sub_element of sub_elements){
                    sub_element.innerHTML = await this.fetch_html_as_text(this.sub_files_directory+this.sub_files[element_number][i]);
                    i++;
                }

                this.elements_loaded[element_number] = true;
            }
        }
    }

    async fetch_html_as_text(url) {
        return await (await fetch(url)).text();
    }

    loadCSS(url) {
        let link = this.document.createElement("link");
        link.href = url;
        link.rel = "stylesheet";
        this.document.head.appendChild(link);
    }

    loadJS(url) {
        let script = this.document.createElement("script");
        script.src = url;
        this.document.body.appendChild(script);
    }
}


class ContentOrganizer{
    constructor(document, content, grid_container, grid_elements, width_triggers, configuration, config_hide_elements){
        this.document = document;
        this.content = content;
        this.grid_container = grid_container;
        this.grid_elements = grid_elements;
        this.elements = null;
        this.width_triggers = width_triggers;
        this.configuration = configuration;
        this.config_hide_elements = config_hide_elements;
        this.initial_validation = false;
        this.set_configuration = null;
        this.check_initial_validation = setInterval(this.check_initial_validation_handler.bind(this), 10);
        this.check_content_width = setInterval(this.check_content_width_handler.bind(this), 10);
    }


    check_initial_validation_handler = () => {
        if(this.document.getElementById(this.grid_container) != null){
            this.elements = this.document.getElementsByClassName(this.grid_elements);
            this.elements = Array.from(this.elements);            
            this.initial_validation = true;
            clearInterval(this.check_initial_validation);
            this.check_initial_validation = null;
        }
    }

    check_content_width_handler = () => {
        if(this.initial_validation){

            let computed_style = window.getComputedStyle(this.document.getElementById(this.content));

            let padding_left = computed_style.getPropertyValue('padding-left');
            let padding_right = computed_style.getPropertyValue('padding-right');

            let margin_left = computed_style.getPropertyValue('margin-left');
            let margin_right = computed_style.getPropertyValue('margin-right');
            
            padding_left = parseFloat(padding_left);
            padding_right = parseFloat(padding_right);

            margin_left = parseFloat(margin_left);
            margin_right = parseFloat(margin_right);  
            
            let sides_width = padding_left + padding_right + margin_left + margin_right;

            let width = this.document.getElementById(this.content).offsetWidth + sides_width;


            let configuration = null;
            let new_configuration = null;
            let i = 0;
            for(let width_trigger of this.width_triggers){
                if(i == 0){
                    
                    if(width < width_trigger){
                        break;
                    }
                }
                else{
                    if(this.width_triggers[i-1] <= width && width < width_trigger){
                        break;
                    }
                }
                i++;
            }
            configuration = this.configuration[i];
            new_configuration = i;

            if(this.set_configuration != new_configuration){
                this.document.getElementById(this.grid_container).style.gridTemplateRows = "repeat(" + String(configuration[0]) + ", fit-content)";
                this.document.getElementById(this.grid_container).style.gridTemplateColumns = "repeat(" + String(configuration[1]) + ", 1fr)";

                if(this.set_configuration != null){
                    if(this.config_hide_elements[this.set_configuration].length != 0){
                        for(let hide_index of this.config_hide_elements[this.set_configuration]){
                            this.elements[hide_index-1].style.display = "grid";
                        }
                    }
                }

                for(let hide_index of this.config_hide_elements[new_configuration]){
                    this.elements[hide_index-1].style.display = "none";
                }
                this.set_configuration = new_configuration;
            }
        }
    }  
}

class ContentScreen{
    constructor(window, screen_loader, main_app_section, main_screen_names, control_elements,  content_elements, content_loader, initial_screen_number){
        this.window = window; //window element
        this.screen_loader = screen_loader; //screen loader
        this.main_app_section = main_app_section;
        this.main_screen_names = main_screen_names;
        this.control_elements = document.getElementsByClassName(control_elements);
        this.control_elements = Array.from(this.control_elements);
        this.initial_screen_number = initial_screen_number;
        this.screen_number = null;
        this.content_elements = content_elements;
        this.content_loader = content_loader;
        this.check_active_device = setInterval(this.check_active_device_handler.bind(this), 10);
        this.load_control_elements = setInterval(this.load_control_elements_handler.bind(this), 10);
        this.init_running = false;
    }

    check_active_device_handler = () => {
        if(active_device != null){
            this.init();
        }
    }  
    
    load_control_elements_handler = () => {
        for(let control of this.control_elements){
            control.addEventListener("click", function(event){
                event.preventDefault();
            })
        }
        clearInterval(this.load_control_elements);
    }    

    async init(){
        if(this.init_running){
            return; //Makes sure the interval function doens't make repetitive calls to init()
        }   
        this.init_running = true;
        try{
            if(!this.screen_loader.loaded){
                await this.content_loader.load_element(this.initial_screen_number);
                await this.change_screen(this.initial_screen_number); //Initialize the screen with screen number
                this.screen_loader.set_loaded();
                this.content_loader.startLoadingOthers();
                clearInterval(this.check_active_device);
            }
        }
        finally{
            this.init_running = false;
        }
    }

    async change_screen(screen_number){
        if(this.screen_number != screen_number){
            if(this.content_loader.elements_loaded[screen_number]){
                active_device.valid_elements = false;
                if(this.screen_number != null){
                    this.control_elements[this.screen_number].textDecoration = "none";
                    this.content_elements[this.screen_number].hidden = true;
                }

                this.main_app_section.innerText = this.main_screen_names[screen_number];
    
                this.content_elements[screen_number].hidden = false;

                this.control_elements[screen_number].textDecoration = "underline";
    
                if(screen_number == 0){ //Ecra de dados em tempo real
                    active_device.set_elements(get_real_time_nodes());
                    device_animation.set_elements(get_real_time_animation_nodes());
                }
                else if(screen_number == 1){ //Ecra de consumo energetico
                    active_device.set_elements(get_consumption_nodes());
                }
                else if(screen_number == 2){ //Ecra de qualidade de energia
                }
                else if(screen_number == 3){ //Ecra de parametros
    
                }
                else if(screen_number == 4){ //Ecra de historico
                }
                active_device.valid_elements = true;
                active_device.set_active_section(screen_number+1);
                this.screen_number = screen_number;
                popovers.update_dynamic_elements(); //update popover elements
            }
            else{

            }
        } 
    }
}

let popovers = new PopoverUtil(document);
let screen_loader = new ScreenLoader(full_loader, connect_display, warning_display, connect_error_message, 5000);

let content_elements = document.getElementsByClassName("section-content");
let content_elements_array = Array.from(content_elements);
let content_files = ["realTime.html", "consumption.html", "quality.html", "config.html", "history.html"];
let subcontent_files = [[], [], [], [], []];

//REALTIME SUBCONTENT//


//CONSUMPTION SUBCONTENT//

subcontent_files[1].push("consumption/active_consumption.html");
subcontent_files[1].push("consumption/past_consumption.html");

//QUALITY SUBCONTENT//

subcontent_files[2].push("quality/voltage_quality.html");
subcontent_files[2].push("quality/frequency_quality.html");
subcontent_files[2].push("quality/pf_quality.html");

//CONFIG SUBCONTENT//

subcontent_files[3].push("config/load_control.html");
subcontent_files[3].push("config/protection_control.html");
subcontent_files[3].push("config/device_control.html");

//HISTORY SUBCONTENT//

subcontent_files[4].push("history/load_history.html");
subcontent_files[4].push("history/protection_history.html");
subcontent_files[4].push("history/device_history.html");

let content_css_files = [["realTime.css"], ["consumption.css"], [], ["config.css"], []];
let content_js_files = [[], [], [], [], []];

//REALTIME JS FILES//


//CONSUMPTION JS FILES //

content_js_files[1].push("section/consumption/consumption_active.js");
content_js_files[1].push("section/consumption/consumption_past.js");
content_js_files[1].push("section/consumption/consumption.js");

//QUALITY JS FILES //

content_js_files[2].push("section/quality/quality_voltage.js");
content_js_files[2].push("section/quality/quality_frequency.js");
content_js_files[2].push("section/quality/quality_powerfactor.js");
content_js_files[2].push("section/quality/quality.js");

//CONFIG JS FILES //

content_js_files[2].push("section/config/config_load_control.js");
content_js_files[2].push("section/config/config_protection.js");
content_js_files[2].push("section/config/config_device.js");
content_js_files[2].push("section/config/config.js");

//HISTORY JS FILES //

content_js_files[2].push("section/history/history_load_control.js");
content_js_files[2].push("section/history/history_protection.js");
content_js_files[2].push("section/history/history_device.js");
content_js_files[2].push("section/history/history.js");


let content_files_directory = "/static/ua_energy_analyzer/";
let subcontent_files_directory = "/static/ua_energy_analyzer/section/"
let content_css_files_directory = "/static/ua_energy_analyzer/css/";
let content_js_files_directory = "/static/ua_energy_analyzer/js/";

let screen_names = ["Dados em tempo Real", "Consumo", "Qualidade de Energia", "Configuração", "Histórico"];

let content_loader = new ContentLoader(document, content_elements_array, content_files, subcontent_files, content_css_files, content_js_files, content_files_directory, subcontent_files_directory, content_css_files_directory, content_js_files_directory);

let realtime_width_triggers = [1100, 1600];
let realtime_grid_configuration = [[5, 1], [3, 2], [2, 3]];
let realtime_grid_config_hide_elements = [[5], [5], []];

let realtime_divs_organizer = new ContentOrganizer(document, "content", "realtime_content_grid", "realtime-content-grid-item", realtime_width_triggers, realtime_grid_configuration, realtime_grid_config_hide_elements);

let content_screen = new ContentScreen(window, screen_loader, main_app_section, screen_names, "link", content_elements_array, content_loader, 0);
let footer_drop_down = new DropDownMenuExit(document, statePopup, buttonState);
let device_info = new DeviceInfo(document, "device_name", "device_type");



function loadRealTime(){
    content_screen.change_screen(0);
}

function loadConsumption(){
    content_screen.change_screen(1);
}

function loadQuality(){
    content_screen.change_screen(2);
}

function loadConfig(){
    content_screen.change_screen(3);
}

function loadHistory(){
    content_screen.change_screen(4);
}