
class ImageObject{ //Classe para definir o objeto de uma imagem 
    constructor(centroid, area, perimeter, orientation, rgb_ratio){
        this.centroid = centroid;
        this.area = area;
        this.perimeter = perimeter;
        this.orientation = orientation;
        this.rgb_ratio = rgb_ratio;
    }
}

let active_objects = {};


class DefinedObject{ //Não utilizado (para definir objetos conhecidos)
    constructor(name, centroid_lims, area_lims, perimeter_lims, orientation_lims, red_ratio_lims, green_ratio_lims, blue_ratio_lims){
        this.name = name;
        this.centroid_lims = centroid_lims;
        this.area_lims = area_lims;
        this.perimeter_lims = perimeter_lims;
        this.orientation_lims = orientation_lims;
        this.red_ratio_lims = red_ratio_lims;
        this.green_ratio_lims = green_ratio_lims;
        this.blue_ratio_lims = blue_ratio_lims;
    }
}

let defined_objects = {};
