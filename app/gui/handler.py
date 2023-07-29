###########EXERTNAL IMPORTS############

import asyncio
import tkinter as tkt

#######################################

#############LOCAL IMPORTS#############

import data.general
import data.queues
import data.device
import data.ws
import util.general

#######################################

def stop_ws_server():
    #asyncio.run_coroutine_threadsafe(data.queues.ws_server_send_queue.put([1, "PLC_1", "ON"]), data.general.main_loop)
    data.ws.ws_server.stop()


def start_ws_server():
    data.ws.ws_server.start()
    #data.ws.ws_server.start()
    #asyncio.get_event_loop().call_soon_threadsafe(data.ws.ws_server.start)
    #data.ws.ws_server.start()

def stop_device(selected_device: tkt.StringVar):
    device = selected_device.get()
    device = device[0:device.find(":")]
    data.device.devices[device].stop()

def start_device(selected_device: tkt.StringVar):
    device = selected_device.get()
    device = device[0:device.find(":")]
    data.device.devices[device].start()

def device_changed(devices_label: tkt.Label ,selected_device: tkt.StringVar, event):
    device_text = "Device " + selected_device.get() + ":"
    devices_label.configure(text=device_text)

def see_clients(app: tkt.Tk):
    new_window = tkt.Toplevel(app)
    new_window.title('Websockets clients')
    new_window.geometry('300x300')
    label = tkt.Label(new_window, text='Clients: ')
    label.pack()