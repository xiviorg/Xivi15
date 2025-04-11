
import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import axios from 'axios';

export function Weather() {
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get location from IP
        const ipRes = await axios.get('https://ipapi.co/json/');
        const { city } = ipRes.data;
        setLocation(city);

        const weatherRes = await axios.get(
          `https://goweather.herokuapp.com/weather/${city}`
        );

        setForecast(weatherRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather data');
        console.error('Weather error:', err);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  if (loading) {
    return <div className="p-4">Loading weather data...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {location && <h2 className="text-2xl font-bold">Weather for {location}</h2>}
      {error && <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>}

      {forecast && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="font-bold">Today</div>
            <div className="text-2xl">{forecast.temperature}</div>
            <div>{forecast.description}</div>
            <div>Wind: {forecast.wind}</div>
          </Card>
          {forecast.forecast?.map((day: any, index: number) => {
            const date = new Date();
            date.setDate(date.getDate() + index + 1);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            return (
              <Card key={index} className="p-4">
                <div className="font-bold">{dayName}</div>
                <div className="text-2xl">{day.temperature}</div>
                <div>Wind: {day.wind}</div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
