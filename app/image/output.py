###########EXERTNAL IMPORTS############

import skimage.io
import numpy as np
from skimage import img_as_ubyte, img_as_float
from PIL import Image, ImageDraw
from skimage.draw import rectangle_perimeter

#######################################

#############LOCAL IMPORTS#############

from image.properties import *

#######################################


def save_image(image): #Guarda a imagem processada (imagem de saída) no diretorio D:/IOT/Trabalho_Pratico/appV4/static/image_process/img/ com o nome output.png para ser visivel no servidor
    file_path = "D:/IOT/Trabalho_Pratico/appV4/static/image_process/img/" + "output.png"
    uint_image = img_as_ubyte(image)
    skimage.io.imsave(file_path, uint_image)

def get_bbox_in_image(input_image, image_objects: set[ImageObject]): #Evidencia os objetos encontrados na imagem rgb com base nos objetos processados em image_objects
    image_with_bbox = np.copy(input_image)
    i = 0
    for image_object in image_objects:
        bbox = image_object.bbox 
        rr, cc = rectangle_perimeter(start=(bbox[0], bbox[1]), end=(bbox[2], bbox[3]), shape=image_with_bbox.shape, clip=True) #Retângulo para circundar objetos 
        image_with_bbox[rr, cc] = (0.0, 0.0, 1.0)  # Muda o valor dos pixeis na imagem para azul
    return image_with_bbox

def draw_text(image, text, position): #Função nao utilizada
    image_pil = Image.fromarray((image * 255).astype(np.uint8))
    draw = ImageDraw.Draw(image_pil)
    draw.text(position, text, fill=(0, 255, 0))  # Set RGB value to green
    return np.array(image_pil) / 255.0
