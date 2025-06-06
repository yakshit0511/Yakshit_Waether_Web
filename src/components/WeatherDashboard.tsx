import { MapPin, Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import useGeolocation from '../hooks/useGeolocation';
import { fetchForecastData, fetchWeatherData } from '../services/weatherService';
import { ForecastData, Location, WeatherData } from '../types';
import CurrentWeather from './CurrentWeather';
import Favorites from './Favorites';
import Forecast from './Forecast';
import SearchBar from './SearchBar';

const WeatherDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMetric, setIsMetric] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location, isGeoLoading, geoError, getLocation } = useGeolocation();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    const lastLocation = localStorage.getItem('lastLocation');
    if (lastLocation) {
      const parsedLocation = JSON.parse(lastLocation);
      fetchWeather(parsedLocation);
    } else {
      getLocation();
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherByCoords(location.lat, location.lon);
    }
  }, [location]);

  const fetchWeather = async (location: Location) => {
    setIsLoading(true);
    setError(null);
    try {
      const weather = await fetchWeatherData(location, isMetric);
      setWeatherData(weather);
      const forecast = await fetchForecastData(location, isMetric);
      setForecastData(forecast);
      localStorage.setItem('lastLocation', JSON.stringify(location));
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    fetchWeather({ name: 'Current Location', lat, lon });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleUnitSystem = () => {
    const newIsMetric = !isMetric;
    setIsMetric(newIsMetric);
    if (weatherData) {
      fetchWeather({ 
        name: weatherData.name, 
        lat: weatherData.coord.lat, 
        lon: weatherData.coord.lon 
      });
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl transition-colors duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
          Weather Dashboard
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={toggleUnitSystem}
            className="px-3 py-1 rounded-full bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-sm font-medium transition-colors"
          >
            {isMetric ? '°C' : '°F'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Quick Search Buttons */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Quick search:</span>
            {[
              { name: 'Surat', lat: 21.1702, lon: 72.8311 },
              { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
              { name: 'Nadiad', lat: 22.7000, lon: 72.8700 },
              { name: 'Anand', lat: 22.5525, lon: 72.9552 },
              { name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
              { name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
            ].map((city) => (
              <button
                key={city.name}
                onClick={() => fetchWeather(city)}
                className="px-3 py-1 text-sm rounded-full border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors text-gray-800 dark:text-gray-200"
              >
                {city.name}
              </button>
            ))}
          </div>

          <SearchBar onSelectLocation={fetchWeather} onGetCurrentLocation={getLocation} />
          
          {isGeoLoading && !weatherData && (
            <div className="mt-4 text-center">
              <p>Detecting your location...</p>
            </div>
          )}
          
          {geoError && !weatherData && (
            <div className="mt-4 text-center text-red-500">
              <p>{geoError}</p>
              <p className="mt-2">Please search for a location manually.</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="mt-8 flex justify-center">
              <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700 h-64 w-full"></div>
            </div>
          ) : error ? (
            <div className="mt-8 p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : weatherData && (
            <>
              <CurrentWeather 
                weather={weatherData} 
                isMetric={isMetric} 
                isFavorite={isFavorite({ 
                  name: weatherData.name, 
                  lat: weatherData.coord.lat, 
                  lon: weatherData.coord.lon 
                })}
                onToggleFavorite={() => {
                  const location = { 
                    name: weatherData.name, 
                    lat: weatherData.coord.lat, 
                    lon: weatherData.coord.lon 
                  };
                  
                  if (isFavorite(location)) {
                    removeFavorite(location);
                  } else {
                    addFavorite(location);
                  }
                }}
              />
              
              {forecastData && (
                <Forecast forecast={forecastData} isMetric={isMetric} />
              )}
            </>
          )}
        </div>
        
        <div>
          <Favorites 
            favorites={favorites} 
            onSelectLocation={fetchWeather} 
            onRemoveFavorite={removeFavorite}
          />
          
          {weatherData && weatherData.name !== 'Current Location' && (
            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">About {weatherData.name}</h3>
              <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <MapPin size={16} className="mr-1 text-blue-600 dark:text-blue-400" />
                Coordinates: {weatherData.coord.lat.toFixed(2)}, {weatherData.coord.lon.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Local time: {new Date(weatherData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Sunrise(Indian Standard Time): {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Sunset(Indian Standard Time): {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="mt-1">© {new Date().getFullYear()} Yakshit Koshiya. All Rights Reserved.</p>
        <p>Weather data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
};

export default WeatherDashboard;
