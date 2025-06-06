import { Droplets, Heart, Thermometer, Wind } from 'lucide-react';
import React from 'react';
import { WeatherData } from '../types';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  isMetric: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  isMetric,
  isFavorite,
  onToggleFavorite
}) => {
  const getWeatherBackground = (condition: string, isDay: boolean) => {
    if (condition.includes('clear')) {
      return isDay
        ? 'from-blue-400 to-blue-600'
        : 'from-indigo-900 to-blue-900';
    } else if (condition.includes('cloud')) {
      return isDay
        ? 'from-blue-300 to-gray-400'
        : 'from-gray-700 to-gray-900';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'from-gray-400 to-gray-600';
    } else if (condition.includes('thunderstorm')) {
      return 'from-gray-700 to-gray-900';
    } else if (condition.includes('snow')) {
      return 'from-blue-100 to-gray-300';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return 'from-gray-300 to-gray-500';
    } else {
      return isDay
        ? 'from-blue-300 to-blue-500'
        : 'from-gray-700 to-gray-900';
    }
  };

  const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
  const weatherCondition = weather.weather[0].main.toLowerCase();
  const gradientClasses = getWeatherBackground(weatherCondition, isDay);

  return (
    <div className={`mt-6 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${gradientClasses} text-white relative`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors ${isFavorite ? 'text-red-500' : 'text-white'}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{weather.name}</h2>
            <p className="text-lg opacity-90">{weather.weather[0].description}</p>
            <div className="mt-6 flex items-center">
              <span className="text-5xl md:text-6xl font-bold">{Math.round(weather.main.temp)}°</span>
              <span className="ml-2 text-lg">{isMetric ? 'F' : 'C'}</span>
            </div>
            <p className="mt-2 text-sm opacity-90">
              Feels like {Math.round(weather.main.feels_like)}°{isMetric ? 'F' : 'C'}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <WeatherIcon
              condition={weather.weather[0].main}
              size={80}
              isDay={isDay}
              animate={true}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <Thermometer size={24} className="opacity-80" />
            <p className="mt-1 font-medium">{Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°</p>
            <p className="text-xs opacity-75">Min / Max</p>
          </div>

          <div className="flex flex-col items-center">
            <Droplets size={24} className="opacity-80" />
            <p className="mt-1 font-medium">{weather.main.humidity}%</p>
            <p className="text-xs opacity-75">Humidity</p>
          </div>

          <div className="flex flex-col items-center">
            <Wind size={24} className="opacity-80" />
            <p className="mt-1 font-medium">
              {Math.round(weather.wind.speed)} {isMetric ? 'm/s' : 'mph'}
            </p>
            <p className="text-xs opacity-75">Wind</p>
          </div>
        </div>

        <p className="mt-6 text-xs opacity-75 text-center">
          Last updated: {new Date(weather.dt * 1000).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default CurrentWeather;