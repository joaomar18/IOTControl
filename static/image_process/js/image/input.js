
let image_upload = document.getElementById('image-upload');
let input_image = document.getElementById('input-image');

image_upload.addEventListener('change', () => { //Corre quando o ficheiro no upload da aplicação Web altera
    let file = image_upload.files[0]; 
    let reader = new FileReader();
    let message = "ip_camera"+";"+"new_feed"+";"+file.name;
    console.log(message);
    ws_client.send(message); //Envia informação para o servidor que uma imagem foi carregada (juntamente com o nome do ficheiro)

    reader.addEventListener('load', () => {
        input_image.src = reader.result; //Carrega a imagem obtida
        if(document.getElementById("output-image") != null){
            document.getElementById("output-image").remove(); //Remove a imagem de saída quando uma nova imagem é carregada
        }
    });
    reader.readAsDataURL(file);
});


