import requests

try:
    response = requests.post('http://localhost:5000/set_led/1/16727105')
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")

