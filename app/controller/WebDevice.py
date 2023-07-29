###########EXERTNAL IMPORTS############

import asyncio
import asyncua as ua
import matplotlib as plt

#######################################

#############LOCAL IMPORTS#############

from image.input import *
from image.output import *
from image.properties import *
from controller.device import *

#######################################

class WebDevice(Device):
    def __init__(self, id: int, name: str, url : str, port : int,event_loop: asyncio.AbstractEventLoop, send_queue: asyncio.Queue): #Construtor (corre na criação do objeto)
        super().__init__(id, name, url, port, Protocol.WEB, event_loop, send_queue) #Método de construção para a classe pai (Device)
        self.input_image = None #Imagem de Entrada
        self.binary_image = None #Imagem Binária
        self.input_image_objects = None #Objetos da imagem de entrada
        self.start()
    
    def init_nodes(self): #WebDevice não implementa init_nodes
        pass 

    def add_node(self): #WebDevice não implementa add_node
        pass

    def start(self): #Método para iniciar o dispositivo (neste caso a comunicação com a aplicação)
        with self.start_lock:
            if self.stop_event.is_set():
                self.enable()
                self.receiver_task = self.event_loop.create_task(self.receiver())
                self.connected = True
    
    def stop(self): #Método para parar o dispositivo
        with self.stop_lock:
            if not self.stop_event.is_set():
                self.receiver_task.cancel()
                print("Closing the connection with Web Device %s in URL: %s, Port: %d" % (self.name, self.url, self.port))
                self.connected = False              
                self.disable()
    
    async def handler_received_message(self, message: list[str]):
        print(message)
        if(message[0] == "new_feed"):
            self.input_image = get_image(message[1]) #A string contida na message[1] contem o nome da imagem a ler
            self.rgb_image = get_image_rgb(self.input_image) #Certifica - se que a imagem a ler não é rgba, se for, transforma - a para rgb
            self.gray_scale_image = get_image_grayscale(self.rgb_image) #Converte a imagem rgb para escala de cinza
            self.image_equalized = get_image_equalized(self.gray_scale_image) #Equaliza a imagem (para evidenciar os contornos)
            self.binary_image = get_binary_image(self.image_equalized) #Obtem a imagem binaria (0 ou 1)
            self.contours_image = get_contours_image(self.binary_image, 21) #Obtem os contornos da imagem (para identificacao de objetos)
            self.closed_image = get_closed_image(self.contours_image, 3) #Fecha a imagem (Elimina pequenas imperfeicoes na imagem com contornos)
            self.filled_image = get_image_filled(self.closed_image) #Preenche os objetos na imagem, de maneira que não existam objetos dentro de outros
            self.image_objects = get_objects_in_image(self.filled_image,self.rgb_image, 0.01) #Obtem os objetos presentes na imagem
            self.image_with_bbox = get_bbox_in_image(self.rgb_image, self.image_objects) #Obtem a imagem rgb com os objetos circundados (retangulo azul)
            save_image(self.image_with_bbox) #Guarda imagem no servidor para a aplicação conseguir aceder
            i = 0
            message = [2, self.name, "new_frame", "true"] #Mensagem para notificar a aplicação que a informação de uma imagem vai ser recebida
            await self.send_queue.put(message)
            for object in self.image_objects:
                i=i+1
                message = [2, self.name, "image_object_prop"+str(i), object.object_string()] #Mensagem enviada por cada objeto encontrado na imagem
                await self.send_queue.put(message)
            message = [2, self.name, "frame_processed", "true"] #Mensagem para notificar a aplicação que a informação da imagem foi completada
            await self.send_queue.put(message)

    async def receiver(self):
        while not self.stop_event.is_set():
            try:
                message: list[str] = await self.messages.get() #Método que recebe mensagens da aplicação
                await self.handler_received_message(message)
            except Exception as e:
                print("Exception ocurred while reading messages from queue on device %s: %s" % (self.name, e))

