import requests

try:
    response = requests.post('https://localhost:5000/set_led/1/255255255')
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")

