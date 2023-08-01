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
    constructor(document, element){
        this.document = document;
        this.element = element;
    }
    create_temporary_warning(type, message){
        let new_warning = document.createElement('div');
        new_warning.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        this.document.getElementById(this.element).appendChild(new_warning);
    }
}

let config_temporary_warnings = new TemporaryWarning(document, "config-subcontent-div");

let prio_errors = new PriorityErrorHandling(document, "mask_wPriority", "popup_error", "popup_wPriority", "error_wPriority", "confirm_error_wPriority");

let no_prio_errors = new NoPriorityErrorHandling(document, "mask_woPriority", "popup_error", "popup_woPriority" , "error_woPriority", "confirm_error_woPriority");