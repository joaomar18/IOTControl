async def decodeMessage(items: list):
    message_type = items[0] 
    # type of message: 
    # 1 -> Message to all clients (global parameter)
    # 2 -> Message to all clients (about a controller)
    # 3 -> Message to clients with same active controller
    # 4 -> Message to clients with same active section(s)
    message = ""
    if message_type == 1:
        parameter = str(items[1])
        value = str(items[2])
        message = str(message_type)+";"+parameter+";"+value
        return [message_type, message]
    
    elif message_type == 2:
        controller = str(items[1])
        parameter = str(items[2])
        value = str(items[3])
        message = str(message_type)+";"+controller+";"+parameter+";"+value
        return [message_type, message]
    
    elif message_type == 3:
        controller = str(items[1])
        parameter = str(items[2])
        value = str(items[3])
        message = str(message_type)+";"+controller+";"+parameter+";"+value
        return [message_type,controller, message]

    elif message_type == 4:
        controller = str(items[1])
        nodeName = str(items[2])
        nodeSections = items[3].copy()
        value = str(items[4])
        message = str(message_type)+";"+controller+";"+nodeName+";"+value
        return [message_type, controller, nodeName, nodeSections, message]
