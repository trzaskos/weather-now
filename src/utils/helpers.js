/**
 * Converts temperature from Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5 + 32).toFixed(1);
};

/**
 * Converts wind speed from m/s to km/h
 * @param {number} speedInMS - Wind speed in meters per second
 * @returns {number} - Wind speed in kilometers per hour
 */
export const msToKmh = (speedInMS) => {
    return (speedInMS * 3.6).toFixed(1);
};

/**
 * Gets the wind direction based on degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} - Wind direction as cardinal direction
 */
export const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

/**
 * Formats a timestamp into a readable time
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Formats a date string into a readable date
 * @param {string} dateStr - Date string in ISO format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Gets the appropriate icon for weather condition
 * @param {string} iconCode - OpenWeatherMap icon code
 * @returns {string} - URL for weather icon
 */
export const getWeatherIconUrl = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};