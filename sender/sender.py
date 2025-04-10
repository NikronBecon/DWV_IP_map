# sender.py
import pandas as pd
import json
import time
import requests
from datetime import datetime

def load_data(file_path):
    data = pd.read_csv(file_path)

    print("Original data loaded:", len(data))  # ✅ debug

    data['Timestamp'] = pd.to_numeric(data['Timestamp'], errors='coerce')
    data = data.dropna(subset=['Timestamp'])
    data['Timestamp'] = pd.to_datetime(data['Timestamp'], unit='s')

    data_cleaned = data[data['suspicious'] == 0]
    print("Cleaned data rows:", len(data_cleaned))  # ✅ debug

    packages = []
    for _, row in data_cleaned.iterrows():
        packages.append({
            'ip_address': row['ip address'],
            'latitude': float(row['Latitude']),
            'longitude': float(row['Longitude']),
            'timestamp': row['Timestamp'].strftime('%Y-%m-%d %H:%M:%S'),
            'suspicious': int(row['suspicious'])
        })

    print("Prepared packages to send:", len(packages))  # ✅ debug
    return packages


from datetime import datetime

def send_data(packages):
    if not packages:
        print("No packages to send.")
        return

    fmt = '%Y-%m-%d %H:%M:%S'
    prev_ts = datetime.strptime(packages[0]['timestamp'], fmt)

    for i, package in enumerate(packages):
        curr_ts = datetime.strptime(package['timestamp'], fmt)

        # Wait the difference between this and the previous package
        if i > 0:
            delta = (curr_ts - prev_ts).total_seconds()
            time.sleep(max(0, delta))  # avoid negative sleep
        prev_ts = curr_ts

        try:
            response = requests.post('http://backend:5050/receive', json=package)
        except Exception as e:
            print(f'Failed to send: {e}')



if __name__ == '__main__':
    packages = load_data("ip_addresses.csv")  # Replace with your CSV file path
    send_data(packages)