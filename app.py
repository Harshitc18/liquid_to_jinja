from flask import Flask, request, jsonify, render_template
import json
from liquid_to_jinja import convert_liquid_to_jinja

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    try:
        data = request.get_json()
        liquid_code = data.get('liquid_code', '')
        
        if not liquid_code.strip():
            return jsonify({
                'success': False,
                'error': 'Please provide liquid code to convert'
            })
        
        # Convert liquid to jinja
        jinja_code = convert_liquid_to_jinja(liquid_code)
        
        return jsonify({
            'success': True,
            'jinja_code': jinja_code
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Conversion error: {str(e)}'
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
