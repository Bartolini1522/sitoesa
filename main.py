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

@app.route('/batch_action', methods=['POST'])
def batch_action():
    data = request.get_json()
    ids = data.get('ids', [])
    action = data.get('action')
    color = data.get('color')

    if action == 'color':
        if color is None:
            return jsonify({'status': 'error', 'message': 'Color not provided'}), 400
        for led_id in ids:
            if 1 <= led_id <= LED_COUNT:
                r = (color >> 16) & 0xFF
                g = (color >> 8) & 0xFF
                b = color & 0xFF
                pixels[led_id - 1] = (r, g, b)
            else:
                return jsonify({'status': 'error', 'message': f'LED ID {led_id} non valido'}), 404
        pixels.show()
        return jsonify({'status': 'success', 'message': 'LED colorati'}), 200

    elif action == 'on':
        for led_id in ids:
            if 1 <= led_id <= LED_COUNT:
                pixels[led_id - 1] = (255, 255, 255)  # Acceso
            else:
                return jsonify({'status': 'error', 'message': f'LED ID {led_id} non valido'}), 404
        pixels.show()
        return jsonify({'status': 'success', 'message': 'LED accesi'}), 200

    elif action == 'off':
        for led_id in ids:
            if 1 <= led_id <= LED_COUNT:
                pixels[led_id - 1] = (0, 0, 0)  # Spento
            else:
                return jsonify({'status': 'error', 'message': f'LED ID {led_id} non valido'}), 404
        pixels.show()
        return jsonify({'status': 'success', 'message': 'LED spenti'}), 200

    else:
        return jsonify({'status': 'error', 'message': 'Azione non valida'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
