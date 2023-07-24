import requests

def get_items():
    url = "https://server.jpgstoreapis.com/search/tokens"
    params = {
        "policyIds": "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a",
        "saleType": "buy-now",
        "sortBy": "recently-listed",
        "traits": "e30=",
        "listingTypes": "ALL_LISTINGS",
        "nameQuery": "",
        "verified": "default",
        "onlyMainBundleAsset": "false",
        "size": "10",
    }
    
    response = requests.get(url, params=params)
    response.raise_for_status()  # Raise an exception for any HTTP errors
    
    return response.json()

# Usage example
items_data = get_items()
print(items_data)
