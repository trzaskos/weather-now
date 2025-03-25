import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import './CurrentWeather.css';

const CurrentWeather = () => {
    const { currentWeather, location } = useWeather();

    if (!currentWeather) {
        return null;
    }

    // Formatação de data e hora
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    // Formatação de data
    const formatDate = () => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date().toLocaleDateString('pt-BR', options);
    };

    // Converter m/s para km/h (velocidade do vento)
    const msToKmh = (ms) => {
        return (ms * 3.6).toFixed(1);
    };

    // Determinar direção do vento
    const getWindDirection = (degrees) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    // Calcular temperatura em Fahrenheit
    const celsiusToFahrenheit = (celsius) => {
        return (celsius * 9 / 5 + 32).toFixed(1);
    };

    return (
        <div className="current-weather">
            <div className="current-weather-header">
                <h2 className="location">{location}</h2>
                <p className="date">{formatDate()}</p>
            </div>

            <div className="current-weather-content">
                <div className="weather-main">
                    <img
                        src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                        alt={currentWeather.weather[0].description}
                        className="weather-icon"
                    />
                    <div className="temperature-container">
                        <span className="temperature">{Math.round(currentWeather.main.temp)}°C</span>
                        <span className="temperature-fahrenheit">
                            {celsiusToFahrenheit(currentWeather.main.temp)}°F
                        </span>
                    </div>
                    <div className="weather-description">
                        <p className="description">{currentWeather.weather[0].description}</p>
                        <p className="feels-like">
                            Sensação térmica: {Math.round(currentWeather.main.feels_like)}°C
                        </p>
                    </div>
                </div>

                <div className="weather-details">
                    <div className="detail-item">
                        <span className="detail-label">Mínima</span>
                        <span className="detail-value">{Math.round(currentWeather.main.temp_min)}°C</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Máxima</span>
                        <span className="detail-value">{Math.round(currentWeather.main.temp_max)}°C</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Umidade</span>
                        <span className="detail-value">{currentWeather.main.humidity}%</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Vento</span>
                        <span className="detail-value">
                            {msToKmh(currentWeather.wind.speed)} km/h {getWindDirection(currentWeather.wind.deg)}
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Pressão</span>
                        <span className="detail-value">{currentWeather.main.pressure} hPa</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Visibilidade</span>
                        <span className="detail-value">{(currentWeather.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>

                <div className="sun-times">
                    <div className="sun-item">
                        <span className="sun-icon">🌅</span>
                        <div className="sun-info">
                            <span className="sun-label">Nascer do Sol</span>
                            <span className="sun-time">{formatTime(currentWeather.sys.sunrise)}</span>
                        </div>
                    </div>
                    <div className="sun-item">
                        <span className="sun-icon">🌇</span>
                        <div className="sun-info">
                            <span className="sun-label">Pôr do Sol</span>
                            <span className="sun-time">{formatTime(currentWeather.sys.sunset)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;