from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import board
import neopixel

# Configura il numero di LED e il pin GPIO
LED_COUNT = 3
LED_PIN = board.D18
LED_BRIGHTNESS = 0.2

pixels = neopixel.NeoPixel(LED_PIN, LED_COUNT, brightness=LED_BRIGHTNESS, auto_write=False)

app = Flask(__name__)

# Configura CORS per permettere richieste da qualsiasi origine
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/turn_on/<int:led_id>', methods=['POST'])
def turn_on(led_id):
    if 1 <= led_id <= LED_COUNT:
        pixels[led_id - 1] = (255, 255, 255)
        pixels.show()
        return jsonify({'status': 'success', 'message': f'LED {led_id} acceso'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'LED ID non valido'}), 404

@app.route('/turn_off/<int:led_id>', methods=['POST'])
def turn_off(led_id):
    if 1 <= led_id <= LED_COUNT:
        pixels[led_id - 1] = (0, 0, 0)
        pixels.show()
        return jsonify({'status': 'success', 'message': f'LED {led_id} spento'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'LED ID non valido'}), 404

@app.route('/set_led/<int:led_id>/<int:color>', methods=['POST'])
def set_led_color(led_id, color):
    if 1 <= led_id <= LED_COUNT:
        r = (color >> 16) & 0xFF
        g = (color >> 8) & 0xFF
        b = color & 0xFF
        pixels[led_id - 1] = (r, g, b)
        pixels.show()
        return jsonify({'status': 'success', 'message': f'LED {led_id} impostato su RGB({r}, {g}, {b})'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'LED ID non valido'}), 404

@app.route('/batch_action', methods=['POST'])
def batch_action():
    data = request.json
    ids = data.get('ids', [])
    action = data.get('action')
    color = data.get('color')

    if not ids or action not in ['on', 'off', 'color']:
        return jsonify({'status': 'error', 'message': 'Dati di richiesta non validi'}), 400

    for led_id in ids:
        if 1 <= led_id <= LED_COUNT:
            if action == 'on':
                pixels[led_id - 1] = (255, 255, 255)
            elif action == 'off':
                pixels[led_id - 1] = (0, 0, 0)
            elif action == 'color' and color is not None:
                r = (color >> 16) & 0xFF
                g = (color >> 8) & 0xFF
                b = color & 0xFF
                pixels[led_id - 1] = (r, g, b)
        else:
            return jsonify({'status': 'error', 'message': f'LED ID non valido: {led_id}'}), 404

    pixels.show()
    return jsonify({'status': 'success', 'message': f'Azione batch {action} applicata con successo'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
