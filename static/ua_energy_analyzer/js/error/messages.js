class PriorityErrorHandling{
    constructor(document, mask_element, popup_container_element, popup_element, error_message_element, confirm_button_element){
        this.document = document;
        this.mask_element = mask_element;
        this.popup_container_element = popup_container_element;
        this.popup_element = popup_element;
        this.error_message_element = error_message_element;
        this.confirm_button_element = confirm_button_element;
        this.error_ocurred = null;
    }
}

class NoPriorityErrorHandling{
    constructor(document, mask_element, popup_container_element, popup_element, error_message_element, confirm_button_element){
        this.document = document;
        this.mask_element = mask_element;
        this.popup_container_element = popup_container_element;
        this.popup_element = popup_element;
        this.error_message_element = error_message_element;
        this.confirm_button_element = confirm_button_element;
        this.error_ocurred = null;
    }

    clean_error(){
        this.document.getElementById(this.error_message_element).innerText = '';
        this.document.getElementById(this.mask_element).style.display = 'none';
        this.document.getElementById(this.popup_element).style.display = 'none';
        this.document.getElementById(this.popup_container_element).style.display = 'none';
        this.error_ocurred = null;
    }

    set_error(error_message){
        this.document.getElementById(this.error_message_element).innerText = error_message;
        this.document.getElementById(this.mask_element).style.display = 'block';
        this.document.getElementById(this.popup_container_element).style.display = 'flex';
        this.document.getElementById(this.popup_element).style.display = 'flex';      
        this.document.getElementById(this.popup_container_element).addEventListener("click", (event) => {
            if (!event.target.closest("#popup_woPriority")){
                this.clean_error();
            }
        });
        this.document.getElementById(this.confirm_button_element).addEventListener("click", () => {
            this.clean_error();
        });
        this.error_ocurred = error_message;
    }
}

class AlertProps{
    constructor(type, section, message){
        this.type = type;
        this.section = section;
        this.message = message;
        this.current_position = null;
        this.alert = null;
        this.element_id = null;
        this.id = null;
        this.removed = false; //remove process has started
    }

    set_current_position(current_position){
        this.current_position = current_position;
    }

    set_alert(alert){
        this.alert = alert;
    }

    set_element_id(element_id, id){
        this.element_id = element_id;
        this.id = id;
    }

    set_id(id){
        this.id = id;
    }

    set_removed(){
        this.removed = true;
    }

    compare(other_alert_props){
        if(this.type == other_alert_props.type && this.section == other_alert_props.section && this.message == other_alert_props.message){
            return true;
        }
        else{
            return false;
        }
    }
}


class TemporaryAlert{


    constructor(document, align_element){
        this.document = document;
        this.align_element = align_element;
        this.update_position_array = [];
        this.remove_alert_array = [];
        this.active_alerts = [];
        this.active_alerts_ready = true;
        this.check_active_alerts = setInterval(this.check_active_alerts_handler.bind(this), 10);
        this.check_align_element = setInterval(this.check_align_element_handler.bind(this), 10);
    }


    create_temporary_warning(type,section, message){
        let new_alert_props = new AlertProps(type, section, message);
        let update_only = false; //if there is an equal alert in the stack only updates it.
        for(let alert of this.active_alerts){
            if(alert.compare(new_alert_props)){
                clearTimeout(this.remove_alert_array[alert.id]);
                this.remove_alert_array.splice(alert.id, 1);
                this.remove_alert_array.splice(alert.id, 0, setTimeout(() => this.remove_alert_handler(alert), 3000));
                update_only = true;    
                return alert;
            }
        }
        if(!update_only){
            let new_warning = document.createElement('div');
            let proc_type;
            let waiter_on = false;
            if(type.includes("waiter")){
                waiter_on = true;
                proc_type = type.substring(type.indexOf("-")+1);
                console.log(proc_type);
            }
            else{
                proc_type = type;
            }
            new_warning.className = "alert alert-" + proc_type +" alert-dismissible fade show temporary-alert " + section + "-temporary-alert";
            new_warning.id = section+"_"+"alert-"+type+String(this.active_alerts.length);
            new_warning.style.display = "flex";
            new_warning.style.flexDirection = "row";
            new_warning.role = "alert";
            if(waiter_on){
                new_warning.innerHTML = [
                    `<div class="spinner-border text-secondary" role="status">`,
                    `</div>`,
                    `   <div>${message}</div>`,
                    //'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    //'   <button type="button" class="btn-close" aria-label="Close"></button>',
                ].join('');                    
            }
            else{
                new_warning.innerHTML = [

                    `   <div>${message}</div>`,
                    //'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    //'   <button type="button" class="btn-close" aria-label="Close"></button>',
                ].join('');
            }
            let rect = this.document.getElementById(this.align_element).getBoundingClientRect();
            let middle_pos = (Number(rect.left) + Number(rect.right))/2;
            new_warning.style.left = String(middle_pos+"px");
            let new_close_button = document.createElement("button");
            new_close_button.className = "btn-close";
            new_close_button.ariaLabel = "Close";
            new_warning.appendChild(new_close_button);
            this.document.body.appendChild(new_warning);

            new_close_button.addEventListener("click", () => {
                this.remove_active_alert_process(new_alert_props);
            });


            new_alert_props.set_current_position(middle_pos);
            new_alert_props.set_alert(new bootstrap.Alert(new_warning));
            new_alert_props.set_element_id(new_warning.id, this.active_alerts.length);
            this.active_alerts.push(new_alert_props);
            this.update_position_array.push(setInterval(() => this.update_position_handler(new_alert_props), 10));
            this.remove_alert_array.push(setTimeout(() => this.remove_alert_handler(new_alert_props), 3000));

            return new_alert_props;
        }
    }

