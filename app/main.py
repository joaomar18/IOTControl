###########EXERTNAL IMPORTS############

import asyncio
import time
import threading
import multiprocessing as mp

#######################################

#############LOCAL IMPORTS#############


import controller.UADevice as ua

import data.general
import data.queues
import data.ws
import data.device

import db.database as db

import protocol.ua.client as uaClient

import util.ip

import ws.server as ws

import web.server as web

#######################################

def initProcesses(): #Initiates Threads to run in paralel with the application
    ##################PROCESSES##################
    t1 = mp.Process(target=web.run,  args=()) #Runs the Flask Webserver on a separate Thread
    t1.start()
    #############################################

async def send_messages(ws_server: ws.WebsocketsServer):
    while True:
        if ws_server.enabled:
            try:
                ws_server.messages.put_nowait([4, "plc_1", "U_L1", {1}, 230.45])
            except asyncio.QueueFull:
                pass
            await asyncio.sleep(0)
        else:
            await asyncio.sleep(2)

async def main(): #Main coroutine
    data.general.main_loop = asyncio.get_event_loop()
    
    data.ws.ws_server = ws.WebsocketsServer("127.0.0.1", 9001, data.queues.ws_server_send_queue, data.general.main_loop) #initializes a websockets server on localhost, port 9001 and passes it it's message queue to send
    #data.ws.ws_server = ws.WebsocketsServer(str(util.ip.get_local_ipv4_address()), 9001, data.queues.ws_server_send_queue, data.general.main_loop) #initializes a websockets server on localhost, port 9001 and passes it it's message queue to send
    device1 = ua.UADevice(id=1,name="plc_1",url="192.168.10.1",port=4840,event_loop=data.general.main_loop, send_queue=data.queues.ws_server_send_queue,nodes=data.device.get_UA_Energy_Analizer_Nodes())
    client1_parameters = uaClient.UAClientParameters(url=device1.url, port=device1.port, max_chunkcount=256, session_timeout=30000, max_messagesize=16777216, name=device1.name, description="Laboratorio de automacao")
    client1_subscription_parameters = uaClient.UASubscriptionParameters(250,600,50,65536,True,1)
    client1 = uaClient.UAClient(device1, client1_parameters, client1_subscription_parameters)
    data.device.add_device(client1)
    
    device2 = ua.UADevice(id=2, name="plc_2", url="192.168.0.5",port=4840, event_loop=data.general.main_loop, send_queue=data.queues.ws_server_send_queue, nodes=data.device.get_UA_Energy_Analizer_Nodes())
    client2_parameters = uaClient.UAClientParameters(url=device2.url, port=device2.port, max_chunkcount=256, session_timeout=30000, max_messagesize=16777216, name=device2.name, description="Laboratorio de eletronica")
    client2_subscription_parameters = uaClient.UASubscriptionParameters(250,600,50,65536,True,1)
    client2 = uaClient.UAClient(device2, client2_parameters, client2_subscription_parameters)
    data.device.add_device(client2)

    while True:
        await asyncio.sleep(2) #Sleeps for 2 seconds without stoping the event loop

if __name__ == "__main__": #Main application
    initProcesses()
    asyncio.run(main())