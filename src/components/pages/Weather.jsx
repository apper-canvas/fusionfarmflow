import React from 'react'
import WeatherWidget from '@/components/organisms/WeatherWidget'

const Weather = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Weather</h1>
        <p className="text-gray-600 mt-1">Stay informed about weather conditions for better farm planning</p>
      </div>

      {/* Weather Information */}
      <WeatherWidget />
    </div>
  )
}

export default Weather