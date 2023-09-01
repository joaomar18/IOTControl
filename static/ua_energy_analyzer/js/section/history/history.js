/************************************ MENU SLIDERS ************************************/

let history_vertical_slider = new VerticalSlider(document, window, "vertical_history_submenu","vertical_history_slider", "vertical_history_submenu_buttons", "history_slider_left_arrow", "history_slider_right_arrow", "history_subcontent_div");
let history_horizontal_slider = new HorizontalSlider(document, window, "history_content", "horizontal_history_submenu", "horizontal_history_slider", "horizontal_history_submenu", "history_slider_down_arrow", "history_slider_up_arrow");

/********************************** END MENU SLIDERS **********************************/
/**************************************************************************************/

/****************************** SUB SCREEN MANIPULATION *******************************/

let history_sub_screen_names = ["Proteção e Limitação", "Controlo de Carga", "Dispositivo"];
let history_sub_screen_containers = ["protection_history_content", "activation_history_content", "device_history_content"];
let history_sub_screen = new SubScreen(document, "history_subcontent_title", "sub-nav-button", "sub-nav-button-small", history_sub_screen_names, history_sub_screen_containers, 0);

function setProtectionHistorySubScreen(){
    history_sub_screen.changeSubScreen(0);
}

function setActivationHistorySubScreen(){
    history_sub_screen.changeSubScreen(1);
}

function setConnectionHistorySubScreen(){
    history_sub_screen.changeSubScreen(2);
}

/**************************** END SUB SCREEN MANIPULATION *****************************/
/**************************************************************************************/

/*************************************** ALERTS ***************************************/

let history_temporary_alerts = new TemporaryAlert(document, "history_subcontent_div");

/************************************* END ALERTS *************************************/
/**************************************************************************************/
