import requests
import time


def get_load_time(url):
    start = time.time()

    response = requests.get(url)

    end = time.time()

    load_time = end - start

    return load_time


websites = [
    "https://www.google.com",
    "https://www.ynet.co.il",
    "https://www.imdb.com"
]

for website in websites:
    try:
        time_taken = get_load_time(website)
        print(f"{website} took {time_taken:.2f} seconds to load")
    except:
        print(f"Could not load {website}")