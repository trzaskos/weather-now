import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search/Search';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Forecast from './components/Forecast/Forecast';
import { WeatherProvider } from './context/WeatherContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import ApiUsageWarning from './components/ApiUsageWarning/ApiUsageWarning';
import useLocalStorage from './hooks/useLocalStorage';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <WeatherProvider>
      <div className={`app ${theme}`}>
        <header className="app-header">
          <h1>WeatherNow</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <main className="app-content">
          <Search setLoading={setLoading} setError={setError} />

          {loading && <LoadingSpinner />}

          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <>
              <CurrentWeather />
              <Forecast />
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>Developed with ❤️ using React and OpenWeatherMap API</p>
          <p>&copy; {new Date().getFullYear()} WeatherNow</p>
        </footer>

        {/* API Usage Warning Banner */}
        <ApiUsageWarning />
        <Analytics />
      </div>
    </WeatherProvider>
  );
}

export default App;