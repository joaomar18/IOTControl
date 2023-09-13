/************************************** CONTROLS **************************************/

let manual_control = new ControlButton(document, "manual_button", document.getElementById("manual_button"));
let manual_selector = new ControlSelector(document, "manual_selector", document.getElementById("manual_selector"), "config_content");
let hour_selector = new ControlSelector(document, "hour_control_selector", document.getElementById("hour_control_selector"), "config_content");
let special_selector = new ControlSelector(document, "special_control_selector", document.getElementById("special_control_selector"), "config_content");

function outputManualInvert(){
    manual_control.invert_button();
}

/************************************ END CONTROLS ************************************/
/**************************************************************************************/

/****************************** SUB SCREEN MANIPULATION *******************************/

let config_sub_screen_names = ["Controlo de Carga", "Proteção e Limitação", "Dispositivo"];
let config_sub_screen_containers = ["controlo_carga_content", "protecao_limitacao_content", "device_content"];

/**************************** END SUB SCREEN MANIPULATION *****************************/
/**************************************************************************************/

/*************************************** ALERTS ***************************************/

let config_temporary_alerts = new TemporaryAlert(document, "config_subcontent_div", "config_content");

/************************************* END ALERTS *************************************/
/**************************************************************************************/