    remove_temporary_warning(alert){
        while(!this.active_alerts_ready);
        if(this.document.getElementById(alert.element_id) != null){
            try{
                if(alert.alert != null && !alert.removed){
                    alert.alert.close();
                    clearInterval(this.update_position_array[alert.id]);
                    this.update_position_array.splice(alert.id, 1);
                    clearTimeout(this.remove_alert_array[alert.id]);
                    this.remove_alert_array.splice(alert.id, 1);
                    this.remove_active_alert(alert.id);
                    alert.set_removed();
                }
            }
            catch(error){
                console.error("An error occurred removing a temporary warning:", error.message);
            }            
        }
    }

    check_active_alerts_handler = () => {
        for (let alert of this.active_alerts) {
            if(this.document.getElementById(alert.element_id) == null){
                try {
                    clearInterval(this.update_position_array[alert.id]);
                    this.update_position_array.splice(alert.id, 1);
                    clearTimeout(this.remove_alert_array[alert.id]);
                    this.remove_alert_array.splice(alert.id, 1);
                    this.remove_active_alert(alert.id);  
                  } catch (error) {
                    console.error("An error occurred in Active Alerts Handler:", error.message);
                  }
            }
        }
    }

    check_align_element_handler = () => {
        if(this.document.getElementById(this.align_element) == null){
            for(let active_alert of this.active_alerts){     
                try{
                    document.getElementById(active_alert.element_id).remove();
                    clearInterval(this.update_position_array[active_alert.id]);
                    this.update_position_array.splice(active_alert.id, 1);
                    clearTimeout(this.remove_alert_array[active_alert.id]);
                    this.remove_alert_array.splice(active_alert.id, 1);   
                    this.remove_active_alert(active_alert.id);        
                } catch(error){
                    console.error("An error occurred in Check Align Elements Handler:", error.message);
                }         
            }
        }
    }


    update_position_handler(new_alert_props) {
        if(this.document.getElementById(this.align_element) != null && this.document.getElementById(new_alert_props.element_id) != null){
            try{
                let rect = this.document.getElementById(this.align_element).getBoundingClientRect();
                let middle_pos = (Number(rect.left) + Number(rect.right))/2;
                if(new_alert_props.current_position != middle_pos){
                    this.document.getElementById(new_alert_props.element_id).style.left = String(middle_pos+"px");
                    new_alert_props.set_current_position(middle_pos);
                }
            }
            catch(error){
                console.error("An error occurred in Update Position Handler:", error.message);
            }
        }
    }



    remove_alert_handler(new_alert_props){
        this.remove_active_alert_process(new_alert_props);
    }

    remove_active_alert(index){
        try{
            this.active_alerts_ready = false;
            this.active_alerts.splice(index,1);
            for(let i = index; i < this.active_alerts.length; i++){
                this.active_alerts[i].set_id(this.active_alerts[i].id - 1);
            }
            this.active_alerts_ready = true;
        }
        catch(error){
            console.error("An error occurred in Helper Remove Alert Function:", error.message);
        }            
    }


    remove_active_alert_process(new_alert_props){
        while(!this.active_alerts_ready);
        if(this.document.getElementById(new_alert_props.element_id) != null){
            try{
                if(new_alert_props.alert != null && !new_alert_props.removed){
                    new_alert_props.alert.close();
                    clearInterval(this.update_position_array[new_alert_props.id]);
                    this.update_position_array.splice(new_alert_props.id, 1);
                    clearTimeout(this.remove_alert_array[new_alert_props.id]);
                    this.remove_alert_array.splice(new_alert_props.id, 1);
                    this.remove_active_alert(new_alert_props.id);
                    new_alert_props.set_removed();
                }
            }
            catch(error){
                console.error("An error occurred in Remove Active Alert Process:", error.message);
            }            
        }
    }
}

let config_temporary_alerts = new TemporaryAlert(document, "config-subcontent-div");

let prio_errors = new PriorityErrorHandling(document, "mask_wPriority", "popup_error", "popup_wPriority", "error_wPriority", "confirm_error_wPriority");

let no_prio_errors = new NoPriorityErrorHandling(document, "mask_woPriority", "popup_error", "popup_woPriority" , "error_woPriority", "confirm_error_woPriority");