###########EXERTNAL IMPORTS############

import matplotlib.pyplot as plt
from skimage import img_as_float
from skimage.measure import label, regionprops
import skimage.color
from skimage.filters import threshold_otsu
import skimage.morphology as mf
from skimage import exposure
from skimage.filters import threshold_local
from scipy import ndimage

#######################################

#############LOCAL IMPORTS#############



#######################################

def get_image(file_name: str): #Obtém imagem do diretorio de imagens no servidor D:/IOT/Trabalho_Pratico/appV4/app/image/images/
    file_full_path :str = "D:/IOT/Trabalho_Pratico/appV4/app/image/images/"+file_name
    return img_as_float(plt.imread(file_full_path)) #Função retorna a imagem com o brilho dos pixeis definido em formato real

def get_image_rgb(image): #Se a imagem tiver 4 dimensoes (imagem rgba) tranforma a para uma imagem em 3 dimensoes (rgb)
    if image.shape[-1] == 4:
        return skimage.color.rgba2rgb(image)
    else:
        return image
    
def get_image_grayscale(image): #Obtém a imagem em escala de cinza
    return skimage.color.rgb2gray(image)

def get_image_equalized(image): #Obtém a imagem equalizada (intensifica as diferenças de brilho para contornos serem mais facilmente identificados)
    return exposure.equalize_hist(image)

def get_binary_image(image): #Obtém imagem binaria atraves do metodo de otsu
    m = threshold_otsu(image)
    return image > m

def get_contours_image(image, bsize: int): #Obtém os contornos da imagem
    F = threshold_local(image, block_size=bsize, method="mean")
    aux_image = image > F - 0.01
    return 1 - aux_image

def get_closed_image(image, bsize): #Obtém a imagem fechada, utilizando a funcao closing do pacote morphology da libraria skimage. Utiliza um disco com um tamanho selecionavel em argumento para o efeito
    fp = mf.disk(bsize)
    return mf.closing(image, footprint=fp)

def get_image_filled(image): #Obtém a imagem com os objetos preenchidos
    image_array = ndimage.binary_fill_holes(image)
    return skimage.img_as_ubyte(image_array)