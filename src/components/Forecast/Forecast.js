import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import './Forecast.css';

const Forecast = () => {
    const { forecast } = useWeather();

    if (!forecast || forecast.length === 0) {
        return null;
    }

    // Capitalizar primeira letra
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Formatar data
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'short'
        }).format(date);
    };

    return (
        <div className="forecast-container">
            <h2 className="forecast-title">Previsão para os próximos dias</h2>

            <div className="forecast-cards">
                {forecast.map((day) => (
                    <div key={day.date} className="forecast-card">
                        <div className="forecast-day">
                            <h3>{capitalize(day.day)}</h3>
                            <p className="forecast-date">{formatDate(day.date)}</p>
                        </div>

                        <div className="forecast-icon">
                            <img
                                src={`http://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                                alt={day.weather.description}
                            />
                            <p className="forecast-description">{day.weather.description}</p>
                        </div>

                        <div className="forecast-temps">
                            <div className="temp-max">
                                <span className="temp-label">Máx</span>
                                <span className="temp-value">{Math.round(day.temp_max)}°C</span>
                            </div>
                            <div className="temp-min">
                                <span className="temp-label">Mín</span>
                                <span className="temp-value">{Math.round(day.temp_min)}°C</span>
                            </div>
                        </div>

                        <button className="forecast-details-toggle" aria-label="Ver detalhes">
                            Ver detalhes por hora
                        </button>

                        <div className="forecast-hourly-container">
                            <div className="forecast-hourly-scroll">
                                {day.items.map((item, index) => (
                                    <div key={index} className="forecast-hourly-item">
                                        <span className="hourly-time">{item.time}</span>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${item.weather.icon}.png`}
                                            alt={item.weather.description}
                                            className="hourly-icon"
                                        />
                                        <span className="hourly-temp">{Math.round(item.temp)}°C</span>
                                        <span className="hourly-humidity">{item.humidity}%</span>
                                        <span className="hourly-wind">{(item.wind_speed * 3.6).toFixed(1)} km/h</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forecast;