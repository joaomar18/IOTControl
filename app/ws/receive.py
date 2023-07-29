###########EXERTNAL IMPORTS############



#######################################

#############LOCAL IMPORTS#############

import data.device as devices

#######################################


async def processMessage(message:str):
    elements = message.split(";")
    name = elements[0]
    if name != "ws_client":
        message_type = elements[1]
        data = elements[2]
        message_out = [message_type, data]
        await devices.devices[name].messages.put(message_out)
        
