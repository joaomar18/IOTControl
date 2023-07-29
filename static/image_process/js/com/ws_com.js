class WebsocketsClient{
    constructor(window, url, port){
        this.url = url;
        this.port = port;
        this.connected = false; //True: Conectado com o servidor, False: Desconectado com o servidor
        this.connection = null;
        this.connect();
        this.controller = null;
        this.section = null;
        this.window = window;
        this.window.addEventListener('beforeunload', () => {
            this.connection.close();
            this.connected = false;
        });
    }

    connect(){
        let server_adress = "ws://" + this.url + ":" + String(this.port);
        this.connection = new WebSocket(server_adress);
        this.connection.addEventListener("open", () =>{
            this.connected = true;
            console.log("Connected to server: " + server_adress);
        });
        this.connection.addEventListener("message", async(message) =>{
            try {
                const data = await message.data;
                await process_message(data);
            } catch (error) {
                console.error("Error receiving message: " + error);
            }
        });
        this.connection.addEventListener("close", () =>{
            this.connected = false;
            console.log("Connection to server: " + server_adress + " closed");
            setTimeout(() => {
                this.connect();
              }, 2000);
        });
        this.connection.addEventListener("error", (err) =>{
            this.connected = false;
            console.error('Websockets client as encountered an error: ', err.message, 'Closing socket'); 
            this.connection.close();
        });

    }

    send(message){
        this.connection.send(message);
    }
    
    set_controller(controller){
        this.controller = controller;
    }

    set_section(section){
        this.section = section;
    }
}
          
let ws_client = new WebsocketsClient(window, "127.0.0.1", 9001);
  
  
  
  