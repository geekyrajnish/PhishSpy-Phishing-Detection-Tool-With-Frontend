from functions import run
import sqlite3
import validators
from validators import ValidationFailure
import urllib.request
import requests
import redis

# # Connect to Redis
# redis_conn = redis.Redis(host='localhost', port=6379, db=0)





global suspectScore


def is_string_an_url(url_string: str) -> bool:
    result = validators.url(url_string)

    if isinstance(result, ValidationFailure):
        return False

    return result

def website_is_up(url):
    try:
        status_code = requests.get(url).status_code
        print("status code : ",status_code)
        return status_code == 200
    except:
        return False

def main(url):
    response = {}

    conn = sqlite3.connect("database.db")
    cur = conn.cursor()
    cur.execute("select count from phishcount where key=1")
    curr_count = cur.fetchall()[0][0]
    cur.execute("select count from phishcount where key=1")
    cur.execute(f"update phishcount set count = {curr_count + 1} where key = 1")
    conn.commit()
    conn.close()

    if(not is_string_an_url(url)):
        response["status-code"] = 11
        response["message"] = "Invalid URL Entered"
        return response
    if(website_is_up(url) == False):
        response["status-code"] = 12
        response["message"] = "URL is down or currently unavailable"
        return response
    print("URL : ",url)
    def getData(url):
        suspectScore, summary = run(url)
        phish_percent = round((suspectScore/72)*100,2)
        response["status-code"] = 10
        response["phish_percent"] = phish_percent
        response["summary"] = summary
        print(url, phish_percent)
        return response

    def get_data(key):
    # Check if the data is already in the cache
        # cached_data = redis_conn.get(key)
        # if cached_data is not None:
        #     return cached_data.decode()
        
        # # If the data is not in the cache, retrieve it and store it in the cache
        data = getData(key)
        # redis_conn.set(key, data)
        return data
    
    
    return get_data(url)


    




