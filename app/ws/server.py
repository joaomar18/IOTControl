###########EXERTNAL IMPORTS############

import asyncio
import threading
import websockets
import logging

#######################################

#############LOCAL IMPORTS#############

import data.ws
from data.device import *
import util.message
import ws.receive as receiver

#######################################

class WebsocketsClient(): ##WEBSOCKETS CLIENT CLASS
    def __init__(self, connection, start_section: int = 0, start_controller: str = ""): #init method (runs on object creation)
        self.connection = connection #connection of the client (Protocol object)
        self.start_section = start_section #start section of the client (Example: 1 -> client will connect on screen 1)
        self.current_section = start_section #current section of the client
        self.start_controller = start_controller #start controller of the client (Example: PLC_1 -> client will connect with PLC_1 displayed)
        self.current_controller = start_controller #current controller of the client

    def set_current_section(self, current_section: int): #change current section of the client
        self.current_section = current_section
    
    def set_current_controller(self, current_controller: str): #change current controller of the client
        self.current_controller = current_controller

class WebsocketsServer(): #WEBSOCKETS SERVER CLASS

    def __init__(self, address: str, port: int, send_queue: asyncio.Queue, event_loop : asyncio.AbstractEventLoop): #init method (runs on object creation)
        self.logger = logging.getLogger(__name__) #logger to inform of server activity and exceptions ocurred
        self.logger.setLevel(level=logging.INFO)
        self.event_loop = event_loop #Server object
        self.state = False #state of the server: True: Ready, False: OFF
        self.enabled = False #True: Enabled in the program, False: Stopped or stopping
        self.clients = set() #Data structure to hold the clients connected to the server
        self.address = address #URL adress of the server
        self.port = port #Port of the server
        self.messages = send_queue #Asyncio Queue to connect to other modules 
        #Modules that want to publish a message on the websockets server use the method put to
        #queue a particular message. This message will be received by the websockets sender method
        #and then it will be processed and sent in the handler_send_message method. The maximum number
        #of messages in the queue at any single time is 1000
        self.semaphore = asyncio.Semaphore(100) #Asyncio Semaphore to limit the number of paralel tasks created to send a message to a client
        #It is used when multiple clients will received the same message. The Semaphore doesn't let an any given time more than 100 send to client commands
        #This means that the server only processes a maximum number of 100 clients at a time, and then continues to process the rest of the clients if there are more
        self.stop_event = asyncio.Event() #Asyncio Event used to process the server connection
        #Setting the event will stop the server
        self.message_handlers = { #handler methods for messaging the clients.
            1: self.send_message_to_all_clients,
            2: self.send_message_to_all_clients,
            3: self.send_message_about_controller,
            4: self.send_message_about_node,
        }
        #Used in the handler_send_message method to connect the message type to the method that will send the message to the client(s)
        self.start_lock = threading.Lock() #creates a lock object so that the start method can only be called in a thread at a time
        self.stop_lock = threading.Lock() #creates a lock object so that the stop method can only be called in a thread at a time
        self.start() #starts the websocket server
    
    async def __del__(self): #delete method (runs on object deletion)
        self.stop()
    
    async def main(self): #Main function
        async with websockets.serve(self.handler_receive_message, self.address, self.port): #Serves the websockets server on the adress and port defined on the object creation
            self.logger.warning("Running websockets server on adress: %s:%i", self.address, self.port)
            self.state = True #Server ON
            await self.stop_event.wait() #Serves the websocket server until the stop_event is set (stop method)
        self.logger.warning("Shutting down websockets server from adress: %s:%i", self.address, self.port)
        self.state = False #Server OFF


    async def update_section(self, client: WebsocketsClient, message: list[str]):
        elements = message.split(";")
        message_type = elements[1]
        data = elements[2]
        if(message_type == "update_section"):
            client.set_current_section(int(data))

    async def update_client(self, client:WebsocketsClient, message: list[str]):
        elements = message.split(";")
        client_update = elements[0]
        if client_update == "ws_client":
            message_type = elements[1]
            parameter = elements[2]
            value = elements[3]
            if message_type == "update":
                if parameter == "device_name":
                    if value == "None":
                        await client.connection.send("1;no_active_device;"+value)
                    elif value in devices:
                        client.set_current_controller(value)
                        await client.connection.send("1;update_active_device;"+devices[value].stringify())
                    else:
                        await client.connection.send("1;fail_active_device;"+value)
                    


    async def handler_receive_message(self, websocket, path): #Handler receive message (Receives messages from clients as well as connection requests)
        #websocket: Client object
        #path: not known (not used)
        client = WebsocketsClient(websocket) #creates a websockets client with a initial section of 1, and the initial controller as "PLC_1"
        self.clients.add(client) #adds the new client to the connected clients set
        try:
            async for message in websocket: #receives incoming messages
                await self.update_client(client, message)
                await self.update_section(client, message)
                await receiver.processMessage(message)
        except websockets.exceptions.ConnectionClosedOK: #connection closed OK (just ignores)
                pass
        except websockets.exceptions.ConnectionClosedError: #Error on connection closed
                self.logger.exception("Exception in handling incoming messages: Connection Closed Error")
                try: #tries to force a close connection with the client
                    await client.connection.close()
                except Exception as e:
                    self.logger.exception("Exception in disconnecting from client: %s", e)
        except Exception as e: #processes other exceptions
                self.logger.exception("Exception in handling incoming messages: %s", e)
                try: #tries to force a close connection with the client
                    await client.connection.close()
                except Exception as e:
                    self.logger.exception("Exception in disconnecting from client: %s", e)
        finally: #runs this block on an expected client disconnect 
            try: #disconnects from client and removes the client from connected clients
                await client.connection.close()
                self.clients.remove(client)
            except KeyError:
                pass
            except Exception as e:
                self.logger.exception("Exception in disconnecting from client: %s", e)

    async def send_message_to_client(self, websocket, message): #send message to client
        try:
            await websocket.send(message)
        except websockets.exceptions.ConnectionClosedOK: #connection closed OK (just ignores)
            pass
        except websockets.exceptions.ConnectionClosedError: #Error on connection closed
            self.logger.exception("Exception in handling incoming messages: Connection Closed Error")
            try: #tries to force a close connection with the client
                await websocket.close()
            except Exception as e: #processes other exceptions
                self.logger.exception("Exception in disconnecting from client: %s", e)
        except Exception as e:
            self.logger.exception("Exception in sending message to client: %s", e)
            try: #tries to force a close connection with the client
                await websocket.close()
            except Exception as e:
                self.logger.exception("Exception in disconnecting from client: %s", e)

    async def send_message_to_all_clients(self, message): #send messsage to all clients
        async with self.semaphore: #asyncs with semahore (doensn't let more than 100 tasks be created for sending message to client)
            try: #try to create tasks to send message for every single connected client
                tasks = [asyncio.create_task(self.send_message_to_client(client.connection, message)) for client in self.clients]
                await asyncio.gather(*tasks) #gathers all the taks created, runs them in paralell, and waits for the conclusion of all the taks
            except Exception as e: #processes exceptions that may occur
                self.logger.exception("Exception in sending message to all clients: %s", e)

    async def send_message_about_controller(self, controller, message): #send message about controller
        async with self.semaphore: #asyncs with semahore (doensn't let more than 100 tasks be created for sending message to client)
            try: #try to create tasks to send message for every single connected client with current controller equal to the one passed in method argument
                tasks = [asyncio.create_task(self.send_message_to_client(client.connection, message)) for client in self.clients if client.current_controller == controller]
                await asyncio.gather(*tasks) #gathers all the taks created, runs them in paralell, and waits for the conclusion of all the taks
            except Exception as e: #processes exceptions that may occur
                self.logger.exception("Exception in sending message about controller: %s", e)

    async def send_message_about_node(self, controller, node_name, node_sections, message): #send message about a controller node
        async with self.semaphore: #asyncs with semahore (doensn't let more than 100 tasks be created for sending message to client)
            try: #try to create tasks to send message for every single connected client with current controller equal to the one passed in method argument
                #and equal active sections (if one of the node sections is 0, the message is allways sent)
                clients = [client for node_section in node_sections for client in self.clients if client.current_controller == controller and (client.current_section == node_section or node_section == 0)]
                tasks = [asyncio.create_task(self.send_message_to_client(client.connection, message)) for client in clients]
                await asyncio.gather(*tasks) #gathers all the taks created, runs them in paralell, and waits for the conclusion of all the taks
            except Exception as e: #processes exceptions that may occur
                self.logger.exception("Exception in sending message about node: %s", e)
 
    async def handler_send_message(self, message): #handler for sending messages to clients
        message_decoded = await util.message.decodeMessage(message) #decodes message received from other coroutines so that it can be processed
        message_type = message_decoded[0] #message type
        handler = self.message_handlers.get(message_type) #get's the function that is going to use to send the message, dependant of the message type
        if handler:
            try:
                await handler(*message_decoded[1:]) #awaits the conclusion of sending message
            except websockets.exceptions.ConnectionClosedOK: #connection closed OK (just ignores)
                pass
            except websockets.exceptions.ConnectionClosedError: #Error on connection closed
                self.logger.exception("Exception in handling incoming messages: Connection Closed Error")
            except Exception as e: #processes other exceptions
                self.logger.exception("Exception in handling outcoming messages: %s", e)

    async def sender(self): #Sender function
        while not self.stop_event.is_set(): #Processes the sender function as long the stop event is not set
            message = await self.messages.get() #get's messages from the aasyncio Queue
            #print(message)
            if len(self.clients): #processes the messages if there is at least one connected client
                await self.handler_send_message(message) #handles the message received

    def start(self): #Start function
        with self.start_lock:
            if self.state == False:
                self.stop_event.clear() #Resets the stop event so that the server can connect again
                # Remove all items from the queue  
                #self.clear_send_queue()
                self.event_loop.create_task(self.main()) #Creates a task in the event loop to run the main function
                self.event_loop.create_task(self.sender()) #Creates a task in the event loop to run the sender function
                self.enabled = True

    def stop(self): #Stop function
        with self.stop_lock:
            if self.state == True:
                self.enabled = False
                self.stop_event.set() #Sets the stop event so that the server can disconnect and stop gracefully
                self.clear_send_queue()


    def clear_send_queue(self): #Clear send messages queue
        size = self.messages.qsize() #size of the send messages queue
        for i in range(size): #clears the send queue of any message
            self.messages.get_nowait()