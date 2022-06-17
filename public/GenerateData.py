# STL
from datetime import date
from decouple import config
import requests
import calendar
import datetime


def get_weather_data():
    """
    Refer to https://dev.meteostat.net/api/ for more info.
    I tried using the python package but ssh verification wasn't working, so...
    we can go with the JSON API for now.

    Returns a list of "day" objects, each containing weather data for that day.
    """

    bhamStation = requests.get(
        url="https://meteostat.p.rapidapi.com/stations/nearby?lat=33.5186&lon=-86.8104",
        headers={
            # These are both env vars, which you'll have to set up manually.
            # I git ignored the .env file i set up because that is best practice (don't wanna push up all your secrets and sensitive info, passwords, etc.)
            # You'll have to add a .env file to your root directory and add any envvars there.
            # Message me (Jack) and I can send you what I have.
            "x-rapidapi-host": config("API_HOST"),
            "x-rapidapi-key": config("API_KEY"),
        },
    ).json()["data"][0]["id"]
    # ^ getting bham airport id out of the json

    # getting hourly data only lets you get 30 days at a time,
    # so two calls required for two months of data
    # current month
    thisMonthEnd = datetime.date.today()
    thisMonthStart = datetime.date.today().replace(day=1)
    month1 = requests.get(
        url=f"https://meteostat.p.rapidapi.com/stations/daily?station={bhamStation}&start={thisMonthStart}&end={thisMonthEnd}",
        headers={
            # These are both env vars, which you'll have to set up manually.
            # I git ignored the .env file i set up because that is best practice (don't wanna push up all your secrets and sensitive info, passwords, etc.)
            # You'll have to add a .env file to your root directory and add any envvars there.
            # Message me (Jack) and I can send you what I have.
            "x-rapidapi-host": config("API_HOST"),
            "x-rapidapi-key": config("API_KEY"),
        },
    ).json()

    # previous month
    prevMonth = 12 if (thisMonthStart.month - 1) == 0 else (thisMonthStart.month - 1)
    prevMonthStart = datetime.date.today().replace(day=1)
    prevMonthStart = prevMonthStart.replace(month=prevMonth)
    prevMonthEnd = prevMonthStart.replace(
        day=calendar.monthrange(prevMonthStart.year, prevMonthStart.month)[1]
    )
    month2 = requests.get(
        url=f"https://meteostat.p.rapidapi.com/stations/daily?station={bhamStation}&start={prevMonthStart}&end={prevMonthEnd}",
        headers={
            "x-rapidapi-host": config("API_HOST"),
            "x-rapidapi-key": config("API_KEY"),
        },
    ).json()

    # previous previous month
    prevPrevMonth = 12 if (prevMonth - 1) == 0 else (prevMonth - 1)
    prevPrevMonthStart = datetime.date.today().replace(day=1)
    prevPrevMonthStart = prevPrevMonthStart.replace(month=prevPrevMonth)
    prevPrevMonthEnd = prevPrevMonthStart.replace(
        day=calendar.monthrange(prevPrevMonthStart.year, prevPrevMonthStart.month)[1]
    )
    month3 = requests.get(
        url=f"https://meteostat.p.rapidapi.com/stations/daily?station={bhamStation}&start={prevPrevMonthStart}&end={prevPrevMonthEnd}",
        headers={
            "x-rapidapi-host": config("API_HOST"),
            "x-rapidapi-key": config("API_KEY"),
        },
    ).json()

    all_data = []
    all_data.extend(month3["data"])  # month3 -> prev prev month weather data
    all_data.extend(month2["data"])  # month2 -> prev month weather data
    all_data.extend(month1["data"])  # month1 -> current month weather data

    return all_data


def calculate_hvac_operation(outsideTemp, insideTemp, day):
    # hours in the given day
    hours = 24

    # number of 10 degree differences
    tempChange = abs(outsideTemp - insideTemp) / 10

    # time the door is open on a weekend day in minutes
    # day -> int representation of day of week (0 = monday ... 6 = sunday)
    # M-F : 16 door opens -> 16x30 = 480sec -> 8 minutes
    # S-S : 32 door opens -> 32x30 = 960sec -> 16 minutes
    minutesDoorOpen = 16 if day > 4 else 8

    # change of degrees with door open
    degreeChangeOfDoorsOpen = (tempChange * 2) * (minutesDoorOpen / 5)

    # change of degrees with doors closed
    degreeChangeOfHouseClosed = (tempChange * 2) * hours

    # +/- deg per minute of operation
    # how long the HVAC ran on the given day
    minutesOfOperation = degreeChangeOfDoorsOpen + degreeChangeOfHouseClosed

    return minutesOfOperation


