let protection_upper_limit_checker = null;
let protection_lower_limit_checker = null;
let protection_trigger_time_checker = null;

let protection_upper_limit_value = null;
let protection_lower_limit_value = null;
let protection_trigger_time_value = null;

let protection_upper_limit_unit = "V";
let protection_lower_limit_unit = "V";
let protection_trigger_time_unit = "s";

let protection_upper_limit_current_value = 50;
let protection_lower_limit_current_value = 50;
let protection_trigger_time_current_value = 50;

let protection_upper_limit_current_unit = "V";
let protection_lower_limit_current_unit = "V";
let protection_trigger_time_current_unit = "s";



let protection_upper_limit_change = false;
let protection_lower_limit_change = false;
let protection_trigger_time_change = false;

let ul_new_value_div = null;
let ul_current_value_div = null;



/**************************** PROTECTION DISPLAY MANAGEMENT ***************************/

function init_protection_display(){
    let protection_upper_limit = document.getElementById("protection_upper_limit");
    let protection_lower_limit = document.getElementById("protection_lower_limit");
    let protection_trigger_time = document.getElementById("protection_trigger_time");

    let protection_upper_limit_container = document.getElementById("protection_upper_limit_container");
    let protection_lower_limit_container = document.getElementById("protection_lower_limit_container");
    let protection_trigger_time_container = document.getElementById("protection_trigger_time_container");


    if(protection_upper_limit_checker == null){
        protection_upper_limit_checker = setInterval(protection_upper_limit_checker_handler, 10);
    }
    if(protection_lower_limit_checker == null){
        protection_lower_limit_checker = setInterval(protection_lower_limit_checker_handler, 10);
    }
    if(protection_trigger_time_checker == null){
        protection_trigger_time_checker = setInterval(protection_trigger_time_checker_handler, 10);
    }

    function protection_upper_limit_checker_handler(){
        if(protection_upper_limit.value != protection_upper_limit_value){
            protection_upper_limit_value = protection_upper_limit.value;
            console.log(protection_upper_limit_value);
        }
        if(protection_upper_limit_current_value != protection_upper_limit_value){
            protection_upper_limit_change = true;
        }
        else{
            protection_upper_limit_change = false;
        }

        

        if(protection_upper_limit_change){
            if(ul_new_value_div == null){
                ul_new_value_div = document.createElement("div");
                ul_new_value_div.className = "current-protection-value";
                protection_upper_limit_container.appendChild(ul_new_value_div);
            }
            if(ul_current_value_div == null){
                ul_current_value_div = document.createElement("div");
                ul_current_value_div.className = "current-protection-value";
                protection_upper_limit_container.appendChild(ul_current_value_div); 
            }
            if(ul_new_value_div != null){
                ul_new_value_div.style.left = String(protection_upper_limit_value)+"%";
                ul_new_value_div.innerText = Number(protection_upper_limit_value).toFixed(2) + " " + protection_upper_limit_unit;
            }
            if(ul_current_value_div != null){
                ul_current_value_div.style.left = String(protection_upper_limit_current_value)+"%";
                ul_current_value_div.innerText = Number(protection_upper_limit_current_value).toFixed(2) + " " + protection_upper_limit_current_unit;
            }   
        }
        else{
            if(ul_new_value_div != null){
                protection_upper_limit_container.removeChild(ul_new_value_div);
                ul_new_value_div = null;
            }
            if(ul_current_value_div != null){
                protection_upper_limit_container.removeChild(ul_current_value_div);
                ul_current_value_div = null;
            }
        }
    }

    function protection_lower_limit_checker_handler(){
        if(protection_lower_limit.value != protection_lower_limit_value){
            protection_lower_limit_value = protection_lower_limit.value;
            console.log(protection_lower_limit_value);
        }
        if(protection_lower_limit_current_value == protection_lower_limit_value){
            protection_lower_limit_change = true;
        }
    }

    function protection_trigger_time_checker_handler(){
        if(protection_trigger_time.value != protection_trigger_time_value){
            protection_trigger_time_value = protection_trigger_time.value;
            console.log(protection_trigger_time_value);
        }
        if(protection_upper_limit_current_value == protection_upper_limit_value){
            protection_lower_limit_change = true;
        }
    }

}

function end_protection_display(){

    clearInterval(protection_upper_limit_checker);
    clearInterval(protection_lower_limit_checker);
    clearInterval(protection_trigger_time_checker);

    protection_upper_limit_checker = null;
    protection_lower_limit_checker = null;
    protection_trigger_time_checker = null;

    protection_upper_limit_value = null;
    protection_lower_limit_value = null;
    protection_trigger_time_value = null;

    protection_upper_limit_change = false;
    protection_lower_limit_change = false;
    protection_trigger_time_change = false;

    ul_new_value_div = null;
    ul_current_value_div = null;

}

/************************** END PROTECTION DISPLAY MANAGEMENT *************************/
/**************************************************************************************/