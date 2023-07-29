function add_object_menu(){
    document.getElementById("new-object").style.display = "flex";
}
let close_button = document.getElementById("close_button_new_object");

close_button.addEventListener("click", function() {
    document.getElementById("new-object").style.display = "none";
});


function new_object_submit(){

    let object_name = document.getElementById("new_object_name").value;

    let min_centroid_width = document.getElementById("min_centroid_width").value;
    let max_centroid_width = document.getElementById("max_centroid_width").value;
    let max_centroid = document.getElementById("max_centroid").value; 

    let min_area = document.getElementById("min_area").value;
    let max_area = document.getElementById("max_area").value; 

    let min_perimeter = document.getElementById("min_perimeter").value;
    let max_perimeter = document.getElementById("max_perimeter").value; 

    let min_orientation = document.getElementById("min_orientation").value;
    let max_orientation = document.getElementById("max_orientation").value; 

    let min_red_ratio = document.getElementById("min_red_ratio").value;
    let max_red_ratio = document.getElementById("max_red_ratio").value; 

    let min_green_ratio = document.getElementById("min_green_ratio").value;
    let max_green_ratio = document.getElementById("max_green_ratio").value; 

    let min_blue_ratio = document.getElementById("min_blue_ratio").value;
    let max_blue_ratio = document.getElementById("max_blue_ratio").value;  

    let centroid_lims = [Number(min_centroid), Number(max_centroid)];
 
    let area_lims = [Number(min_area), Number(max_area)];

    let perimeter_lims = [Number(min_perimeter), Number(max_perimeter)];

    let orientation_lims = [Number(min_orientation), Number(max_orientation)];

    let red_ratio_lims = [Number(min_red_ratio), Number(max_red_ratio)];

    let green_ratio_lims = [Number(min_green_ratio), Number(max_green_ratio)];

    let blue_ratio_lims = [Number(min_blue_ratio), Number(max_blue_ratio)];

    defined_objects[object_name] = new DefinedObject(object_name, centroid_lims, area_lims, perimeter_lims, orientation_lims, red_ratio_lims, green_ratio_lims, blue_ratio_lims);

}