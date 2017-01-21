from flask import Flask, jsonify, request, render_template, send_from_directory, abort

app = Flask(__name__)


@app.route("/webcam")
def webcam():
    return render_template("webcam.html")


if __name__ == "__main__":
    app.run(debug=True)
