/************************************ MENU SLIDERS ************************************/

let consumption_vertical_slider = new VerticalSlider(document, window, "vertical_consumption_submenu","vertical_consumption_slider", "vertical_consumption_submenu_buttons", "consumption_slider_left_arrow", "consumption_slider_right_arrow", "consumption_subcontent_div");
let consumption_horizontal_slider = new HorizontalSlider(document, window, "consumption_content", "horizontal_consumption_submenu", "horizontal_consumption_slider", "horizontal_consumption_submenu", "consumption_slider_down_arrow", "consumption_slider_up_arrow");

/********************************** END MENU SLIDERS **********************************/
/**************************************************************************************/

/****************************** SUB SCREEN MANIPULATION *******************************/

let consumption_sub_screen_names = ["Consumo Atual", "Consultar Consumo"];
let consumption_sub_screen_containers = ["active_consumption_content", "past_consumption_content"];
let consumption_sub_screen = new SubScreen(document, "consumption_subcontent_title", "sub-nav-button", "sub-nav-button-small", consumption_sub_screen_names, consumption_sub_screen_containers, 0);


function setActiveConsumptionSubScreen(){
    consumption_sub_screen.changeSubScreen(0);
}

function setPastConsumptionSubScreen(){
    consumption_sub_screen.changeSubScreen(1);
}

/**************************** END SUB SCREEN MANIPULATION *****************************/
/**************************************************************************************/

/*************************************** ALERTS ***************************************/


let consumption_temporary_alerts = new TemporaryAlert(document, "consumption_subcontent_div");

/************************************* END ALERTS *************************************/
/**************************************************************************************/