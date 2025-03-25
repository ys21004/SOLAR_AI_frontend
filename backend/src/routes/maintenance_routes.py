from flask import Blueprint, request, jsonify
from datetime import datetime
import json
import os

maintenance_routes = Blueprint('maintenance', __name__)

# File to store maintenance records
RECORDS_FILE = 'maintenance_records.json'

# Load existing records or initialize with sample data
def load_records():
    if os.path.exists(RECORDS_FILE):
        with open(RECORDS_FILE, 'r') as f:
            return json.load(f)
    return [
        {
            'date': '2024-03-15',
            'panelId': 'A1',
            'technician': 'John Doe',
            'type': 'Routine Check',
            'status': 'Completed'
        },
        {
            'date': '2024-03-14',
            'panelId': 'B3',
            'technician': 'Jane Smith',
            'type': 'Repair',
            'status': 'Pending'
        }
    ]

# Save records to file
def save_records(records):
    with open(RECORDS_FILE, 'w') as f:
        json.dump(records, f)

# Initialize records
maintenance_records = load_records()

@maintenance_routes.route('/', methods=['GET', 'POST'])
def handle_maintenance():
    global maintenance_records
    
    try:
        if request.method == 'POST':
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400

            print("Received data:", data)  # Debug log
            
            new_record = {
                'date': datetime.now().strftime('%Y-%m-%d'),
                'panelId': data.get('panelId'),
                'technician': data.get('technicianName'),
                'type': 'Routine Check',
                'status': 'Completed',
                'dc_power': data.get('dc_power'),
                'ac_power': data.get('ac_power'),
                'ambient_temperature': data.get('ambient_temperature'),
                'module_temperature': data.get('module_temperature'),
                'irradiation': data.get('irradiation')
            }
            
            maintenance_records.insert(0, new_record)
            save_records(maintenance_records)
            
            print("Updated records:", maintenance_records)  # Debug log
            return jsonify({'success': True, 'record': new_record}), 200
            
        # GET method
        return jsonify(maintenance_records), 200
        
    except Exception as e:
        print("Error:", str(e))  # Debug log
        return jsonify({'error': str(e)}), 500
