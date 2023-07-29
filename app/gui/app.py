###########EXERTNAL IMPORTS############

import asyncio
import threading
import tkinter as tkt
from tkinter import ttk
import time

#######################################

#############LOCAL IMPORTS#############

import data.general
import data.ws
import data.device
import data.queues

import gui.handler as handler

import util.general

#######################################

class GUIApp():
    def __init__(self):
        self.app = tkt.Tk()
        self.app.geometry('600x600')
        self.app.resizable(False, False)
        self.device_name = ""
        self.update_device = False
        self.new_device_change = False
        self.websockets_send_queue_full = False
        self.last_full_time: float = time.time()
        self.init_widgets()
        self.update_thread = threading.Thread(target=self.start_update_handler, args=())
        self.update_thread.start()
    
    def run(self):
        self.app.mainloop() #Runs the Tkinter Gui application
    
    def start_update_handler(self):
        self.loop = asyncio.new_event_loop()
        self.loop.run_until_complete(self.update_handler())
        self.loop.close()

    async def update_handler(self):
        while True:
            await self.update_ws()
            await self.update_devices()
            await self.update_current_device()
            await asyncio.sleep(0.01)

    async def update_devices(self):
        for device in data.device.devices.values():
            if not device.stop_event.is_set() and device.connected:
                if data.device.state.get(device.name) != "ON":
                    data.device.state.update({device.name: "ON"})
                    info = "ON, " + "Date: " + util.general.get_date_time() + "\n"
                    data.device.history[device.name].insert(0, info)
                    if device.name == self.device_name:
                        self.new_device_change = True
            elif device.stop_event.is_set() and not device.connected:
                if data.device.state.get(device.name) != "OFF":
                    data.device.state.update({device.name: "OFF"})
                    info = "OFF, " + "Date: " + util.general.get_date_time() + "\n"
                    data.device.history[device.name].insert(0, info)
                    if device.name == self.device_name:
                        self.new_device_change = True
            else:
                if data.device.state.get(device.name) != "PENDING":
                    data.device.state.update({device.name: "PENDING"})
                    info = "PENDING, " + "Date: " + util.general.get_date_time() + "\n"
                    data.device.history[device.name].insert(0, info)
                    if device.name == self.device_name:
                        self.new_device_change = True                


    async def update_current_device(self):
        self.selected_device_name = self.selected_device.get()
        self.selected_device_name = self.selected_device_name[0:self.selected_device_name.find(":")]
        if self.device_name != self.selected_device_name:
            self.device_name = self.selected_device.get()
            self.device_name = self.device_name[0:self.device_name.find(":")]
            self.devices_state2.configure(state="normal")
            self.devices_state2.delete('1.0', 'end')
            for info in data.device.history[self.device_name]:
                self.devices_state2.insert("end", info)
            self.devices_state2.configure(state="disabled")
            self.update_device = True

        if self.update_device or self.new_device_change:
            if self.device_state_widget != None:
                self.device_state_widget.destroy()
            self.device_state_widget = tkt.Canvas(self.devices_frame2, width=30, height=30)
            x0, y0 = 5, 5
            x1, y1 = 25, 25
            if data.device.state[self.device_name] == "ON":
                self.device_state_widget.create_oval(x0, y0, x1, y1, fill="green")
            elif data.device.state[self.device_name] == "OFF":
                self.device_state_widget.create_oval(x0, y0, x1, y1, fill="red")  
            elif data.device.state[self.device_name] == "PENDING":
                self.device_state_widget.create_oval(x0, y0, x1, y1, fill="yellow")
                
            self.device_state_widget.grid(row=0, column=5, padx=10)
            self.device_state_widget.propagate(False)
            if self.new_device_change:

                self.devices_state2.configure(state="normal")
                self.devices_state2.insert("1.0", data.device.history[self.device_name][0])
                self.devices_state2.configure(state="disabled")
                self.new_device_change = False
            
            self.update_device = False


        

    async def update_ws(self):

        if(data.queues.ws_server_send_queue.full()):
            if not self.websockets_send_queue_full: 
                self.websockets_state2.configure(state="normal")
                self.last_full_time = time.time()
                self.websockets_state2.insert("1.0", "Send Messages Queue Overflow!, " + "Date: " + util.general.get_date_time() + "\n")
                self.websockets_state2.configure(state="disabled")
                self.websockets_send_queue_full = True
        else:
            if time.time() - self.last_full_time >= 2:
                self.websockets_send_queue_full = False

        if data.ws.ws_server.enabled and data.ws.ws_server.state: 
            if self.websockets_state != "ON":
                if self.websockets_state_widget != None:
                    self.websockets_state_widget.destroy()
                self.websockets_state_widget = tkt.Canvas(self.websockets_frame1, width=30, height=30)
                x0, y0 = 5, 5
                x1, y1 = 25, 25
                self.websockets_state_widget.create_oval(x0, y0, x1, y1, fill="green")                
                self.websockets_state_widget.grid(row=0, column=5, padx=10)
                self.websockets_state_widget.propagate(False)
                self.websockets_state = "ON"
                self.websockets_state2.configure(state="normal")
                self.websockets_state2.insert("1.0", "ON, " + "Date: " + util.general.get_date_time() + "\n")
                self.websockets_state2.configure(state="disabled")
            
        elif data.ws.ws_server.enabled == False and data.ws.ws_server.state == False:
            if self.websockets_state != "OFF":
                if self.websockets_state_widget != None:
                    self.websockets_state_widget.destroy()
                self.websockets_state_widget = tkt.Canvas(self.websockets_frame1, width=30, height=30)
                x0, y0 = 5, 5
                x1, y1 = 25, 25
                self.websockets_state_widget.create_oval(x0, y0, x1, y1, fill="red")                
                self.websockets_state_widget.grid(row=0, column=5, padx=10)
                self.websockets_state_widget.propagate(False)
                self.websockets_state = "OFF"
                self.websockets_state2.configure(state="normal")
                self.websockets_state2.insert("1.0", "OFF, " + "Date: " + util.general.get_date_time() + "\n")
                self.websockets_state2.configure(state="disabled")

        else:
            if self.websockets_state != "PENDING":
                if self.websockets_state_widget != None:
                    self.websockets_state_widget.destroy()
                self.websockets_state_widget = tkt.Canvas(self.websockets_frame1, width=30, height=30)
                x0, y0 = 5, 5
                x1, y1 = 25, 25
                self.websockets_state_widget.create_oval(x0, y0, x1, y1, fill="yellow")                
                self.websockets_state_widget.grid(row=0, column=5, padx=10)
                self.websockets_state_widget.propagate(False)
                self.websockets_state = "PENDING"
                self.websockets_state2.configure(state="normal")
                self.websockets_state2.insert("1.0", "PENDING, " + "Date: " + util.general.get_date_time() + "\n")
                self.websockets_state2.configure(state="disabled")


    def init_ws_widgets(self):

        self.websockets_state = ""
        self.websockets_state_widget: tkt.Canvas = None

        self.websockets_frame1 = tkt.Frame(self.app, pady=20)
        self.websockets_label = tkt.Label(self.websockets_frame1, text="Websockets server: ")
        self.websockets_start = tkt.Button(self.websockets_frame1, text="Start", command=handler.start_ws_server)
        self.websockets_stop = tkt.Button(self.websockets_frame1, text="Stop", command=handler.stop_ws_server)
        self.websockets_check_clients = tkt.Button(self.websockets_frame1, text = "See clients", command=lambda: handler.see_clients(self.app))

        
        
        
        self.websockets_frame2 = tkt.Frame(self.app, pady=20)
        self.websockets_frame_state = tkt.Frame(self.websockets_frame2)
        

        self.websockets_label2 = tkt.Label(self.websockets_frame_state, text="Histórico: ")
        self.websockets_state2 = tkt.Text(self.websockets_frame_state, height=2.5,width=60, state="disabled")


        self.websockets_label.grid(row=0, column=0, padx=10)
        self.websockets_start.grid(row=0, column=2, padx=5)
        self.websockets_stop.grid(row=0, column=3, padx=5)
        self.websockets_check_clients.grid(row=1, column=2, pady=5)


        self.websockets_label2.grid(row = 0, column=0, pady=10)
        self.websockets_state2.grid(row = 2, column=0, pady=10)


        self.websockets_frame1.pack()
        self.websockets_frame2.pack()
        self.websockets_frame_state.pack(expand=True, fill="both")

    def init_device_widgets(self):

        devices = data.device.devices.copy() #list of devices
        self.selected_device = tkt.StringVar() #Current Device string variable
        self.devices: list[str] = list()
        for key, value in devices.items():
            device_type = str(type(value))
            last_dot_index = device_type.rfind(".")
            last_gt_index = device_type.rfind("'")
            device_type = device_type[last_dot_index+1:last_gt_index]
            self.devices.append(key+":"+device_type)

        self.selected_device.set(self.devices[0])
        self.devices_frame1 = tkt.Frame(self.app, pady=20)
        self.devices_label = tkt.Label(self.devices_frame1, text="Device control")
        self.devices_list = ttk.Combobox(width=20,master=self.devices_frame1, values=self.devices,textvariable=self.selected_device, state="readonly")

        self.devices_label.grid(row=0, column=0, pady=5)
        self.devices_list.grid(row=1, column=0, pady=5)
        
        self.device_state_widget: tkt.Canvas = None

        self.devices_frame2 = tkt.Frame(self.app, pady=20)
        device_text = "Device " + self.selected_device.get() + ":"
        self.devices_label = tkt.Label(self.devices_frame2, text=device_text)
        self.devices_start = tkt.Button(self.devices_frame2, text="Start", command=lambda: handler.start_device(self.selected_device))
        self.devices_stop = tkt.Button(self.devices_frame2, text="Stop", command=lambda: handler.stop_device(self.selected_device))
        self.devices_frame3 = tkt.Frame(self.app, pady=20)
        self.devices_label2 = tkt.Label(self.devices_frame3, text="Histórico: ")
        self.devices_state2 = tkt.Text(self.devices_frame3, height=2.5,width=60, state="disabled")

        self.devices_list.bind("<<ComboboxSelected>>", lambda event: handler.device_changed(self.devices_label ,self.selected_device, event))

        self.devices_label.grid(row=0, column=0, padx=10)
        self.devices_start.grid(row=0, column=2, padx=5)
        self.devices_stop.grid(row=0, column=3, padx=5)


        self.devices_label2.grid(row = 0, column=0, pady=10)
        self.devices_state2.grid(row = 2, column=0, pady=10)

        self.devices_frame1.pack()
        self.devices_frame2.pack()
        self.devices_frame3.pack()

    def init_widgets(self):
        self.title = tkt.Label(self.app, text="IOT Controller")
        self.title.pack()
        self.init_ws_widgets()
        self.init_device_widgets()
        


async def main():
    app = GUIApp()
    app.run()

def run():
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main())
    loop.close()