def calculate_power_usage(day, hvacRun, waterUsed):
    powerUsed = 0
    # powerUsed -> watts (w)

    # lights -> 60w per hour
    # notes :
    #   1. adults asleep for 6.5 hours and at work for 10 hours (10+6.5=16.5) (bedroom has 3 bulbs)
    #   2. kids asleep for 9.5 hours and at school for 8.5  (8.5+9.5=18) (bedroom has 3 bulbs -> 3x2 = 6)
    #   3. bathroom lights are on all hours of the day  (assumption)
    #   4. living room lights are on for 8 hours of the day (assumption)
    adultBedroomBulbs = 3
    adultBedroomBulbUsage = (
        (24 - 16.5) * adultBedroomBulbs * 60
    )  # (hours home awake) * bulbs * (watt per bulb per hour)
    powerUsed += adultBedroomBulbUsage
    kidBedroomBulbs = 6
    kidBedroomBulbUsage = (
        (24 - 18) * kidBedroomBulbs * 60
    )  # (hours home awake) * bulbs * (watt per bulb per hour)
    powerUsed += kidBedroomBulbUsage
    powerUsed += 24 * 2 * 60  # bathroom light usage
    powerUsed += 8 * 3 * 60  # living room light usage

    # bath exhaust fan -> 30w per hour
    # total showers taken * time of each shower * wattage
    # fan only runs when showering, not during bath (assumption)
    # showers time of 8 minutes
    # weekend days : 3 showers
    # week days : 2 showers
    powerUsed += (3 * (8 / 60) * 30) if day > 4 else (2 * (8 / 60) * 30)

    # HVAC -> 3500w per hour
    powerUsed += 3500 * (hvacRun / 60)

    # refridgerator -> 150w per hour
    powerUsed += 150 * 24

    # microwave -> 1100w per hour
    # m-f : 20min/day
    # s-s : 30min/day
    powerUsed += ((30 / 60) * 1100) if day > 4 else ((20 / 60) * 1100)

    # hot water heater -> 4500w per hour
    # 4 minutes to heat 1 gallon of water
    # hot water of total water is 65%
    hotWaterUsed = waterUsed * 0.65  # gallons
    hotWaterUsed += 6 if day >= 3 else 0  # dishwasher
    hotWaterUsed += 17 if day >= 3 else 0  # clothes washer
    timeToHeatWater = hotWaterUsed * 4  # minutes
    powerUsed += 4500 * (timeToHeatWater / 60)

    # stove -> 3500w per hour
    # m-f : 45min/day
    # s-s : 30min/day
    powerUsed += ((30 / 60) * 3500) if day > 4 else ((45 / 60) * 3500)

    # oven -> 4000w per hour
    # m-f : 45min/day
    # s-s : 60min/day
    powerUsed += ((60 / 60) * 4000) if day > 4 else ((45 / 60) * 4000)

    # living room tv -> 636w per hour
    # m-f : 4hrs/day
    # s-s : 8hrs/day
    powerUsed += (8 * 636) if day > 4 else (4 * 636)
    # bedroom room tv -> 100w per hour
    # m-f : 2hrs/day
    # s-s : 4hrs/day
    powerUsed += (4 * 100) if day > 4 else (2 * 100)

    # dishwasher -> 1800w per hour
    # 6 gallons of hot water -> we add this to the above equation for calculating hot water heater
    # 45 min per load
    # 4 days a week -> at the end of the week (thurs-sun)
    powerUsed += (1800 * (45 / 60)) if day >= 3 else 0

    # clothes washer -> 500w per hour
    # 20 gallons of water : 85% hot -> 17gal hot water -> we add this above for hot water heater
    # 30 min per load
    # 4 days a week -> at the end of the week (thurs-sun)
    powerUsed += (500 * (30 / 60)) if day >= 3 else 0

    # clothes dryer -> 3000w per hour
    # 30 min per load
    # 4 days a week -> at the end of the week (thurs-sun)
    powerUsed += (3000 * (30 / 60)) if day >= 3 else 0

    return powerUsed  # watts


def power_cost(watts):
    # $0.12 per kWh
    # 1w = 1/1000kw
    return (watts * (1 / 1000)) * 0.12


