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

class TemporaryWarning{
    constructor(document, align_element){
        this.document = document;
        this.align_element = align_element;
        this.update_position_array = [];
    }
    create_temporary_warning(type,section, message){
        let new_warning = document.createElement('div');
        new_warning.className = "alert alert-" + type +" alert-dismissible fade show temporary-alert " + section + "-temporary-alert";
        new_warning.role = "alert";
        new_warning.innerHTML = [
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        ].join('');
        let rect = this.document.getElementById(this.align_element).getBoundingClientRect();
        let middle_pos = (Number(rect.left) + Number(rect.right))/2;
        new_warning.style.left = String(middle_pos+"px");
        this.document.body.appendChild(new_warning);
        //this.update_position_array.push(setInterval(this.update_position_handler.bind(this), 10));
    }

    update_position_handler = () => {
    }
}

let config_temporary_warnings = new TemporaryWarning(document, "add_period_popup");

let prio_errors = new PriorityErrorHandling(document, "mask_wPriority", "popup_error", "popup_wPriority", "error_wPriority", "confirm_error_wPriority");

let no_prio_errors = new NoPriorityErrorHandling(document, "mask_woPriority", "popup_error", "popup_woPriority" , "error_woPriority", "confirm_error_woPriority");