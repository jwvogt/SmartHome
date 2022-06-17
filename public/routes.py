# STL
import asyncio
from flask.helpers import make_response

# PDM
from flask import Blueprint, jsonify, send_file, request
from flask_cors import CORS

# LOCAL
import DatabaseFunctions as df
import GenerateData as gd

bp = Blueprint("routes", __name__)
CORS(bp)
loop = asyncio.new_event_loop()


utilData = gd.generate_data()


@bp.route("/api/get/sims", methods=["GET"])
def get_sim_data():
    """
    Will return pre-generated simulation data to be displayed on the frontend.
    """
    return jsonify(
        {
            "bath": gd.generate_bath_sim(),
            "shower": gd.generate_shower_sim(),
            "dishwasher": gd.generate_dishwasher_sim(),
            "laundry": gd.generate_laundry_sim(),
        }
    )


@bp.route("/api/get/sensors", methods=["GET"])
def get_appliance_data():
    """
    return {
        "doors&windows": stuff from database,
        "apps": stuff,
        "thermostat": stuff,
    }
    """
    db = df.get_postgres_connection()

    appliances = []
    doors_and_windows = []
    thermostat = []

    [
        appliances.append(
            {
                "id": app[0],
                "name": app[1],
                "room": app[2],
                "isOn": app[3],
                "power_use": app[4],
            }
        )
        for app in df.select(db, "SELECT * FROM appliances")
    ]
    [
        doors_and_windows.append(
            {
                "id": dw[0],
                "name": dw[1],
                "room": dw[2],
                "isOpen": dw[3],
            }
        )
        for dw in df.select(db, "SELECT * FROM doors_and_windows")
    ]
    thermostat = df.select(db, "SELECT unit, temp from thermostat")[0]

    todayData = utilData[len(utilData) - 1]
    outsideTemp = todayData["outdoor_temp"]

    thermData = {
        "outsideTemp": outsideTemp,
        "insideTemp": 20,
        "temp": thermostat[1],
    }

    return jsonify(
        {
            "appliances": appliances,
            "doors_and_windows": doors_and_windows,
            "thermostat": thermData,
        }
    )


@bp.route("/api/update", methods=["POST"])
def update_appliance_data():
    """
    Updates a single record in the DB -> either application, door/window, or thermostat.

    request body looks like so:
    {
        type: "application" | "door/window" | "thermostat",
        record: <the record being updated>,
        checked: <bool - note: checked will not be present when type == "thermostat">
    }
    """
    db = df.get_postgres_connection()
    data = request.json
    record = data.get("record", None)
    checked = data.get("checked", None)

    if not record:
        return make_response("Uh oh, recieved null record!", 400)

    if data.get("type") == "appliance":
        query = "UPDATE appliances SET isOn = %s WHERE id = %s"
        args = [checked, record.get("id")]
    if data.get("type") == "door/window":
        query = "UPDATE doors_and_windows SET isOpen = %s WHERE id = %s"
        args = [checked, record.get("id")]
    if data.get("type") == "thermostat":
        query = "UPDATE thermostat SET temp = %s"
        args = [record.get("temp")]

    result = df.update(db, query, args)
    if result:
        return make_response(f"Successfully updated record {record}", 200)
    return make_response("Error", 400)


@bp.route("/api/get/util-usage", methods=["GET"])
def get_current_data():
    """"""
    retData = []

    for day in utilData:
        retData.append(
            {
                "date": day["date"],
                "amount": day["water_usage"],
                "cost": day["water_bill"],
                "category": "water",
            }
        )
        retData.append(
            {
                "date": day["date"],
                "amount": day["power_usage"],
                "cost": day["power_bill"],
                "category": "power",
            }
        )
        retData.append(
            {
                "date": day["date"],
                "amount": "",
                "cost": round(float(day["power_bill"]) + float(day["water_bill"])),
                "category": "total",
            }
        )
    return jsonify(retData)


# base route
@bp.route("/")
@bp.route("/<path>", methods=["GET"])
def home(path=""):
    return send_file("index.html")
