###########EXERTNAL IMPORTS############



#######################################

#############LOCAL IMPORTS#############



#######################################

class HourPeriod():
    def __init__(self):
        self.day_of_week = ""
        self.initial_period = ""
        self.final_period = ""
        self.active_energy_limit = 0
        self.reactive_energy_limit = 0
        self.active_energy_limit_unit = ""
        self.reactive_energy_limit_unit = ""
        self.active_energy_limit_enabled = False
        self.reactive_energy_limit_enabled = False

    def set_day_of_week(self, day_of_week):
        self.day_of_week = day_of_week

    def set_initial_period(self, initial_period):
        self.initial_period = initial_period
    
    def set_final_period(self, final_period):
        self.final_period = final_period
    
    def set_active_energy_limit(self, active_energy_limit):
        self.active_energy_limit = active_energy_limit
    
    def set_reactive_energy_limit(self, reactive_energy_limit):
        self.reactive_energy_limit = reactive_energy_limit

    def set_active_energy_limit_unit(self, active_energy_limit_unit):
        self.active_energy_limit_unit = active_energy_limit_unit

    def set_reactive_energy_limit_unit(self, reactive_energy_limit_unit):
        self.reactive_energy_limit_unit = reactive_energy_limit_unit
    
    def set_active_energy_limit_enabled(self, active_energy_limit_enabled):
        self.active_energy_limit_enabled = active_energy_limit_enabled
    
    def set_reactive_energy_limit_enabled(self, reactive_energy_limit_enabled):
        self.reactive_energy_limit_enabled = reactive_energy_limit_enabled   
    
    def stringify(self) ->  str:
        return_string = "Day of Week: "+self.day_of_week+"\n"+"Initial Hour Period: "+self.initial_period+"\n"+"Final Hour Period: "+self.final_period+"\n"+"Active Energy Limit: "+str(self.active_energy_limit)+"\n"
        return_string = return_string + "Reactive Energy Limit: "+ str(self.reactive_energy_limit) + "\n"+ "Active Energy Limit Unit: "+self.active_energy_limit_unit+"\n" + "Reactive Energy Limit Unit: "+self.reactive_energy_limit_unit+"\n" + "Active Energy Limit Enabled: "+ str(self.active_energy_limit_enabled) +"\n"
        return_string = return_string + "Reactive Energy Limit Enabled: "+ str(self.reactive_energy_limit_enabled) +"\n"
        return return_string


def get_hour_periods_from_list(hour_periods : list[HourPeriod]):
    hour_periods_list = list()
    for hour_period in hour_periods:
        hour_periods_list.append([hour_period.initial_period, hour_period.final_period])
    return hour_periods_list
