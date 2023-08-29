let quality_vertical_slider = new VerticalSlider(document, window, "vertical_quality_submenu","vertical_quality_slider", "vertical_quality_submenu_buttons", "quality_slider_left_arrow", "quality_slider_right_arrow", "quality_subcontent_div");
let quality_horizontal_slider = new HorizontalSlider(document, window, "quality_content", "horizontal_quality_submenu", "horizontal_quality_slider", "horizontal_quality_submenu", "quality_slider_down_arrow", "quality_slider_up_arrow");


let quality_sub_screen_names = ["Tensão", "Frequência", "Fator de Potência"];
let quality_sub_screen_containers = ["voltage_quality_content", "frequency_quality_content", "pf_quality_content"];
let quality_sub_screen = new SubScreen(document, "quality_subcontent_title", "sub-nav-button", "sub-nav-button-small", quality_sub_screen_names, quality_sub_screen_containers, 0);


function setVoltageQualitySubScreen(){
    quality_sub_screen.changeSubScreen(0);
}

function setFreqQualitySubScreen(){
    quality_sub_screen.changeSubScreen(1);
}

function setPFQualitySubScreen(){
    quality_sub_screen.changeSubScreen(2);
}

let quality_temporary_alerts = new TemporaryAlert(document, "quality_subcontent_div");