from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

received_data = []

@app.route('/receive', methods=['POST'])
def receive_data():
    package = request.json
    received_data.append(package)
    return jsonify({'status': 'success'}), 200


@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(received_data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5050)