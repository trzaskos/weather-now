import React, { createContext, useState, useContext } from 'react';
import { fetchWeatherByCity, fetchForecast, fetchWeatherByCoords } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

// Create context
const WeatherContext = createContext();

// Custom hook to use the context
export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [location, setLocation] = useState('');
    const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);

    // Add city to recent searches
    const addToRecentSearches = (city) => {
        setRecentSearches(prev => {
            // Add to beginning of array and remove duplicates
            const newSearches = [city, ...prev.filter(s => s !== city)];
            // Limit to 5 recent searches
            return newSearches.slice(0, 5);
        });
    };

    // Search weather by city name
    const searchByCity = async (city, setLoading, setError) => {
        try {
            setLoading(true);
            setError(null);

            const weatherData = await fetchWeatherByCity(city);
            setCurrentWeather(weatherData);
            setLocation(weatherData.name + ', ' + weatherData.sys.country);

            // Get forecast for 5 days
            const forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);
            setForecast(forecastData);

            // Add to recent searches
            addToRecentSearches(weatherData.name);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 404) {
                setError('City not found. Please check the name and try again.');
            } else {
                setError('Error fetching weather data. Please try again later.');
            }
            console.error('Error fetching weather data:', error);
        }
    };

    // Search weather using geolocation
    const searchByCurrentLocation = async (setLoading, setError) => {
        try {
            setLoading(true);
            setError(null);

            // Request location permission from user
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Get current weather data
                    const weatherData = await fetchWeatherByCoords(latitude, longitude);
                    setCurrentWeather(weatherData);
                    setLocation(weatherData.name + ', ' + weatherData.sys.country);

                    // Get forecast for 5 days
                    const forecastData = await fetchForecast(latitude, longitude);
                    setForecast(forecastData);

                    // Add to recent searches
                    addToRecentSearches(weatherData.name);

                    setLoading(false);
                },
                (error) => {
                    setLoading(false);
                    setError('Unable to get your location. Please check browser permissions.');
                    console.error('Geolocation error:', error);
                }
            );
        } catch (error) {
            setLoading(false);
            setError('Error fetching weather data. Please try again later.');
            console.error('Error fetching weather data:', error);
        }
    };

    // Values and functions to be provided by the context
    const value = {
        currentWeather,
        forecast,
        location,
        recentSearches,
        searchByCity,
        searchByCurrentLocation
    };

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
};