def calculate_water_usage(day):
    # gallons of water used for the entire day
    gallonsOfWaterUsed = 0

    # weekday -> 2 showers and 2 baths
    # weekend -> 3 showers and 3 baths
    showersAndBaths = 3 if day > 4 else 2

    # shower 25 gallons
    gallonsOfWaterUsed += 25 * showersAndBaths
    # bath 30 gallons
    gallonsOfWaterUsed += 30 * showersAndBaths

    # dishwasher -> 6 gallons of water per load
    # 4 loads / week -> assumption that this is done at end of the week (thurs-sun)->(3,6)
    # could change to split across all seven days
    gallonsOfWaterUsed += 6 if day >= 3 else 0

    # clothes washer -> 20 gallons
    # 4 loads / week -> assumption that this is done at end of the week (thurs-sun)->(3,6)
    # could change to split across all seven days
    gallonsOfWaterUsed += 20 if day >= 3 else 0

    return gallonsOfWaterUsed


def water_cost(gallons):
    # 748 gallons cost $2.52
    return (gallons / 748) * 2.52


def generate_data():
    """
    This function will handle transforming the data recieved from
    the weather API and adding the transformed data to the DB.
    """
    weather_data = get_weather_data()
    # { day , hvacRunTime (minutes) , waterUsage (gallons) , waterBill ($) , powerUsage (kWh), powerBill ($)}
    total_data = []
    for day in weather_data:
        # mon -> 0, tue -> 1, etc.
        dayOfWeek = date.fromisoformat(day["date"]).weekday()

        water_used = round(calculate_water_usage(dayOfWeek), 3)
        water_bill = round(water_cost(water_used), 3)
        hvac_run = round(calculate_hvac_operation(day["tavg"], 20, dayOfWeek), 2)
        power_used = round(calculate_power_usage(dayOfWeek, hvac_run, water_used), 3)
        power_bill = round(power_cost(power_used), 2)
        total_data.append(
            {
                "date": day["date"],
                "outdoor_temp": day["tavg"],
                "hvac_run_time": hvac_run,
                "water_usage": water_used,
                "water_bill": water_bill,
                "power_usage": power_used,
                "power_bill": power_bill,
            }
        )

    return total_data


def generate_bath_sim():
    waterUsed = 30
    hotWaterUsed = waterUsed * 0.65  # gallons
    timeToHeatWater = hotWaterUsed * 4  # minutes
    powerUsed = 4500 * (timeToHeatWater / 60)

    waterCost = round(water_cost(waterUsed), 2)
    powerCost = round(power_cost(powerUsed), 2)
    return {
        "Water Used (gallons)": waterUsed,
        "Power Used (watts)": powerUsed,
        "Water Cost ($)": waterCost,
        "Power Cost ($)": powerCost,
    }


def generate_shower_sim():
    waterUsed = 25
    hotWaterUsed = waterUsed * 0.65  # gallons
    timeToHeatWater = hotWaterUsed * 4  # minutes
    powerUsed = 4500 * (timeToHeatWater / 60)

    waterCost = round(water_cost(waterUsed), 2)
    powerCost = round(power_cost(powerUsed), 2)
    return {
        "Water Used (gallons)": waterUsed,
        "Power Used (watts)": powerUsed,
        "Water Cost ($)": waterCost,
        "Power Cost ($)": powerCost,
    }


def generate_dishwasher_sim():
    powerUsed = 1800 * (45 / 60)
    waterUsed = 6
    timeToHeatWater = waterUsed * 4  # minutes
    powerUsed += 4500 * (timeToHeatWater / 60)

    waterCost = round(water_cost(waterUsed), 2)
    powerCost = round(power_cost(powerUsed), 2)
    return {
        "Water Used (gallons)": waterUsed,
        "Power Used (watts)": powerUsed,
        "Water Cost ($)": waterCost,
        "Power Cost ($)": powerCost,
    }


def generate_laundry_sim():
    washerPowerUsed = 500 * (30 / 60)
    washerWaterUsed = 20
    hotWaterUsed = washerWaterUsed * 0.85
    timeToHeatWater = hotWaterUsed * 4
    washerPowerUsed += 4500 * (timeToHeatWater / 60)

    dryerPowerUsed = 3000 * (30 / 60)

    waterCost = round(water_cost(washerWaterUsed), 2)
    powerCost = round(power_cost(washerPowerUsed + dryerPowerUsed), 2)

    return {
        "Water Used (gallons)": washerWaterUsed,
        "Power Used (watts)": washerPowerUsed + dryerPowerUsed,
        "Water Cost ($)": waterCost,
        "Power Cost ($)": powerCost,
    }