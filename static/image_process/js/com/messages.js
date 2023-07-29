async function decode_message(message){ //Função para colocar a mensagem recebida do servidor websockets num formato conhecido
    let ocurrence = 0;
    let result_fetch = false;
    let first_element;
    let second_element;
    let result = [];
    
    for (let i = 0; i < message.length; i++) {
      if (message[i] == ';') {
        if(!ocurrence){
            first_element = i;
            ocurrence = 1;
        }
        else{
            if(result_fetch){
                result.push(message.substring(second_element+1,i))
                result.push(message.substring(i + 1));
                break;
            }
            else{
                second_element = i;
                result.push(message.substring(first_element+1, i));
                result_fetch = true;
            }
        }
      }
    }
    return result;
}

let request_number = 0;

async function process_message(message) {
    let message_elements = await decode_message(message);
    let controller = message_elements[0];
    let type = message_elements[1];
    let value = message_elements[2];
    if(type == "new_frame"){
        if(value == "true"){
            active_objects = {};
            let previous_objects = document.querySelectorAll('.object-div'); 
            previous_objects.forEach((object) => {
                object.remove(); //Remove toda a informação quanto aos objetos da imagem prévia
            });
        }
    }
    else if(type == "frame_processed"){
        if(value == "true"){ //Indica que todos os objetos da imagem foram recebidos
            if(document.getElementById("output-image") == null){ //Realiza o processamento se a imagem de saída for nula
                request_number++;
                let img = document.createElement('img');
                img.id = "output-image";
                img.src = '/static/image_process/img/output.png?'+String(request_number); //Request Number certifica-se que a imagem não é carregada do cache do navegador
                document.getElementById("image-output-div").appendChild(img);
                //Cria informação visivel na aplicação para cada objeto na imagem (passado por websocekts)
                for(let num_obj in active_objects){
                    work_object = active_objects[num_obj];
                    let object_div = document.createElement("div");
                    object_div.className = "object-div";

                    let object_title = document.createElement("span");
                    object_title.className = "object-title";
                    object_title.innerText = "Objeto " + String(num_obj);

                    let span_centroid = document.createElement("span");
                    span_centroid.className = "object-measure";
                    let span_area = document.createElement("span");
                    span_area.className = "object-measure";
                    let span_perimeter = document.createElement("span");
                    span_perimeter.className = "object-measure";
                    let span_orientation = document.createElement("span");
                    span_orientation.className = "object-measure";
                    let red_ratio = document.createElement("span");
                    red_ratio.className = "object-measure";
                    let green_ratio = document.createElement("span");
                    green_ratio.className = "object-measure";
                    let blue_ratio = document.createElement("span");
                    blue_ratio.className = "object-measure";
                    span_centroid.innerText = "Centróide: ("+work_object.centroid[0].toFixed(3)+"px, "+work_object.centroid[1].toFixed(3)+"px)";
                    span_area.innerText = "Área: " + work_object.area.toFixed(3)+" px";
                    span_perimeter.innerText = "Perímetro: " + work_object.perimeter.toFixed(3)+" px";
                    span_orientation.innerText = "Orientação: " + work_object.orientation.toFixed(3)+" rad";
                    red_ratio.innerText = "Percentagem de vermelho: " + (work_object.rgb_ratio[0]*100).toFixed(3) + " %";
                    green_ratio.innerText = "Percentagem de verde: " + (work_object.rgb_ratio[1]*100).toFixed(3) + " %";
                    blue_ratio.innerText = "Percentagem de azul: " + (work_object.rgb_ratio[2]*100).toFixed(3) + " %";
                    object_div.appendChild(object_title);
                    object_div.appendChild(span_centroid);
                    object_div.appendChild(span_area);
                    object_div.appendChild(span_perimeter);
                    object_div.appendChild(span_orientation);
                    object_div.appendChild(red_ratio);
                    object_div.appendChild(green_ratio);
                    object_div.appendChild(blue_ratio);
                    document.getElementById("output-div").appendChild(object_div);
                }
            }
        }
    }
    else if(type.includes("image_object_prop")){ //Informação quanto a um objeto da imagem 
        let object_number = Number(type.charAt(type.length - 1));
        let object_data = value.split(";");

        let object_centroid;
        let object_area;
        let object_perimeter;
        let object_orientation;
        let rgb_ratio = [];

        for(let parameter of object_data){
            let parameter_name = parameter.substring(0, parameter.indexOf(":"));
            let parameter_value = parameter.substring(parameter.indexOf(":")+1);
            if(parameter_name == "centroid"){
                let height = parameter_value.substring(parameter_value.indexOf("(")+1, parameter_value.indexOf(","));
                height = Number(height);
                let width = parameter_value.substring(parameter_value.indexOf(" ")+1, parameter_value.indexOf(")"));
                width = Number(width);
                object_centroid = [height, width];
            }
            else if(parameter_name == "area"){
                object_area = Number(parameter_value);
            }
            else if(parameter_name == "perimeter"){
                object_perimeter = Number(parameter_value);
            }
            else if(parameter_name == "orientation"){
                object_orientation = Number(parameter_value);
            }
            else if(parameter_name == "rgb_ratio"){
                let red_ratio = parameter_value.substring(parameter_value.indexOf("[")+1, parameter_value.indexOf(","));
                let green_ratio = parameter_value.substring(parameter_value.indexOf(" ")+1, parameter_value.lastIndexOf(","));
                let blue_ratio = parameter_value.substring(parameter_value.lastIndexOf(" ")+1, parameter_value.indexOf("]"));
                red_ratio = Number(red_ratio);
                green_ratio = Number(green_ratio);
                blue_ratio = Number(blue_ratio);
                rgb_ratio = [red_ratio, green_ratio, blue_ratio];
            }
        }
        active_objects[object_number] = new ImageObject(object_centroid, object_area, object_perimeter, object_orientation, rgb_ratio);
        console.log(active_objects);
    }
}