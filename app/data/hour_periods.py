###########EXERTNAL IMPORTS############



#######################################

#############LOCAL IMPORTS#############



#######################################

class HourPeriod():
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
        return_string = "Initial Hour Period: "+self.initial_period+"\n"+"Final Hour Period: "+self.final_period+"\n"+"Active Energy Limit: "+self.active_energy_limit+"\n"
        return_string = return_string + "Reactive Energy Limit: "+self.reactive_energy_limit+"\n"+ "Active Energy Limit Unit: "+self.active_energy_limit_unit+"\n" + "Reactive Energy Limit Unit: "+self.reactive_energy_limit_unit+"\n" + "Active Energy Limit Enabled: "+self.active_energy_limit_enabled+"\n"
        return_string = return_string + "Reactive Energy Limit Enabled: "+self.reactive_energy_limit_enabled+"\n"
        return return_string