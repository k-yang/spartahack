from flask import Flask, jsonify, request, render_template, send_from_directory, abort
from img_processing import *
from watson.visual_recognition import *

app = Flask(__name__)


@app.route("/webcam")
def webcam():
    return render_template("webcam.html")


@app.route("/train")
def train():
    return render_template("train.html")


@app.route('/convert', methods=['POST'])
def convert():
    expected_values = ['uid', 'frame', 'data']
    if not request.json or not all(value in request.json for value in expected_values):
        abort(400)
    image_array = image_data2array(request.json['data'])
    if 'save' in request.json and request.json['save']:
        try:
            save_image(request.json['data'])
        except Exception as e:
            print e
            abort(500)

    return jsonify({"success": True, "image_array": image_array.tolist()})


@app.route('/batch_save', methods=['POST'])
def batch_save():
    if not request.json or 'data' not in request.json:
        abort(400)
    image_array_list = batch_convert(request.json['data'])
    if 'class' in request.json:
        classification = request.json['class'] or "unknown"
        try:
            store_nparray(image_array_list, classification)
            save_test_images(request.json['data'], classification)
        except Exception as e:
            print e
            abort(500)
    return jsonify({"success": True})


