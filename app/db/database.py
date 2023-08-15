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
                    cursor.execute("SELECT DAY_OF_WEEK, INIT, END from HOUR_PERIODS")
                    hour_periods = list()
                    for row in cursor:
                        new_hour_period = HourPeriod()
                        new_hour_period.set_day_of_week(row[0])
                        new_hour_period.set_initial_period(row[1])
                        new_hour_period.set_final_period(row[2])
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
                        new_hour_period = HourPeriod()
                        new_hour_period.set_day_of_week(row[0])
                        new_hour_period.set_initial_period(row[1])
                        new_hour_period.set_final_period(row[2])
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
                          (DAY_OF_WEEK, INIT, END) 
                           VALUES 
                          (?, ?, ?)"""
                    data = (hour_period.day_of_week, hour_period.initial_period, hour_period.final_period)
                    cursor.execute(insert_query, data)
                    conn.commit()
                else:
                    return 
            except Exception as e:
                print("Exception Ocurred while trying to insert hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()
    
    def remove_hour_period(self, hour_period: HourPeriod):
        with self.hour_periods_lock:
            conn = self.open_connection()
            cursor = conn.cursor()
            try:
                if self.table_exists(cursor, "HOUR_PERIODS"):
                    remove_query = """DELETE FROM HOUR_PERIODS WHERE DAY_OF_WEEK=? AND INIT=? AND END=?"""
                    data = (hour_period.day_of_week, hour_period.initial_period, hour_period.final_period)
                    cursor.execute(remove_query, data)
                    conn.commit()
                else:
                    return 
            except Exception as e:
                print("Exception Ocurred while trying to remove hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()


    def insert_hour_period_update_db(self, hour_period: HourPeriod, hour_periods_with_relation: list[list]):
        with self.hour_periods_lock:
            conn = self.open_connection()
            cursor = conn.cursor()
            try:
                if self.table_exists(cursor, "HOUR_PERIODS"):
                    hour_period_min = hour_period.initial_period
                    hour_period_max = hour_period.final_period
                    for hour_period_with_relation in hour_periods_with_relation:
                        init_hour_period = hour_period_with_relation[0]
                        final_hour_period = hour_period_with_relation[1]
                        if init_hour_period < hour_period_min:
                            hour_period_min = init_hour_period
                        if final_hour_period > hour_period_max:
                            hour_period_max = final_hour_period
                        remove_query = """DELETE FROM HOUR_PERIODS WHERE DAY_OF_WEEK=? AND INIT=? AND END=?"""
                        remove_data = (hour_period.day_of_week, init_hour_period, final_hour_period)
                        cursor.execute(remove_query, remove_data)
                        conn.commit()

                    insert_query = """INSERT INTO HOUR_PERIODS
                          (DAY_OF_WEEK, INIT, END) 
                           VALUES 
                          (?, ?, ?)"""
                    data = (hour_period.day_of_week, hour_period_min, hour_period_max)
                    cursor.execute(insert_query, data)
                    conn.commit()
                else:
                    return 
            except Exception as e:
                print("Exception Ocurred while trying to insert hour periods from " + self.name + ":" + str(e))

            finally:
                conn.close()

    def remove_hour_period_update_db(self, hour_period: HourPeriod, existing_hour_periods: list[list]):

        new_hour_period = [hour_period.initial_period, hour_period.final_period]

        for existing_hour_period in existing_hour_periods:

            statement_1 = ((higher_hour_period(new_hour_period[0], existing_hour_period[0]) == 1 or higher_hour_period(new_hour_period[0], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[0], existing_hour_period[1]) == 1 or higher_hour_period(new_hour_period[0], existing_hour_period[1]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[0]) == 0 or higher_hour_period(new_hour_period[1], existing_hour_period[0]) == -1) 
            and (higher_hour_period(new_hour_period[1], existing_hour_period[1]) == 1 or higher_hour_period(new_hour_period[1], existing_hour_period[1]) == -1))


            statement_2 = ((higher_hour_period(new_hour_period[0], existing_hour_period[0]) == 0 or higher_hour_period(new_hour_period[0], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[0], existing_hour_period[1]) == 1 or higher_hour_period(new_hour_period[0], existing_hour_period[1]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[0]) == 0 or higher_hour_period(new_hour_period[1], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[1]) == 0 or higher_hour_period(new_hour_period[1], existing_hour_period[1]) == -1))


            statement_3 = ((higher_hour_period(new_hour_period[0], existing_hour_period[0]) == 1 or higher_hour_period(new_hour_period[0], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[0], existing_hour_period[1]) == 1 or higher_hour_period(new_hour_period[0], existing_hour_period[1]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[0]) == 0 or higher_hour_period(new_hour_period[1], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[1]) == 0 or higher_hour_period(new_hour_period[1], existing_hour_period[1]) == -1))


            statement_4 = ((higher_hour_period(new_hour_period[0], existing_hour_period[0]) == 0 or higher_hour_period(new_hour_period[0], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[0], existing_hour_period[1]) == 1 or higher_hour_period(new_hour_period[0], existing_hour_period[1]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[0]) == 0 or higher_hour_period(new_hour_period[1], existing_hour_period[0]) == -1)
            and (higher_hour_period(new_hour_period[1], existing_hour_period[1]) == 1 or higher_hour_period(new_hour_period[1], existing_hour_period[1]) == -1))

            if statement_1:
                #1st situation
                init_hour_period = new_hour_period[1]
                end_hour_period = existing_hour_period[1]

                hour_period_to_remove = HourPeriod()
                hour_period_to_remove.set_day_of_week(hour_period.day_of_week)
                hour_period_to_remove.set_initial_period(existing_hour_period[0])
                hour_period_to_remove.set_final_period(existing_hour_period[1])

                self.remove_hour_period(hour_period_to_remove)


                if init_hour_period != end_hour_period:

                    hour_period_to_insert = HourPeriod()
                    hour_period_to_insert.set_day_of_week(hour_period.day_of_week)
                    hour_period_to_insert.set_initial_period(init_hour_period)
                    hour_period_to_insert.set_final_period(end_hour_period)

                    self.insert_hour_period(hour_period_to_insert)

            elif statement_2:
                #2nd situation
                init_hour_period = existing_hour_period[0]
                end_hour_period = new_hour_period[0]

                hour_period_to_remove = HourPeriod()
                hour_period_to_remove.set_day_of_week(hour_period.day_of_week)
                hour_period_to_remove.set_initial_period(existing_hour_period[0])
                hour_period_to_remove.set_final_period(existing_hour_period[1])
 
                self.remove_hour_period(hour_period_to_remove)

                if init_hour_period != end_hour_period:
                    hour_period_to_insert = HourPeriod()
                    hour_period_to_insert.set_day_of_week(hour_period.day_of_week)
                    hour_period_to_insert.set_initial_period(init_hour_period)
                    hour_period_to_insert.set_final_period(end_hour_period)

                    self.insert_hour_period(hour_period_to_insert)

            elif statement_3:
                #3rd situation - just remove current hour period
                hour_period_to_remove = HourPeriod()
                hour_period_to_remove.set_day_of_week(hour_period.day_of_week)
                hour_period_to_remove.set_initial_period(existing_hour_period[0])
                hour_period_to_remove.set_final_period(existing_hour_period[1])
                self.remove_hour_period(hour_period_to_remove)
                            
            elif statement_4:
                #4th situation
                first_init_hour_period = existing_hour_period[0]
                first_end_hour_period = new_hour_period[0]
                second_init_hour_period = new_hour_period[1]
                second_end_hour_period = existing_hour_period[1]

                hour_period_to_remove = HourPeriod()
                hour_period_to_remove.set_day_of_week(hour_period.day_of_week)
                hour_period_to_remove.set_initial_period(existing_hour_period[0])
                hour_period_to_remove.set_final_period(existing_hour_period[1])

                self.remove_hour_period(hour_period_to_remove)


                if first_init_hour_period != first_end_hour_period:
                    hour_period_to_insert = HourPeriod()
                    hour_period_to_insert.set_day_of_week(hour_period.day_of_week)
                    hour_period_to_insert.set_initial_period(first_init_hour_period)
                    hour_period_to_insert.set_final_period(first_end_hour_period)

                    self.insert_hour_period(hour_period_to_insert)      

                if second_init_hour_period != second_end_hour_period:
                    hour_period_to_insert = HourPeriod()
                    hour_period_to_insert.set_day_of_week(hour_period.day_of_week)
                    hour_period_to_insert.set_initial_period(second_init_hour_period)
                    hour_period_to_insert.set_final_period(second_end_hour_period)

                    self.insert_hour_period(hour_period_to_insert)      

            

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
                    END            TEXT    NOT NULL);''')
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
