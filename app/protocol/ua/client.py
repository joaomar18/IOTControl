###########EXERTNAL IMPORTS############

import asyncio
import asyncua as ua
from asyncua import ua as opcua

#######################################

#############LOCAL IMPORTS#############

from controller.UADevice import *
from data.hour_periods import *

#######################################


class UAClientParameters():
    def __init__(self,url: str, port: int, max_chunkcount: int, session_timeout: int, max_messagesize: int, name: str, description: str):
        self.url = url
        self.port = port
        self.max_chunkcount = max_chunkcount
        self.session_timeout = session_timeout
        self.max_messagesize = max_messagesize
        self.name = name
        self.description = description

class UASubscriptionParameters():
    def __init__(self, publish_interval: int, lifetime_count: int, maxkeepalive_count: int, maxnotificationper_publish: int, publish_enabled: bool, priority: int):
        self.publish_interval = publish_interval
        self.lifetime_count = lifetime_count
        self.maxkeepalive_count = maxkeepalive_count
        self.maxnotificationper_publish = maxnotificationper_publish
        self.publish_enabled = publish_enabled
        self.priority = priority
        self.subscriptionParameters = opcua.CreateSubscriptionParameters(self.publish_interval, self.lifetime_count, self.maxkeepalive_count, self.maxnotificationper_publish, self.publish_enabled, self.priority)
    
