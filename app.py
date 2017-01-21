from flask import Flask, jsonify, request, render_template, send_from_directory, abort
from img_processing import batch_convert, image_data2array, store_nparray
app = Flask(__name__)


@app.route("/webcam")
def webcam():
    return render_template("webcam.html")


@app.route('/convert', methods=['POST'])
def convert():
    expected_values = ['uid','frame','data']
    if not request.json or not all(value in request.json for value in expected_values):
        abort(400)
    data2convert = (
        request.json['uid'],
        request.json['frame'],
        request.json['data'],
    )
    image_array = image_data2array(*data2convert)
    if 'save' in request.json:
        print 'saving......'
        if request.json['save']:
            classification = request.json['class']
            try:
                store_array_list(image_array,classification)
            except Exception as e:
                print e
                abort(500)

    return jsonify({"success":True})

@app.route('/batch_save', methods=['POST'])
def batch_save():
    if not request.json or 'data' not in request.json:
        abort(400)
    image_array_list = batch_convert(request.json['data'])
    if 'class' in request.json:
        classification = request.json['class']
        try:
            store_nparray(image_array_list, classification + str(request.json['data'][0]['uid']))
        except Exception as e:
            print e
            abort(500)
    return jsonify({"success":True})


if __name__ == "__main__":
    app.run(debug=True)
