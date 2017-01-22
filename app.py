from flask import Flask, jsonify, request, render_template, send_from_directory, abort
from img_processing import *
from watson.visual_recognition import *
from db import *
from mysql import connector

app = Flask(__name__)


@app.route("/webcam")
def webcam():
    return render_template("webcam.html")


@app.route("/train")
def train():
    return render_template("train.html")


@app.route("/alexa", methods=['POST'])
def alexa():
    if not request.json or 'data' not in request.json:
        abort(400)
    word = request.json['data']

    cnx = connector.connection.MySQLConnection(
        user='gestureadmin',
        password='SpartansWill',
        host='spartahackdb.c6kspdcu44vw.us-east-1.rds.amazonaws.com',
        database='gesturedb'
    )

    cursor = cnx.cursor()

    cnx.close()


@app.route('/convert', methods=['POST'])
def convert():
    expected_values = ['uid', 'frame', 'data']
    if not request.json or not all(value in request.json for value in expected_values):
        abort(400)

    uid = request.json['uid']
    data = request.json['data']

    zip_file = save_images_to_zip(data, uid)

    try:
        intent = classify_image_from_filename(zip_file)
        delete_images()
    except Exception as e:
        return jsonify({"intent": "", "location": "", "error": "Watson Limit Exceeded"})

    db_session = Session()
    location = db_session.query(Location).filter_by(intent=intent).first()
    if location is None:
        return jsonify({"intent": intent, "location": ""})
    alexa_request = Requests()
    alexa_request.intent = intent
    alexa_request.location = "You can find {} at {}".format(intent, location.name)
    db_session.add(alexa_request)
    db_session.commit()

    return jsonify({"intent": intent, "location": location.name})


@app.route('/batch_save', methods=['POST'])
def batch_save():
    if not request.json or 'data' not in request.json:
        abort(400)
    classification = request.json['class'] or "unknown"
    try:
        save_test_images(request.json['data'], classification)
    except Exception as e:
        print e
        abort(500)
    return jsonify({"success": True})
