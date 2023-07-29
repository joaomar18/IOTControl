let title = document.getElementById("title");
let full_loader = document.getElementById("full-loader");
let connect_display = document.getElementById("connecting-div");
let warning_display = document.getElementById("connect-error-div");
let connect_error_message = document.getElementById("error_text_message");
let content_div = document.getElementById("content");

let mainNavBar = document.getElementById("main-nav-bar");
let mainDropButton = document.getElementById("main-drop-button");

let statePopup = document.getElementById("state-footer");
let buttonState = document.getElementById("controller-state-footer");

class DropDownMenu{
    constructor(window, drop_down_element, button_element){
        this.window = window;
        this.drop_down_element = drop_down_element;
        this.button_element = button_element;
        this.drop_down_visible = false;
        this.button_element.addEventListener("click", () => {
            if(this.drop_down_visible){
                this.drop_down_visible = false;
            }
            else{
                this.drop_down_visible = true;
            }
        });
        this.check_window = setInterval(this.check_window_handler.bind(this), 10);
    }
    check_window_handler = () => {
        let window_width = this.window.innerWidth;
        if(window_width >= 992){
            this.drop_down_visible = false;
            this.drop_down_element.style.display = "block";
        }
        else{
            if(this.drop_down_visible){
                this.drop_down_element.style.display = "block";
            }
            else{
                this.drop_down_element.style.display = "none";
            }
        }
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
        alert("Não foi possível inicar a aplicação!");
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

class ContentScreen{
    constructor(window, screen_loader, title_element, screen_element, initial_screen_number){
        this.window = window; //window element
        this.screen_loader = screen_loader; //screen loader
        this.title_element = title_element; //title element
        this.screen_element = screen_element; //content div
        this.initial_screen_number = initial_screen_number;
        this.screen_number = null;
        this.check_active_device = setInterval(this.check_active_device_handler.bind(this), 10);
    }

    check_active_device_handler = () => {
        if(active_device != null){
            this.screen_loader.set_loaded();
            this.change_screen(this.initial_screen_number); //Initialize the screen with screen number
            clearInterval(this.check_active_device);
        }
    }    

    async fetch_html_as_text(url) {
        return await (await fetch(url)).text();
    }

    async change_screen(screen_number){
        active_device.valid_elements = false;
        if(this.screen_number != screen_number){
            if(screen_number == 1){ //Ecra de dados em tempo real
                this.screen_element.innerHTML = await this.fetch_html_as_text("/static/ua_energy_analyzer/realTime.html");
                this.title_element.innerText = "Dados em tempo real";
                active_device.set_elements(get_real_time_nodes());
                device_animation.set_elements(get_real_time_animation_nodes());
            }
            else if(screen_number == 2){ //Ecra de consumo energetico
                this.screen_element.innerHTML = await this.fetch_html_as_text("/static/ua_energy_analyzer/consumption.html");
                this.title_element.innerText = "Consumo energético";
                active_device.set_elements(get_consumption_nodes());
            }
            else if(screen_number == 3){ //Ecra de qualidade de energia
                this.screen_element.innerHTML = await this.fetch_html_as_text("/static/ua_energy_analyzer/quality.html");
                this.title_element.innerText = "Qualidade de energia";
            }
            else if(screen_number == 4){ //Ecra de parametros
                this.screen_element.innerHTML = await this.fetch_html_as_text("/static/ua_energy_analyzer/config.html");
                this.title_element.innerText = "Parâmetros";
            }
            else if(screen_number == 5){ //Ecra de historico
                this.screen_element.innerHTML = await this.fetch_html_as_text("/static/ua_energy_analyzer/history.html");
                this.title_element.innerText = "Histórico";
            }
            active_device.valid_elements = true;
            active_device.set_active_section(screen_number);
            this.screen_number = screen_number;
        } 
    }
}

let screen_loader = new ScreenLoader(full_loader, connect_display, warning_display, connect_error_message, 5000);
let content_screen = new ContentScreen(window, screen_loader, title, content_div, 1);
let nav_drop_down = new DropDownMenu(window, mainNavBar, mainDropButton);
let footer_drop_down = new DropDownMenuExit(document, statePopup, buttonState);
let device_info = new DeviceInfo(document, "device_name", "device_type");

function loadRealTime(){
    content_screen.change_screen(1);
}

function loadConsumption(){
    content_screen.change_screen(2);
}

function loadQuality(){
    content_screen.change_screen(3);
}

function loadConfig(){
    content_screen.change_screen(4);
}

function loadHistory(){
    content_screen.change_screen(5);
}