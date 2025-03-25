import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import './Search.css';

const Search = ({ setLoading, setError }) => {
    const [city, setCity] = useState('');
    const { searchByCity, searchByCurrentLocation, recentSearches } = useWeather();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            searchByCity(city, setLoading, setError);
            setCity('');
        }
    };

    const handleLocationClick = () => {
        searchByCurrentLocation(setLoading, setError);
    };

    const handleRecentSearch = (recentCity) => {
        searchByCity(recentCity, setLoading, setError);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="City name"
                />
                <button type="submit" className="search-button">
                    <span className="search-icon">🔍</span>
                    <span className="search-text">Search</span>
                </button>
            </form>

            <button
                type="button"
                className="location-button"
                onClick={handleLocationClick}
                aria-label="Use my location"
            >
                <span className="location-icon">📍</span>
                <span className="location-text">Use my location</span>
            </button>

            {recentSearches.length > 0 && (
                <div className="recent-searches">
                    <h3 className="recent-title">Recent Searches</h3>
                    <div className="recent-list">
                        {recentSearches.map((recentCity, index) => (
                            <button
                                key={index}
                                className="recent-item"
                                onClick={() => handleRecentSearch(recentCity)}
                            >
                                {recentCity}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;