###########EXERTNAL IMPORTS############

import asyncio
import threading
import logging
from abc import ABC, abstractmethod


#######################################

#############LOCAL IMPORTS#############

import db.database as db

#######################################

class Protocol(): #PROTOCOL CLASS
    OPC_UA = 10 #constant to define OPC UA Communication Devices
    MQTT = 20 #constant to define MQTT Communication Devices
    LORA_WAN = 30 #constant to define Lora Wan Communication Devices
    ZIGBEE = 40 #constant to define Zigbee Communication Devices
    WEB = 50 #constant to define Web Communication (Doesn't communicate directly with physical device)

class Node(): #ABSTRACT NODE CLASS
    def __init__(self, name: str,sections: set):
        self.node_name = name #name of the node
        self.sections = sections #sections of a Node (For example, if a node changes it's value it's only sent to the clients that have that section active)
        #If the node as a section equal to 0, it is allways sent to the clients that active the controller associated with the node active
        self.value = None
    
    def set_value(self, value): #changes the value of the node
        self.value = value

class Device(ABC): #ABSTRACT DEVICE CLASS
    def __init__(self, id: int, name: str, url : str, port : int, protocol: int, event_loop: asyncio.AbstractEventLoop, send_queue: asyncio.Queue): #init method (runs on object creation)
        self.logger = logging.getLogger(__name__) #logger to inform of device activity and exceptions ocurred
        self.logger.setLevel(level=logging.INFO)
        self.id = id #Unique ID of the device
        self.name = name #Name of the device
        self.url = url #URL of the device
        self.port = port #Port of the device
        self.connected = False #connection status: True-> Connected, False-> Disconnected
        self.event_loop = event_loop #Event loop for handler functions
        self.database = db.Database(self.name) #creates a database for the Device
        self.stop_event = asyncio.Event() #Stop event for enabling/disabling the Device
        self.stop_event.set() #Initiates the Device in disabled mode
        self.start_lock = threading.Lock()  #creates a lock object so that the start method can only be called in a thread at a time (Child Method)
        self.stop_lock = threading.Lock()  #creates a lock object so that the stop method can only be called in a thread at a time (Child Method)
        self.send_queue = send_queue #Queue to connect with the browser clients
        self.messages = asyncio.Queue(maxsize=1000) #Queue to send messsages to device
        self.nodes = {} #Dicitionary of Device Nodes
        try:
            if protocol in [Protocol.OPC_UA, Protocol.MQTT, Protocol.LORA_WAN, Protocol.ZIGBEE, Protocol.WEB]:
                self.protocol = protocol #Protocol of the device
            else:
                raise ValueError(f"Invalid protocol: {protocol}")
        except ValueError as e:
            self.logger.exception(e)


    @abstractmethod
    def init_nodes(self): #Init Nodes method (implementation declared in child classes. Nodes should be initialized on Device Initialization)
        pass 

    @abstractmethod
    def add_node(self): #Adds nodes to the devices Dictionary
        pass

    def stringify(self) -> str: #returns a string defining the device
        return "id:"+str(self.id)+";name:"+self.name+";url:"+self.url+";port:"+str(self.port)+";protocol:"+str(self.protocol)


    def enable(self): #Enable the device
        self.stop_event.clear()
        
    def disable(self): #Disable the device
        self.stop_event.set()

