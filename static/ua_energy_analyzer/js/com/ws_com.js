class WebsocketsClient{
    constructor(window, url, port){
        this.url = url;
        this.port = port;
        this.active_device_name = null;
        this.active_device_type = null;
        this.connected = false; //true: connected to server, false: diconnected from server
        this.connection = null;
        this.connect();
        this.window = window;
        this.window.addEventListener('beforeunload', () => {
            this.connection.close();
            this.connected = false;
        });
        this.send_device_info = setInterval(this.send_device_info_handler.bind(this), 10);
    }

    send_device_info_handler = () => {
        if(this.active_device_type != null && this.connected){
            this.send("ws_client;update;device_name;"+this.active_device_name);
            clearInterval(this.send_device_info);
        }
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
}
          
let ws_client = new WebsocketsClient(window, "192.168.0.37", 9001);
  
  
  
  