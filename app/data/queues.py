###########EXERTNAL IMPORTS############

import asyncio
import queue

#######################################

#############LOCAL IMPORTS#############



#######################################


ws_server_send_queue: asyncio.Queue = asyncio.Queue(maxsize=1000) #Queue to use for sending messages to websocekts server