class UAClient(UADevice):
    def __init__(self, device: UADevice, client_parameters: UAClientParameters, subscription_parameters: UASubscriptionParameters):
        self.__dict__ = device.__dict__.copy()
        self.client_parameters = client_parameters
        self.subscription_parameters = subscription_parameters
        self.client = ua.Client("opc.tcp://"+self.client_parameters.url+":"+str(self.client_parameters.port))
        self.subscription = None
        self.handler = SubHandler(self.client_parameters.name, self.nodes, self.send_queue)
        self.start()
        
    def start(self):
        with self.start_lock:
            if self.stop_event.is_set():
                self.enable()
                self.main_task = self.event_loop.create_task(self.main())
                self.receiver_task = self.event_loop.create_task(self.receiver())
    
    def stop(self):
        with self.stop_lock:
            if not self.stop_event.is_set():
                self.main_task.cancel()
                self.receiver_task.cancel()
                print("Closing the connection with UA client %s in URL: %s, Port: %d" % (self.name, self.url, self.port))
                self.connected = False              
                self.event_loop.create_task(self.send_queue.put([2, self.name, "connection", "OFF"]))
                self.disable()
                self.clear_send_queue()

    async def main(self):
        while not self.stop_event.is_set():
            try:
                async with self.client:
                    await self.connect()
                    self.connected = True
                    await self.send_queue.put([2, self.name, "connection", "ON"])
                    while True:
                        await asyncio.sleep(2)
                        await self.client.check_connection()  # Throws an exception if the connection is lost
            except (ConnectionError, opcua.UaError) as e:
                if self.connected:
                    print("Connection lost: %s" % (e))
                    self.connected = False
                    await self.send_queue.put([2, self.name, "connection", "OFF"])
                await asyncio.sleep(2)
                print("Trying to reconnect to UA client %s in URL: %s, Port: %d" % (self.name, self.url, self.port))
            except Exception as e:
                if self.connected:
                    try:
                        await self.disconnect()
                    except Exception as e:
                        pass
                    print(f"Connection lost: %s" % (e))
                    self.connected = False
                    await self.send_queue.put([2, self.name, "connection", "OFF"])
                await asyncio.sleep(2)
                print("Trying to reconnect to UA client %s in URL: %s, Port: %d" % (self.name, self.url, self.port))

    async def handler_received_message(self, message: list[str]):
        if(message[0] == "update_section"):
            if self.connected:
                updated_section = int(message[1])
                await self.update_section(updated_section)
        elif(message[0] == "manual_button"):
            if(message[1] == "true"):
                command = True
            elif(message[1] == "false"):
                command = False
            await self.send_to_controller(ua_node="OrderManual",value=command,data_type="bool")
        elif(message[0] == "manual_selector"):
            if(message[1] == "true"):
                command = True
            elif(message[1] == "false"):
                command = False
            await self.send_to_controller(ua_node="ModeManual",value=command,data_type="bool")            
        elif(message[0] == "info"):
            if(message[1] == "ask"): #get initial info
                await self.give_info()
                await self.update_section(0) #update global section
        elif(message[0] == "add_hour_period"):
            new_hour_period = HourPeriod()
            message_content = message[1].split(",")
            for content in message_content:
                message_type = content[:content.find(":")]
                message_info = content[content.find(":")+1:]
                if(message_type == "day_of_week"):
                    new_hour_period.set_day_of_week(message_info)
                elif(message_type == "initial_hour_period"):
                    new_hour_period.set_initial_period(message_info)
                elif(message_type == "final_hour_period"):
                    new_hour_period.set_final_period(message_info)
            existing_hour_periods = get_hour_periods_from_list(self.database.get_day_hour_periods(new_hour_period.day_of_week))
            new_hour_period_str = [new_hour_period.initial_period, new_hour_period.final_period]
            hour_periods_relation = get_hour_periods_relation(new_hour_period_str, existing_hour_periods)
            print(hour_periods_relation)
            #enviar periodos horarios com limite ativo de energia ativa ou reativa com relação com o novo periodo
            await self.send_queue.put([4, self.name, "add_hour_period_rel", {1,2,3,4,5}, str(hour_periods_relation)])
            #self.database.insert_hour_period(new_hour_period)
            #print(new_hour_period.stringify())

        elif(message[0] == "remove_hour_period"):
            remove_period = HourPeriod()
            message_content = message[1].split(",")
            for content in message_content:
                message_type = content[:content.find(":")]
                message_info = content[content.find(":")+1:]
                if(message_type == "day_of_week"):
                    remove_period.set_day_of_week(message_info)
                elif(message_type == "initial_hour_period"):
                    remove_period.set_initial_period(message_info)
                elif(message_type == "final_hour_period"):
                    remove_period.set_final_period(message_info)
            print(remove_period.stringify())

    async def receiver(self):
        while not self.stop_event.is_set():
            try:
                message: list[str] = await self.messages.get() #get's messages from the asyncio Queue
                await self.handler_received_message(message)
            except Exception as e:
                print("Exception ocurred while reading messages from queue on device %s: %s" % (self.name, e))


    def clear_send_queue(self): #Clear send messages queue
        size = self.messages.qsize() #size of the send messages queue
        for i in range(size): #clears the send queue of any message
            self.messages.get_nowait()

    async def connect(self):
        self.subscription = await self.client.create_subscription(self.subscription_parameters.subscriptionParameters, self.handler)    
        await self.subscribe()

    async def disconnect(self):
        await self.client.close_session() #disconnecting from the client will destroy all subscriptions

    
    async def subscribe(self):
        uaNodes = []
        for node in self.nodes.values():
                uaNode = self.client.get_node(node.name_space)
                node.set_opc_ua_node(uaNode)
                uaNodes.append(uaNode)
        await self.subscription.subscribe_data_change(uaNodes)

    async def update_section(self, updated_section):
        for node in self.nodes.values():
            for section in node.sections:
                if section == updated_section:
                    message = [4, self.name, node.node_name, node.sections, node.value]
                    await self.send_queue.put(message)
                    break

    async def give_info(self):
        if self.connected:
            await self.send_queue.put([2, self.name, "connection", "ON"])
        else:
            await self.send_queue.put([2, self.name, "connection", "OFF"])

    async def send_to_controller(self, ua_node:str, value, data_type):
        variant_type = None
        if(data_type == "bool"):
            variant_type = opcua.VariantType.Boolean
        elif(data_type == "int"):
            variant_type = opcua.VariantType.Int32
        elif(data_type == "double"):
            variant_type = opcua.VariantType.Double
        opc_object = opcua.DataValue(opcua.Variant(value, variant_type))
        await self.nodes[ua_node].opc_ua_node.write_value(opc_object)

class SubHandler:
    def __init__(self,name: str, nodes: dict[str ,UANode], send_queue: asyncio.Queue):
        self.name = name
        self.nodes = nodes
        self.send_queue = send_queue

    def datachange_notification(self, nodeIn: ua.Node, val, data):
        for node in self.nodes.values():
            if node.opc_ua_node == nodeIn:
                node.set_value(val)
                try:
                    message = [4, self.name, node.node_name, node.sections, node.value]
                    self.send_queue.put_nowait(message) #[controller name, node name, node sections, node value]
                except Exception as e:
                    print("Erro a enviar para thread websockets sender: ", e)
                return


    def event_notification(self, event: opcua.EventNotificationList):
        pass

    def status_change_notification(self, status: opcua.StatusChangeNotification):
        pass