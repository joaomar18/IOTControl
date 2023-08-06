###########EXERTNAL IMPORTS############


import threading
import sqlite3

#######################################

#############LOCAL IMPORTS#############

from data.hour_periods import *

#######################################

class Database():
    def __init__(self, name):
        self.name = name
        self.hour_periods_lock = threading.Lock()
        self.check_tables()

    def open_connection(self) -> sqlite3.Connection:
        return sqlite3.connect(self.name)

    def get_hour_periods(self):
        with self.hour_periods_lock:
            conn = self.open_connection()
            cursor = conn.cursor()
            try:
                if self.table_exists(cursor, "HOUR_PERIODS"):
                    cursor.execute("SELECT DAY_OF_WEEK, INIT, END, ACTIVE_LIMIT, REACTIVE_LIMIT, ACTIVE_UNIT, REACTIVE_UNIT, ACTIVE_LIMIT_ENABLED, REACTIVE_LIMIT_ENABLED from HOUR_PERIODS")
                    hour_periods = list()
                    for row in cursor:
                        active_energy_limit_enabled_processed = None
                        reactive_energy_limit_enabled_processed = None
                        if row[7] == 1:
                            active_energy_limit_enabled_processed = True
                        elif row [7] == 0:
                            active_energy_limit_enabled_processed = False

                        if row[8] == 1:
                            reactive_energy_limit_enabled_processed = True
                        elif row[8] == 0:
                            reactive_energy_limit_enabled_processed = False
                        new_hour_period = HourPeriod()
                        new_hour_period.set_day_of_week(row[0])
                        new_hour_period.set_initial_period(row[1])
                        new_hour_period.set_final_period(row[2])
                        new_hour_period.set_active_energy_limit(row[3])
                        new_hour_period.set_reactive_energy_limit(row[4])
                        new_hour_period.set_active_energy_limit_unit(row[5])
                        new_hour_period.set_reactive_energy_limit_unit(row[6])
                        new_hour_period.set_active_energy_limit_enabled(active_energy_limit_enabled_processed)
                        new_hour_period.set_reactive_energy_limit_enabled(reactive_energy_limit_enabled_processed)
                        hour_periods.append(new_hour_period)
                    return hour_periods
                else:
                    return 
            except Exception as e:
                print("Exception Ocurred while trying to get hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()
    

    def get_day_hour_periods(self, day: str):
        with self.hour_periods_lock:
            conn = self.open_connection()
            cursor = conn.cursor()
            try:
                if self.table_exists(cursor, "HOUR_PERIODS"):
                    cursor.execute("SELECT * FROM HOUR_PERIODS WHERE DAY_OF_WEEK = ?", [day])
                    hour_periods = list()
                    for row in cursor:
                        active_energy_limit_enabled_processed = None
                        reactive_energy_limit_enabled_processed = None
                        if row[7] == 1:
                            active_energy_limit_enabled_processed = True
                        elif row [7] == 0:
                            active_energy_limit_enabled_processed = False

                        if row[8] == 1:
                            reactive_energy_limit_enabled_processed = True
                        elif row[8] == 0:
                            reactive_energy_limit_enabled_processed = False
                        new_hour_period = HourPeriod()
                        new_hour_period.set_day_of_week(row[0])
                        new_hour_period.set_initial_period(row[1])
                        new_hour_period.set_final_period(row[2])
                        new_hour_period.set_active_energy_limit(row[3])
                        new_hour_period.set_reactive_energy_limit(row[4])
                        new_hour_period.set_active_energy_limit_unit(row[5])
                        new_hour_period.set_reactive_energy_limit_unit(row[6])
                        new_hour_period.set_active_energy_limit_enabled(active_energy_limit_enabled_processed)
                        new_hour_period.set_reactive_energy_limit_enabled(reactive_energy_limit_enabled_processed)
                        hour_periods.append(new_hour_period)
                    return hour_periods
                else:
                    return 
            except Exception as e:
                print("Exception Ocurred while trying to get hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()
            
    
    def insert_hour_period(self, hour_period: HourPeriod):
        with self.hour_periods_lock:
            conn = self.open_connection()
            cursor = conn.cursor()
            try:
                if self.table_exists(cursor, "HOUR_PERIODS"):
                    insert_query = """INSERT INTO HOUR_PERIODS
                          (DAY_OF_WEEK, INIT, END, ACTIVE_LIMIT, REACTIVE_LIMIT, ACTIVE_UNIT, REACTIVE_UNIT, ACTIVE_LIMIT_ENABLED, REACTIVE_LIMIT_ENABLED) 
                           VALUES 
                          (?, ?, ?, ?, ?, ?, ?, ?, ?)"""
                    active_energy_limit_enabled_processed = None
                    reactive_energy_limit_enabled_processed = None
                    if(hour_period.active_energy_limit_enabled):
                        active_energy_limit_enabled_processed = 1
                    else:
                        active_energy_limit_enabled_processed = 0
                    if(hour_period.reactive_energy_limit_enabled):
                        reactive_energy_limit_enabled_processed = 1
                    else:
                        reactive_energy_limit_enabled_processed = 0

                    data = (hour_period.day_of_week, hour_period.initial_period, hour_period.final_period, hour_period.active_energy_limit, hour_period.reactive_energy_limit,hour_period.active_energy_limit_unit, hour_period.reactive_energy_limit_unit, active_energy_limit_enabled_processed, reactive_energy_limit_enabled_processed)
                    cursor.execute(insert_query, data)
                    conn.commit()
                else:
                    return 
            except Exception as e:
                print("Exception Ocurred while trying to insert hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()


    def check_tables(self):
        self.create_hour_periods_table()


    def create_hour_periods_table(self):
        with self.hour_periods_lock:
            conn = self.open_connection()
            cursor = conn.cursor()
            try:
                if not self.table_exists(cursor, "HOUR_PERIODS"):
                    cursor.execute('''CREATE TABLE HOUR_PERIODS
                    (DAY_OF_WEEK   TEXT    NOT NULL,
                    INIT           TEXT    NOT NULL,
                    END            TEXT    NOT NULL,
                    ACTIVE_LIMIT   REAL    ,
                    REACTIVE_LIMIT REAL    ,
                    ACTIVE_UNIT    TEXT    NOT NULL,
                    REACTIVE_UNIT  TEXT    NOT NULL,
                    ACTIVE_LIMIT_ENABLED   INT    NOT NULL,
                    REACTIVE_LIMIT_ENABLED INT    NOT NULL);''')
            except Exception as e:
                print("Exception Ocurred while trying to create table hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()

    


    def table_exists(self, cursor, table_name):
        try:
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
            result = cursor.fetchone()

            if result is not None:
                return True
            else:
                return False

        except sqlite3.Error as e:
            print("Error:", e)
            return False
