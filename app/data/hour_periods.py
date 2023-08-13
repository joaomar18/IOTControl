###########EXERTNAL IMPORTS############



#######################################

#############LOCAL IMPORTS#############



#######################################

class HourPeriod():
    def __init__(self):
        self.day_of_week = ""
        self.initial_period = ""
        self.final_period = ""

    def set_day_of_week(self, day_of_week):
        self.day_of_week = day_of_week

    def set_initial_period(self, initial_period):
        self.initial_period = initial_period
    
    def set_final_period(self, final_period):
        self.final_period = final_period
    
    def stringify(self) ->  str:
        return_string = "WEEK_DAY:"+self.day_of_week+","+"INIT:"+self.initial_period+","+"END:"+self.final_period
        return return_string


def get_hour_periods_from_list(hour_periods : list[HourPeriod]):
    hour_periods_list = list()
    for hour_period in hour_periods:
        hour_periods_list.append([hour_period.initial_period, hour_period.final_period])
    return hour_periods_list


def higher_hour_period(first_hour_period : str, second_hour_period : str) -> int:
    first_content = first_hour_period.split(":")
    first_hours = int(first_content[0])
    first_minutes = int(first_content[1])
    first_seconds = int(first_content[2])

    second_content = second_hour_period.split(":")
    second_hours = int(second_content[0])
    second_minutes = int(second_content[1])
    second_seconds = int(second_content[2])

    if first_hours > second_hours:
        return 0
    elif first_hours < second_hours:
        return 1
    else:
        if first_minutes > second_minutes:
            return 0
        elif first_minutes < second_minutes:
            return 1
        else:
            if first_seconds > second_seconds:
                return 0
            elif first_seconds < second_seconds:
                return 1
            else:
                return -1

def get_hour_periods_with_relation(new_hour_period: str, existing_hour_periods: list[str]) -> list:
    hour_periods_with_relation = list()
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
            hour_periods_with_relation.append(existing_hour_period)
        elif statement_2:
            #2nd situation
            hour_periods_with_relation.append(existing_hour_period)
        elif statement_3:
            #3rd situation
            hour_periods_with_relation.append(existing_hour_period)
        elif statement_4:
            #4th situation
            hour_periods_with_relation.append(existing_hour_period)
    return hour_periods_with_relation