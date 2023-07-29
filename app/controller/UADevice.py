###########EXERTNAL IMPORTS############

import asyncio
import asyncua as ua

#######################################

#############LOCAL IMPORTS#############

from controller.device import *

#######################################

class UANode(Node):
    def __init__(self, node_name: str, name_space: str,sections: set): #init method (runs on object creation)
        super().__init__(node_name,sections) #init method for super class (Node)
        self.name_space = name_space #OPC UA namespace
        self.opc_ua_node = None #OPC UA Node object

    def set_opc_ua_node(self, opc_ua_node: ua.Node):
        self.opc_ua_node = opc_ua_node

class UADevice(Device):
    def __init__(self, id: int, name: str, url : str, port : int,event_loop: asyncio.AbstractEventLoop, send_queue: asyncio.Queue, nodes: set[UANode]): #init method (runs on object creation)
        super().__init__(id, name, url, port, Protocol.OPC_UA, event_loop, send_queue) #init method for super class (Device)
        self.nodes: dict[str, UANode] = dict() #initiates a empty dictionary
        self.init_nodes(nodes) #Initializes device nodes given in the constructor

    def init_nodes(self, nodes: set[UANode]): #Initites nodes with None value to subscribe in connection with the device
        for node in nodes:
            self.nodes[node.node_name] = node
            
    
    def add_node(self, node: UANode): #Adds nodes to the devices Dictionary
        self.nodes[node.node_name] = node
