/************************************** CONTROLS **************************************/

let manual_control = new ControlButton(document, "manual_button", document.getElementById("manual_button"));
let manual_selector = new ControlSelector(document, "manual_selector", document.getElementById("manual_selector"));
let hour_selector = new ControlSelector(document, "hour_control_selector", document.getElementById("hour_control_selector"));
let special_selector = new ControlSelector(document, "special_control_selector", document.getElementById("special_control_selector"));

function outputManualInvert(){
    manual_control.invert_button();
}

/************************************ END CONTROLS ************************************/
/**************************************************************************************/

/************************************ MENU SLIDERS ************************************/

let config_vertical_slider = new VerticalSlider(document, window, "vertical_config_submenu","vertical_config_slider", "vertical_config_submenu_buttons", "config_slider_left_arrow", "config_slider_right_arrow", "config_subcontent_div");
let config_horizontal_slider = new HorizontalSlider(document, window, "config_content", "horizontal_config_submenu", "horizontal_config_slider", "horizontal_config_submenu", "config_slider_down_arrow", "config_slider_up_arrow");

/********************************** END MENU SLIDERS **********************************/
/**************************************************************************************/

/****************************** SUB SCREEN MANIPULATION *******************************/

let config_sub_screen_names = ["Controlo de Carga", "Proteção e Limitação", "Dispositivo"];
let config_sub_screen_containers = ["controlo_carga_content", "protecao_limitacao_content", "device_content"];
let config_sub_screen = new SubScreen(document, "config_subcontent_title", "sub-nav-button", "sub-nav-button-small", config_sub_screen_names, config_sub_screen_containers, 1);



function setControlSubScreen(){
    config_sub_screen.changeSubScreen(0);
}

function setSafeLimitSubScreen(){
    config_sub_screen.changeSubScreen(1);
}

function setDeviceSubScreen(){
    config_sub_screen.changeSubScreen(2);
}

/**************************** END SUB SCREEN MANIPULATION *****************************/
/**************************************************************************************/

/*************************************** ALERTS ***************************************/

let config_temporary_alerts = new TemporaryAlert(document, "config_subcontent_div");

/************************************* END ALERTS *************************************/
/**************************************************************************************/

const config_section_display_checker = setInterval(config_section_display_checker_handler, 10);
const config_section_element_checker = "config_content";
let config_section_element_valid = false;
let config_section_init = false;

function config_section_display_checker_handler(){
    if(document.getElementById(config_section_element_checker) != null){
        config_section_element_valid = true;
    }
    else{
        if(config_section_init){
            end_protection_display();
            config_section_element_valid = false;
            config_section_init = false;
        }
    }
    if(!config_section_init && config_section_element_valid){
        init_hour_period_display();
        init_protection_display();
        config_section_init = true;
    }
}
