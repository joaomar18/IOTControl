###########EXERTNAL IMPORTS############

#######################################

#############LOCAL IMPORTS#############

from controller.device import *
from controller.UADevice import *

#######################################

def get_UA_Energy_Analizer_Nodes() -> set[UANode]:
    ua_energy_analizer_nodes = set()
    #########L1 REAL TIME VALUES###########
    ua_energy_analizer_nodes.add(UANode(node_name="U_L1", name_space="ns=4;i=5", sections={1})) #Voltage L1
    ua_energy_analizer_nodes.add(UANode(node_name="I_L1", name_space="ns=4;i=6", sections={1})) #Current L1
    ua_energy_analizer_nodes.add(UANode(node_name="FP_L1", name_space="ns=4;i=7", sections={1})) #PF L1
    ua_energy_analizer_nodes.add(UANode(node_name="P_L1", name_space="ns=4;i=8", sections={1,2})) #Active Power L1
    ua_energy_analizer_nodes.add(UANode(node_name="Q_L1", name_space="ns=4;i=9", sections={1,2})) #Reactive Power L1
    ua_energy_analizer_nodes.add(UANode(node_name="S_L1", name_space="ns=4;i=10", sections={1,2})) #Aparent Power L1
    ua_energy_analizer_nodes.add(UANode(node_name="I_L1unit", name_space="ns=4;i=11", sections={1})) #Current L1 unit  (0: mA, 1: A)
    ua_energy_analizer_nodes.add(UANode(node_name="P_L1unit", name_space="ns=4;i=12", sections={1,2})) #Active Power L1 unit  (0: W, 1: kW)
    ua_energy_analizer_nodes.add(UANode(node_name="Q_L1unit", name_space="ns=4;i=13", sections={1,2})) #Reactive Power L1 unit  (0: VAr, 1: kVAr)
    ua_energy_analizer_nodes.add(UANode(node_name="S_L1unit", name_space="ns=4;i=14", sections={1,2})) #Aparent Power L1 unit  (0: VA, 1: kVA)
    #######################################
    #########L2 REAL TIME VALUES###########
    ua_energy_analizer_nodes.add(UANode(node_name="U_L2", name_space="ns=4;i=16", sections={1})) #Voltage L2
    ua_energy_analizer_nodes.add(UANode(node_name="I_L2", name_space="ns=4;i=17", sections={1})) #Current L2
    ua_energy_analizer_nodes.add(UANode(node_name="FP_L2", name_space="ns=4;i=18", sections={1})) #PF L2
    ua_energy_analizer_nodes.add(UANode(node_name="P_L2", name_space="ns=4;i=19", sections={1,2})) #Active Power L2
    ua_energy_analizer_nodes.add(UANode(node_name="Q_L2", name_space="ns=4;i=20", sections={1,2})) #Reactive Power L2
    ua_energy_analizer_nodes.add(UANode(node_name="S_L2", name_space="ns=4;i=21", sections={1,2})) #Aparent Power L2
    ua_energy_analizer_nodes.add(UANode(node_name="I_L2unit", name_space="ns=4;i=22", sections={1})) #Current L2 unit  (0: mA, 1: A)
    ua_energy_analizer_nodes.add(UANode(node_name="P_L2unit", name_space="ns=4;i=23", sections={1,2})) #Active Power L2 unit  (0: W, 1: kW)
    ua_energy_analizer_nodes.add(UANode(node_name="Q_L2unit", name_space="ns=4;i=24", sections={1,2})) #Reactive Power L2 unit  (0: VAr, 1: kVAr)
    ua_energy_analizer_nodes.add(UANode(node_name="S_L2unit", name_space="ns=4;i=25", sections={1,2})) #Aparent Power L2 unit  (0: VA, 1: kVA)
    #######################################
    #########L3 REAL TIME VALUES###########
    ua_energy_analizer_nodes.add(UANode(node_name="U_L3", name_space="ns=4;i=27", sections={1})) #Voltage L3
    ua_energy_analizer_nodes.add(UANode(node_name="I_L3", name_space="ns=4;i=28", sections={1})) #Current L3
    ua_energy_analizer_nodes.add(UANode(node_name="FP_L3", name_space="ns=4;i=29", sections={1})) #PF L3
    ua_energy_analizer_nodes.add(UANode(node_name="P_L3", name_space="ns=4;i=30", sections={1,2})) #Active Power L3
    ua_energy_analizer_nodes.add(UANode(node_name="Q_L3", name_space="ns=4;i=31", sections={1,2})) #Reactive Power L3
    ua_energy_analizer_nodes.add(UANode(node_name="S_L3", name_space="ns=4;i=32", sections={1,2})) #Aparent Power L3
    ua_energy_analizer_nodes.add(UANode(node_name="I_L3unit", name_space="ns=4;i=33", sections={1})) #Current L3 unit  (0: mA, 1: A)
    ua_energy_analizer_nodes.add(UANode(node_name="P_L3unit", name_space="ns=4;i=34", sections={1,2})) #Active Power L3 unit  (0: W, 1: kW)
    ua_energy_analizer_nodes.add(UANode(node_name="Q_L3unit", name_space="ns=4;i=35", sections={1,2})) #Reactive Power L3 unit  (0: VAr, 1: kVAr)
    ua_energy_analizer_nodes.add(UANode(node_name="S_L3unit", name_space="ns=4;i=36", sections={1,2})) #Aparent Power L3 unit  (0: VA, 1: kVA)
    #######################################
    ########TOTAL REAL TIME VALUES#########
    ua_energy_analizer_nodes.add(UANode(node_name="P_T", name_space="ns=4;i=47", sections={1,2})) #Total Active Power
    ua_energy_analizer_nodes.add(UANode(node_name="Q_T", name_space="ns=4;i=48", sections={1,2})) #Total Reactive Power
    ua_energy_analizer_nodes.add(UANode(node_name="S_T", name_space="ns=4;i=49", sections={1,2})) #Total Aparent Power
    ua_energy_analizer_nodes.add(UANode(node_name="FP_T", name_space="ns=4;i=50", sections={1})) #Total PF
    ua_energy_analizer_nodes.add(UANode(node_name="P_Tunit", name_space="ns=4;i=51", sections={1,2})) #Total Active Power unit (0: W, 1: kW)
    ua_energy_analizer_nodes.add(UANode(node_name="Q_Tunit", name_space="ns=4;i=52", sections={1,2})) #Total Reactive Power unit (0: VAr, 1: kVAr)
    ua_energy_analizer_nodes.add(UANode(node_name="S_Tunit", name_space="ns=4;i=53", sections={1,2})) #Total Aparent Power unit (0: VA, 1: kVA)
    #######################################
    #######COMPLEX REAL TIME VALUES########    
    ua_energy_analizer_nodes.add(UANode(node_name="U_L1_L2", name_space="ns=4;i=40", sections={1})) #Complex Voltage (L1-L2)
    ua_energy_analizer_nodes.add(UANode(node_name="U_L2_L3", name_space="ns=4;i=41", sections={1})) #Complex Voltage (L2-L3)
    ua_energy_analizer_nodes.add(UANode(node_name="U_L3_L1", name_space="ns=4;i=42", sections={1})) #Complex Voltage (L3-L1)
    ua_energy_analizer_nodes.add(UANode(node_name="Freq", name_space="ns=4;i=43", sections={1})) #Frequency
    #######################################
    ###########CONTROL/PARAMETERS##########  
    ua_energy_analizer_nodes.add(UANode(node_name="ModeManual", name_space="ns=4;i=57", sections={4})) #Manual Mode (ON/OFF)
    ua_energy_analizer_nodes.add(UANode(node_name="ModeAuto", name_space="ns=4;i=58", sections={4})) #Automatic Mode (ON/OFF)
    ua_energy_analizer_nodes.add(UANode(node_name="OrderManual", name_space="ns=4;i=62", sections={4})) #Manual Order (ON/OFF)
    #######################################
    ################PHYSICAL###############  
    ua_energy_analizer_nodes.add(UANode(node_name="OutputContactor", name_space="ns=4;i=63", sections={0})) #Output Contactor
    #######################################
    return ua_energy_analizer_nodes.copy()

devices : dict[str, Device] = dict() #data structure to hold all devices

def add_device(device: Device):
    devices[device.name] = device

