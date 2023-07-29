function get_real_time_nodes(){
    let nodes = {};

    nodes["U_L1"] = new Field(document, "U_L1", document.getElementById("U_L1"),2,"V");
    nodes["I_L1"] = new Field(document, "I_L1", document.getElementById("I_L1"),2,"A");
    nodes["FP_L1"] = new Field(document, "FP_L1", document.getElementById("FP_L1"),2,"");
    nodes["P_L1"] = new Field(document, "P_L1", document.getElementById("P_L1"),3,"W");  
    nodes["Q_L1"] = new Field(document, "Q_L1", document.getElementById("Q_L1"),3,"VAr");  
    nodes["S_L1"] = new Field(document, "S_L1", document.getElementById("S_L1"),3,"VA");    

    nodes["U_L2"] = new Field(document, "U_L2", document.getElementById("U_L2"),2,"V");
    nodes["I_L2"] = new Field(document, "I_L2", document.getElementById("I_L2"),2,"A");
    nodes["FP_L2"] = new Field(document, "FP_L2", document.getElementById("FP_L2"),2,"");
    nodes["P_L2"] = new Field(document, "P_L2", document.getElementById("P_L2"),3,"W");  
    nodes["Q_L2"] = new Field(document, "Q_L2", document.getElementById("Q_L2"),3,"VAr");  
    nodes["S_L2"] = new Field(document, "S_L2", document.getElementById("S_L2"),3,"VA");

    nodes["U_L3"] = new Field(document, "U_L3", document.getElementById("U_L3"),2,"V");
    nodes["I_L3"] = new Field(document, "I_L3", document.getElementById("I_L3"),2,"A");
    nodes["FP_L3"] = new Field(document, "FP_L3", document.getElementById("FP_L3"),2,"");
    nodes["P_L3"] = new Field(document, "P_L3", document.getElementById("P_L3"),3,"W");  
    nodes["Q_L3"] = new Field(document, "Q_L3", document.getElementById("Q_L3"),3,"VAr");  
    nodes["S_L3"] = new Field(document, "S_L3", document.getElementById("S_L3"),3,"VA");

    nodes["P_T"] = new Field(document, "P_T", document.getElementById("P_T"),3,"W");
    nodes["Q_T"] = new Field(document, "Q_T", document.getElementById("Q_T"),3,"VAr");
    nodes["S_T"] = new Field(document, "S_T", document.getElementById("S_T"),3,"VA");
    nodes["FP_T"] = new Field(document, "FP_T", document.getElementById("FP_T"),2,"");

    nodes["U_L1_L2"] = new Field(document, "U_L1_L2", document.getElementById("U_L1_L2"),2,"V");
    nodes["U_L2_L3"] = new Field(document, "U_L2_L3", document.getElementById("U_L2_L3"),2,"V");
    nodes["U_L3_L1"] = new Field(document, "U_L3_L1", document.getElementById("U_L3_L1"),2,"V");
    nodes["Freq"] = new Field(document, "Freq", document.getElementById("Freq"),2,"Hz");

    return nodes;
}


function get_real_time_animation_nodes(){
    let nodes = {};
    nodes["I_L1"] = new Field(document, "i_l1_realtime_anim", document.getElementById("i_l1_realtime_anim"),2,"A");   
    nodes["I_L2"] = new Field(document, "i_l2_realtime_anim", document.getElementById("i_l2_realtime_anim"),2,"A");
    nodes["I_L3"] = new Field(document, "i_l3_realtime_anim", document.getElementById("i_l3_realtime_anim"),2,"A");
    return nodes;    
}

function get_consumption_nodes(){
    let nodes= {};

    nodes["P_L1"] = new Field(document, "P_L1", document.getElementById("P_L1"),3,"W");  
    nodes["Q_L1"] = new Field(document, "Q_L1", document.getElementById("Q_L1"),3,"VAr");  
    nodes["S_L1"] = new Field(document, "S_L1", document.getElementById("S_L1"),3,"VA");  

    nodes["P_L2"] = new Field(document, "P_L2", document.getElementById("P_L2"),3,"W");  
    nodes["Q_L2"] = new Field(document, "Q_L2", document.getElementById("Q_L2"),3,"VAr");  
    nodes["S_L2"] = new Field(document, "S_L2", document.getElementById("S_L2"),3,"VA");

    nodes["P_L3"] = new Field(document, "P_L3", document.getElementById("P_L3"),3,"W");  
    nodes["Q_L3"] = new Field(document, "Q_L3", document.getElementById("Q_L3"),3,"VAr");  
    nodes["S_L3"] = new Field(document, "S_L3", document.getElementById("S_L3"),3,"VA");

    nodes["P_T"] = new Field(document, "P_T", document.getElementById("P_T"),3,"W");
    nodes["Q_T"] = new Field(document, "Q_T", document.getElementById("Q_T"),3,"VAr");
    nodes["S_T"] = new Field(document, "S_T", document.getElementById("S_T"),3,"VA");

    return nodes;
}