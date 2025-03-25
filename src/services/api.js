import axios from 'axios';

// OpenWeatherMap API Key
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Default configuration for requests
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
        units: 'metric', // Use metric units (Celsius)
        lang: 'en', // Results in English
    },
});

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Throttling configuration
let lastApiCall = 0;
const MIN_TIME_BETWEEN_CALLS = 1000; // 1 second minimum between API calls

// API call counter for daily usage tracking
const todayKey = new Date().toISOString().split('T')[0];

const getApiCallCount = () => {
    const countData = localStorage.getItem('api_call_count') || '{}';
    const counts = JSON.parse(countData);
    return counts[todayKey] || 0;
};

const incrementApiCallCount = () => {
    const countData = localStorage.getItem('api_call_count') || '{}';
    const counts = JSON.parse(countData);
    counts[todayKey] = (counts[todayKey] || 0) + 1;
    localStorage.setItem('api_call_count', JSON.stringify(counts));
    return counts[todayKey];
};

// Apply throttling to any API call
const throttleApiCall = async () => {
    const now = Date.now();
    if (now - lastApiCall < MIN_TIME_BETWEEN_CALLS) {
        // Wait to avoid too frequent calls
        await new Promise(resolve =>
            setTimeout(resolve, MIN_TIME_BETWEEN_CALLS - (now - lastApiCall))
        );
    }
    lastApiCall = Date.now();
};

// Check API call limit and increment counter
const trackApiUsage = () => {
    const count = getApiCallCount();
    const newCount = incrementApiCallCount();

    // Log API usage for debugging
    console.log(`API call count for today: ${newCount}`);

    // Optional: Add a limit if needed (1000 calls per day is a safe number for free plan)
    if (count > 1000) {
        throw new Error('Daily API call limit reached. Please try again tomorrow.');
    }
};

// Function to fetch current weather by city name with caching and throttling
export const fetchWeatherByCity = async (city) => {
    try {
        // Check cache first
        const cacheKey = `weather_${city.toLowerCase().trim()}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // If cache is fresh (less than 30 minutes old), return cached data
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('Using cached weather data for:', city);
                return data;
            }
        }

        // Apply throttling before making API call
        await throttleApiCall();

        // Track API usage
        trackApiUsage();

        // Make API call
        const response = await api.get('/weather', {
            params: {
                q: city,
            },
        });

        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
            data: response.data,
            timestamp: Date.now()
        }));

        return response.data;
    } catch (error) {
        // Re-throw the error to be handled by the caller
        throw error;
    }
};

// Function to fetch current weather by coordinates with caching and throttling
export const fetchWeatherByCoords = async (lat, lon) => {
    try {
        // Check cache first
        const cacheKey = `weather_coords_${lat}_${lon}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // If cache is fresh (less than 30 minutes old), return cached data
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('Using cached weather data for coordinates:', lat, lon);
                return data;
            }
        }

        // Apply throttling before making API call
        await throttleApiCall();

        // Track API usage
        trackApiUsage();

        // Make API call
        const response = await api.get('/weather', {
            params: {
                lat,
                lon,
            },
        });

        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
            data: response.data,
            timestamp: Date.now()
        }));

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to fetch 5-day forecast by coordinates with caching and throttling
export const fetchForecast = async (lat, lon) => {
    try {
        // Check cache first
        const cacheKey = `forecast_${lat}_${lon}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // If cache is fresh (less than 30 minutes old), return cached data
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('Using cached forecast data for coordinates:', lat, lon);
                return data;
            }
        }

        // Apply throttling before making API call
        await throttleApiCall();

        // Track API usage
        trackApiUsage();

        // Make API call
        const response = await api.get('/forecast', {
            params: {
                lat,
                lon,
            },
        });

        // Process data for easier display
        const processedData = processForecastData(response.data);

        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
            data: processedData,
            timestamp: Date.now()
        }));

        return processedData;
    } catch (error) {
        throw error;
    }
};

// Helper function to process forecast data
const processForecastData = (data) => {
    // Group forecasts by day
    const forecastByDay = {};

    data.list.forEach((item) => {
        // Convert timestamp to Date object
        const date = new Date(item.dt * 1000);

        // Get date in YYYY-MM-DD format (without hours)
        const dayKey = date.toISOString().split('T')[0];

        // If there isn't a group for this day yet, create one
        if (!forecastByDay[dayKey]) {
            forecastByDay[dayKey] = {
                date: dayKey,
                day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
                items: [],
            };
        }

        // Add this item to the corresponding day group
        forecastByDay[dayKey].items.push({
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            temp: item.main.temp,
            feels_like: item.main.feels_like,
            humidity: item.main.humidity,
            weather: item.weather[0],
            wind_speed: item.wind.speed,
            clouds: item.clouds.all,
            dt: item.dt,
        });
    });

    // Convert to array and add calculated data
    const processedForecast = Object.values(forecastByDay).map((day) => {
        // Calculate min/max/average temperatures for the day
        const temps = day.items.map((item) => item.temp);
        day.temp_min = Math.min(...temps);
        day.temp_max = Math.max(...temps);
        day.temp_avg = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;

        // Determine the main icon and description for the day
        // (using midday record when possible)
        const middayItem = day.items.find((item) => {
            const hour = new Date(item.dt * 1000).getHours();
            return hour >= 11 && hour <= 13;
        }) || day.items[0];

        day.weather = middayItem.weather;

        return day;
    });

    // Limit to 5 days
    return processedForecast.slice(0, 5);
};