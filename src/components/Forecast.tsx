import React from 'react';
import { ForecastData } from '../types';
import WeatherIcon from './WeatherIcon';

interface ForecastProps {
  forecast: ForecastData;
  isMetric: boolean;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, isMetric }) => {
  // Group forecast data by day
  const groupedForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    
    if (!acc[date]) {
      acc[date] = {
        date,
        timestamps: [],
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        icon: item.weather[0].main,
        description: item.weather[0].description
      };
    }
    
    acc[date].timestamps.push(item);
    acc[date].minTemp = Math.min(acc[date].minTemp, item.main.temp_min);
    acc[date].maxTemp = Math.max(acc[date].maxTemp, item.main.temp_max);
    
    return acc;
  }, {} as Record<string, any>);
  
  // Convert to array and limit to 5 days
  const forecastDays = Object.values(groupedForecast).slice(0, 5);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5-Day Forecast</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecastDays.map((day, index) => {
          // Determine if it's the current day
          const isToday = index === 0;
          
          return (
            <div 
              key={day.date}
              className={`p-4 rounded-lg ${
                isToday 
                  ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                  : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
              } transition-colors hover:shadow-md`}
            >
              <div className="flex flex-col items-center">
                <h4 className={`font-medium ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {isToday ? 'Today' : day.date}
                </h4>
                
                <div className="my-2">
                  <WeatherIcon condition={day.icon} size={40} isDay={true} animate={false} />
                </div>
                
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
                  {day.description}
                </p>
                
                <p className="text-base font-medium">
                  <span className="text-red-600 dark:text-red-400">{Math.round(day.maxTemp)}°</span>
                  {' / '}
                  <span className="text-blue-600 dark:text-blue-400">{Math.round(day.minTemp)}°</span>
                  <span className="ml-1 text-sm">{isMetric ? 'F' : 'C'}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 overflow-x-auto pb-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Hourly Forecast</h3>
        <div className="flex space-x-4 min-w-max">
          {forecast.list.slice(0, 8).map((item) => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div 
                key={item.dt}
                className="p-3 min-w-24 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col items-center"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{time}</p>
                <div className="my-2">
                  <WeatherIcon 
                    condition={item.weather[0].main} 
                    size={32} 
                    isDay={true} 
                    animate={false} 
                  />
                </div>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {Math.round(item.main.temp)}°<span className="ml-1 text-sm">{isMetric ? 'F' : 'C'}</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {Math.round(item.wind.speed)} {isMetric ? 'm/s' : 'mph'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Forecast;