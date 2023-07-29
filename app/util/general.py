###########EXERTNAL IMPORTS############

from datetime import datetime

#######################################


def get_date_time() -> str:
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")
    return current_time
