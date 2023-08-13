async function decode_message(message){
    let elements = message.split(";");
    return elements;
}

async function process_global_parameter(global_message){
    let parameter = global_message.substring(0,global_message.indexOf(";"));
    let content = global_message.substring(global_message.indexOf(";")+1);
    if(parameter == "update_active_device"){
        let values = content.split(";");
        let device_id;
        let device_name;
        let device_url;
        let device_port;
        let device_protocol;
        for(let value of values){
            let messages = value.split(":");
            let identifier = messages[0];
            if(identifier == "id"){
                device_id = Number(messages[1]);
            }
            else if(identifier == "name"){
                device_name = messages[1];
            }
            else if(identifier == "url"){
                device_url = messages[1];
            }
            else if(identifier == "port"){
                device_port = Number(messages[1]);
            }
            else if(identifier == "protocol"){
                device_protocol = Number(messages[1]);
            }
        }
        devices[device_name] = new Device(document, device_id, device_name, device_url, device_port, device_protocol, "state_controller",  "device_id", "device_protocol", device_animation);
        active_device = devices[device_name];
    }
    else if(parameter == "fail_active_device"){
        screen_loader.set_error_message("O dispositivo "+content+" não foi encontrado.");
    }
    else if(parameter == "no_active_device"){
        screen_loader.set_error_message("Não foi definido nenhum dispositivo.");
    }
}


async function process_controller(controller, parameter, value){
    devices[controller].receive_parameter_messages(parameter, value);
}

async function process_node(controller, node, value){
    devices[controller].receive_node_messages(node, value);
}


async function process_message(message) {
    let message_elements = await decode_message(message);
    let message_code = Number(message_elements[0]);
    let controller = null;
    let parameter = null;
    let node = null;
    let value = null;
    if(message_code == 1){ //global parameter : [parameter: string, value: any]
        let global_message = message.substring(message.indexOf(";")+1);
        await process_global_parameter(global_message);
    }
    else if(message_code == 2 || message_code == 3){ //about a controller: [controller: string, parameter: string, value: any]
        controller = message_elements[1];
        parameter = message_elements[2];
        value = message_elements[3];
        let i = message_elements.length;
        let j = 4;
        while(i > 4){
            value += ";"+message_elements[j];
            i--;
            j++;
        }
        await process_controller(controller, parameter, value);
    }
    else if(message_code == 4){ //about a node: [controller: string, node: string, value: any]
        controller = message_elements[1];
        node = message_elements[2];
        value = message_elements[3];
        let i = message_elements.length;
        let j = 4;
        while(i > 4){
            value += ";"+message_elements[j];
            i--;
            j++;
        }
        await process_node(controller, node, value);
    }
}