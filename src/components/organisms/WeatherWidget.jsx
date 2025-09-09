import React, { useState, useEffect } from 'react'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import weatherService from '@/services/api/weatherService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const WeatherWidget = ({ compact = false }) => {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError('')
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast()
      ])
      setCurrentWeather(current)
      setForecast(forecastData)
    } catch (err) {
      setError('Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'sunny': 'Sun',
      'cloudy': 'Cloud',
      'rainy': 'CloudRain',
      'stormy': 'CloudLightning',
      'snowy': 'CloudSnow',
      'windy': 'Wind'
    }
    return iconMap[condition.toLowerCase()] || 'Cloud'
  }

  const getConditionColor = (condition) => {
    const colorMap = {
      'sunny': 'warning',
      'cloudy': 'default',
      'rainy': 'info',
      'stormy': 'error',
      'snowy': 'info',
      'windy': 'default'
    }
    return colorMap[condition.toLowerCase()] || 'default'
  }

  if (loading) return <Loading rows={1} />
  if (error) return <Error message={error} onRetry={loadWeatherData} />
  if (!currentWeather) return null

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <ApperIcon name={getWeatherIcon(currentWeather.condition)} size={20} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{currentWeather.temperature}°F</p>
              <p className="text-sm text-gray-600">{currentWeather.condition}</p>
            </div>
          </div>
          <Badge variant={getConditionColor(currentWeather.condition)}>
            {currentWeather.condition}
          </Badge>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
          <Badge variant={getConditionColor(currentWeather.condition)}>
            {currentWeather.condition}
          </Badge>
        </div>
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <ApperIcon name={getWeatherIcon(currentWeather.condition)} size={40} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-gray-900">{currentWeather.temperature}°F</p>
            <p className="text-gray-600">Feels like {currentWeather.feelsLike}°F</p>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Droplets" size={16} className="mr-2" />
              <span>{currentWeather.humidity}% Humidity</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Wind" size={16} className="mr-2" />
              <span>{currentWeather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h3>
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <ApperIcon name={getWeatherIcon(day.condition)} size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{day.day}</p>
                  <p className="text-sm text-gray-600 capitalize">{day.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{day.high}°F</p>
                <p className="text-sm text-gray-600">{day.low}°F</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default WeatherWidget