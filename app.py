from flask import Flask, jsonify, request, render_template, send_from_directory, abort
from img_processing import batch_convert, image_data2array
app = Flask(__name__)


@app.route("/webcam")
def webcam():
    return render_template("webcam.html")


@app.route('/convert', methods=['POST'])
def convert():
    if not request.json or 'uid' not in request.json or 'frame' not in request.json or 'data' not in request.json:
        abort(400)
    data2convert = (
        request.json['uid'],
        request.json['frame'],
        request.json['data'],
    )
    image_array = image_data2array(*data2convert)
    return jsonify({"success":True})
    # # return jsonify(getDemographic(request.json['video_id']))

if __name__ == "__main__":
    app.run(debug=True)
