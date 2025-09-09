import weatherData from '@/services/mockData/weather.json'

class WeatherService {
  constructor() {
    this.weather = weatherData
  }

  async getCurrentWeather() {
    await this.delay(200)
    return { ...this.weather.current }
  }

  async getForecast() {
    await this.delay(300)
    return [...this.weather.forecast]
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new WeatherService()