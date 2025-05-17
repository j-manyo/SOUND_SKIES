import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';

const WeatherContext = createContext();

// Replace with your actual API key
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const WeatherProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        fetchWeather(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        setErrorMsg('Could not fetch location');
        console.error(error);
      }
    })();
  }, []);

  // Fetch weather data
  const fetchWeather = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMsg('Could not fetch weather data');
      setLoading(false);
      console.error(error);
    }
  };

  // Refresh weather data
  const refreshWeather = async () => {
    if (location) {
      await fetchWeather(location.coords.latitude, location.coords.longitude);
    }
  };

  // Get weather for another location
  const getWeatherForLocation = async (cityName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/weather?q=${cityName}&units=metric&appid=${WEATHER_API_KEY}`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMsg('Could not fetch weather data for this location');
      setLoading(false);
      console.error(error);
    }
  };

  // Get weather condition category
  const getWeatherCondition = () => {
    if (!weather) return null;

    const id = weather.weather[0].id;
    
    // Thunderstorm
    if (id >= 200 && id < 300) return 'thunderstorm';
    // Drizzle and Rain
    if (id >= 300 && id < 600) return 'rain';
    // Snow
    if (id >= 600 && id < 700) return 'snow';
    // Atmosphere (fog, mist, etc)
    if (id >= 700 && id < 800) return 'atmosphere';
    // Clear
    if (id === 800) return 'clear';
    // Clouds
    if (id > 800) return 'clouds';

    return null;
  };

  return (
    <WeatherContext.Provider
      value={{
        location,
        weather,
        loading,
        errorMsg,
        refreshWeather,
        getWeatherForLocation,
        getWeatherCondition,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);

export default WeatherContext;
