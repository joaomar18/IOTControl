###########EXERTNAL IMPORTS############

import numpy as np
import matplotlib.pyplot as plt
from skimage import img_as_float
from skimage.measure import label, regionprops
from skimage.draw import circle_perimeter

#######################################

#############LOCAL IMPORTS#############



#######################################

class ImageObject(): #Classe que contem informação dos objetos encontrados
    def __init__(self, image, centroid, area, perimeter, bbox, orientation, rgb_ratio: list[float]):
        self.image = image #Imagem do objeto
        self.centroid = centroid #Centróide
        self.area = area #Área
        self.perimeter = perimeter #Perímetro
        self.bbox = bbox #Caixa
        self.orientation = orientation #Orientação do objeto
        self.rgb_ratio = rgb_ratio #Rácio RGB
    
    def object_string(self) -> str:
        return "centroid:"+str(self.centroid)+";"+"area:"+str(self.area)+";"+"perimeter:"+str(self.perimeter)+";"+"orientation:"+str(self.orientation)+";"+"rgb_ratio:"+str(self.rgb_ratio)

def get_objects_in_image(image, rgb_image, min_area_ratio): #Funcao para obter objetos presentes na imagem utilizando a função regionprops da biblioteca skimage
    height = image.shape[0]
    width = image.shape[1]
    image_area = height*width
    objects: set[ImageObject] = set()
    L = label(image)
    properties = regionprops(L, intensity_image=rgb_image)
    for p in properties:
        rgb_ratio: list[float] = list()
        rgb_ratio.append(np.sum(p.intensity_image[:,:,0])/np.sum(p.area))
        rgb_ratio.append(np.sum(p.intensity_image[:,:,1])/np.sum(p.area))
        rgb_ratio.append(np.sum(p.intensity_image[:,:,2])/np.sum(p.area))
        object_image = rgb_image[p.bbox[0]:p.bbox[2], p.bbox[1]:p.bbox[3], :]
        new_object = ImageObject(image=object_image, centroid=p.centroid, area=p.area, perimeter=p.perimeter, bbox=p.bbox, orientation=p.orientation, rgb_ratio=rgb_ratio)
        area_ratio = p.area/image_area
        print(area_ratio)
        if(area_ratio > min_area_ratio):
            objects.add(new_object)
    return objects
