###########EXERTNAL IMPORTS############

import asyncio
import queue
import sqlite3

#######################################

#############LOCAL IMPORTS#############



#######################################

class Database():
    def __init__(self):
        self.connection = sqlite3.connect('iot_app.db')

    def table_exists(self, table_name):
        try:
            cursor = self.connection.cursor()

            # Check if the table exists
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
            result = cursor.fetchone()

            if result is not None:
                return True
            else:
                return False

        except sqlite3.Error as e:
            print("Error:", e)
            return False

        finally:
            if self.connection:
                self.connection.close()
