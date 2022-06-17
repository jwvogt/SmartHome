def generate_insert_queries():
    apps = [
        # bedroom 1
        {"name": "Overhead", "room": "bed1", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 1", "room": "bed1", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 2", "room": "bed1", "isOn": "FALSE", "power_use": 60},
        {"name": "TV", "room": "bed1", "isOn": "FALSE", "power_use": 100},
        # bedroom 2
        {"name": "Overhead", "room": "bed2", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 1", "room": "bed2", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 2", "room": "bed2", "isOn": "FALSE", "power_use": 60},
        {"name": "TV", "room": "bed2", "isOn": "FALSE", "power_use": 100},
        # bedroom 3
        {"name": "Overhead", "room": "bed3", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 1", "room": "bed3", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 2", "room": "bed3", "isOn": "FALSE", "power_use": 60},
        {"name": "TV", "room": "bed3", "isOn": "FALSE", "power_use": 100},
        # bath 1
        {"name": "Overhead", "room": "bath1", "isOn": "FALSE", "power_use": 60},
        {"name": "Fan", "room": "bath1", "isOn": "FALSE", "power_use": 30},
        # bath 2
        {"name": "Overhead", "room": "bath2", "isOn": "FALSE", "power_use": 60},
        {"name": "Fan", "room": "bath2", "isOn": "FALSE", "power_use": 30},
        # living room
        {"name": "Overhead", "room": "living_room", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 1", "room": "living_room", "isOn": "FALSE", "power_use": 60},
        {"name": "Lamp 2", "room": "living_room", "isOn": "FALSE", "power_use": 60},
        {"name": "TV", "room": "living_room", "isOn": "FALSE", "power_use": 636},
        # kitchen
        {"name": "Overhead", "room": "kitchen", "isOn": "FALSE", "power_use": 60},
        {"name": "Stove", "room": "kitchen", "isOn": "FALSE", "power_use": 3500},
        {"name": "Oven", "room": "kitchen", "isOn": "FALSE", "power_use": 4000},
        {"name": "Microwave", "room": "kitchen", "isOn": "FALSE", "power_use": 1100},
        {"name": "Refrigerator", "room": "kitchen", "isOn": "FALSE", "power_use": 150},
        {"name": "Dishwasher", "room": "kitchen", "isOn": "FALSE", "power_use": 1800},
    ]

    doorsAndWindows = [
        # bedroom 1
        {"name": "Window 1", "room": "bed1", "isOpen": "FALSE"},
        {"name": "Window 2", "room": "bed1", "isOpen": "FALSE"},
        # bedroom 2
        {"name": "Window 1", "room": "bed2", "isOpen": "FALSE"},
        {"name": "Window 2", "room": "bed2", "isOpen": "FALSE"},
        # bedroom 3
        {"name": "Window 1", "room": "bed3", "isOpen": "FALSE"},
        {"name": "Window 2", "room": "bed3", "isOpen": "FALSE"},
        # bath 1
        {"name": "Window", "room": "bath1", "isOpen": "FALSE"},
        # bath 2
        {"name": "Window", "room": "bath2", "isOpen": "FALSE"},
        # living room
        {"name": "Window 1", "room": "living_room", "isOpen": "FALSE"},
        {"name": "Window 2", "room": "living_room", "isOpen": "FALSE"},
        {"name": "Window 3", "room": "living_room", "isOpen": "FALSE"},
        {"name": "Front Door", "room": "living_room", "isOpen": "FALSE"},
        {"name": "Garage Door (into house)", "room": "living_room", "isOpen": "FALSE"},
        # kitchen
        {"name": "Window 1", "room": "kitchen", "isOpen": "FALSE"},
        {"name": "Window 2", "room": "kitchen", "isOpen": "FALSE"},
        {"name": "Back Door", "room": "kitchen", "isOpen": "FALSE"},
        # garage
        {"name": "Garage Door 1", "room": "garage", "isOpen": "FALSE"},
        {"name": "Garage Door 2", "room": "garage", "isOpen": "FALSE"},
    ]

    thermostat = {"unit": "celcius", "temp": 20}

    f = open("./insert-db-data.sql", "w")

    for app in apps:
        query = "INSERT INTO appliances (name, room, isOn, power_use) VALUES ('{}', '{}', {}, {});\n"
        args = [app["name"], app["room"], app["isOn"], app["power_use"]]
        f.write(query.format(*args))
    for dw in doorsAndWindows:
        query = "INSERT INTO doors_and_windows (name, room, isOpen) VALUES ('{}', '{}', {});\n"
        args = [dw["name"], dw["room"], dw["isOpen"]]
        f.write(query.format(*args))

    query = "INSERT INTO thermostat (unit, temp) VALUES ('{}', {});\n"
    args = [thermostat["unit"], thermostat["temp"]]
    f.write(query.format(*args))


if __name__ == "__main__":
    generate_insert_queries()
