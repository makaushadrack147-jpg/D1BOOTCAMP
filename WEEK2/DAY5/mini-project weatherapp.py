import os
from datetime import datetime

import pytz
from matplotlib import pyplot as plt

try:
    from pyowm import OWM
except ImportError:
    OWM = None


API_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "YOUR_API_KEY")


def get_weather_manager():
    if OWM is None:
        raise ImportError("pyowm is not installed. Please install it with: pip install pyowm")
    if API_KEY == "YOUR_API_KEY":
        raise ValueError(
            "No OpenWeatherMap API key was found. Set the OPENWEATHERMAP_API_KEY environment variable."
        )
    return OWM(API_KEY).weather_manager()


def get_city_id(city_name):
    manager = get_weather_manager()
    search_results = manager.search_city(city_name)
    if not search_results:
        raise ValueError(f"No city found for '{city_name}'.")
    city = search_results[0]
    return city.id, city.name, city.country


def get_current_weather(city_name):
    manager = get_weather_manager()
    observation = manager.weather_at_place(city_name)
    weather = observation.weather
    city_id, city_name_clean, country = get_city_id(city_name)

    temp = weather.temperature('celsius')
    wind = weather.wind()
    sunrise = weather.sunrise_time(timeformat='iso')
    sunset = weather.sunset_time(timeformat='iso')

    return {
        'city_id': city_id,
        'city_name': city_name_clean,
        'country': country,
        'status': weather.detailed_status,
        'temperature': temp,
        'wind': wind,
        'sunrise': sunrise,
        'sunset': sunset,
    }


def display_weather_info(data):
    print(f"\nWeather in {data['city_name']}, {data['country']}:")
    print(f"Condition: {data['status'].title()}")
    print(f"Temperature: {data['temperature']['temp']:.1f}°C")
    print(f"Feels like: {data['temperature']['feels_like']:.1f}°C")
    print(f"Wind speed: {data['wind'].get('speed', 0)} m/s")
    print(f"Sunrise: {data['sunrise']}")
    print(f"Sunset: {data['sunset']}")


def get_forecast(city_name, interval='3h', count=5):
    manager = get_weather_manager()
    forecast = manager.forecast_at_place(city_name, interval)
    forecast_list = forecast.forecast

    print(f"\nForecast for {city_name} (next {count} entries):")
    for item in forecast_list[:count]:
        date = item.reference_time('date')
        temp = item.temperature('celsius')
        humidity = item.humidity
        print(f"{date}: {item.detailed_status.title()} - {temp['day']:.1f}°C, Humidity: {humidity}%")


def get_air_pollution(city_name):
    manager = get_weather_manager()
    city_id, _, _ = get_city_id(city_name)
    air_quality = manager.air_quality_at_id(city_id)
    air_data = air_quality.air_quality_data

    aqi = air_data['aqi']
    print(f"\nAir pollution for {city_name}: AQI = {aqi}")
    for key, value in air_data.items():
        if key != 'aqi':
            print(f"{key}: {value}")


def init_plot():
    plt.figure(figsize=(10, 6))
    plt.title('Humidity Forecast for the Next 3 Days')
    plt.ylabel('Humidity (%)')
    plt.xlabel('Date')
    plt.tight_layout()


def plot_temperatures(city_name):
    manager = get_weather_manager()
    forecast = manager.forecast_at_place(city_name, '3h')
    weather_list = forecast.forecast

    dates = []
    humidity_values = []

    for item in weather_list[:8]:
        date = item.reference_time('date')
        dates.append(date.strftime('%d %b'))
        humidity_values.append(item.humidity)

    bars = plt.bar(dates[:3], humidity_values[:3], color='skyblue')
    for bar, humidity in zip(bars, humidity_values[:3]):
        plt.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + 2,
            f'{humidity}%',
            ha='center',
            va='bottom',
        )

    plt.xticks(rotation=0)
    plt.bar_label(bars, labels=[f'{value}%' for value in humidity_values[:3]], padding=3)
    plt.show()


def write_humidity_on_bar_chart(city_name):
    manager = get_weather_manager()
    forecast = manager.forecast_at_place(city_name, '3h')
    weather_list = forecast.forecast

    labels = []
    humidity_values = []
    for item in weather_list[:3]:
        labels.append(item.reference_time('date').strftime('%d %b'))
        humidity_values.append(item.humidity)

    init_plot()
    plt.bar(labels, humidity_values, color='steelblue')
    for index, value in enumerate(humidity_values):
        plt.text(index, value + 2, f'{value}%', ha='center')
    plt.show()


def simulate_weather_app():
    print("Welcome to the Weather App!")
    print("This app requires a valid OpenWeatherMap API key.")
    print("Set the OPENWEATHERMAP_API_KEY environment variable before running.")

    while True:
        print("\nMenu:")
        print("1. Show Paris weather")
        print("2. Show weather for a chosen city")
        print("3. Show forecast")
        print("4. Show air pollution")
        print("5. Show humidity chart (bonus)")
        print("6. Exit")

        choice = input("Choose an option: ").strip()

        if choice == '1':
            weather_data = get_current_weather('Paris,FR')
            display_weather_info(weather_data)
        elif choice == '2':
            city = input("Enter city name: ").strip()
            weather_data = get_current_weather(city)
            display_weather_info(weather_data)
        elif choice == '3':
            city = input("Enter city name for forecast: ").strip()
            get_forecast(city)
        elif choice == '4':
            city = input("Enter city name for air pollution: ").strip()
            get_air_pollution(city)
        elif choice == '5':
            city = input("Enter city name for humidity chart: ").strip()
            write_humidity_on_bar_chart(city)
        elif choice == '6':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please select a number from the menu.")


if __name__ == "__main__":
    try:
        simulate_weather_app()
    except ValueError as error:
        print(f"Error: {error}")
    except Exception as error:
        print(f"Unexpected error: {error}")
