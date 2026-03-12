// Shared data fetching functions for agricultural APIs
// These functions are used by both API routes and can be called directly

export interface WeatherData {
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  windDirection: string
  uvIndex: number
  condition: string
  location: string
  forecast: Array<{ day: string; temp: number; condition: string }>
}

export interface SoilData {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  organicCarbon: number
  texture: { clay: number; sand: number; silt: number }
  soilType: string
  healthStatus: string
  location: { lat: number; lon: number }
}

export interface NdviData {
  ndvi: number
  vegetationHealth: string
  timestamp: string
  location: { lat: number; lon: number }
  source: string
  recommendations: string[]
}

// Mock weather data for when API key is not available
export function getMockWeatherData(): WeatherData {
  return {
    temperature: 24.5,
    humidity: 62,
    precipitation: 12.4,
    windSpeed: 14,
    windDirection: "NE",
    uvIndex: 8.2,
    condition: "Partly Cloudy",
    location: "Sacramento, CA",
    forecast: [
      { day: "Mon", temp: 24, condition: "sunny" },
      { day: "Tue", temp: 22, condition: "cloudy" },
      { day: "Wed", temp: 19, condition: "rainy" },
      { day: "Thu", temp: 25, condition: "sunny" },
      { day: "Fri", temp: 26, condition: "cloudy" },
      { day: "Sat", temp: 28, condition: "sunny" },
      { day: "Sun", temp: 27, condition: "partly_cloudy" },
    ]
  }
}

// Mock soil data
export function getMockSoilData(lat: number, lon: number): SoilData {
  return {
    nitrogen: 75,
    phosphorus: 45,
    potassium: 82,
    ph: 6.5,
    organicCarbon: 2.5,
    texture: { clay: 25, sand: 45, silt: 30 },
    soilType: "Loamy",
    healthStatus: "Good",
    location: { lat, lon }
  }
}

// Simulated NDVI data based on location and season
export function getSimulatedNdviData(lat: number, lon: number): NdviData {
  const month = new Date().getMonth()
  const seasonalFactor = Math.sin((month / 12) * Math.PI * 2) * 0.2 + 0.6
  const latFactor = 1 - Math.abs(lat - 35) / 50
  const baseNdvi = 0.5 + (latFactor * 0.3) + (Math.random() * 0.1)
  const ndvi = Math.min(1, Math.max(0, baseNdvi * seasonalFactor))
  
  return {
    ndvi: Math.round(ndvi * 1000) / 1000,
    vegetationHealth: getVegetationHealth(ndvi),
    timestamp: new Date().toISOString(),
    location: { lat, lon },
    source: "simulated",
    recommendations: getNdviRecommendations(ndvi)
  }
}

export function getVegetationHealth(ndvi: number): string {
  if (ndvi >= 0.7) return "Excellent"
  if (ndvi >= 0.5) return "Good"
  if (ndvi >= 0.3) return "Moderate"
  if (ndvi >= 0.1) return "Sparse"
  return "Poor/Barren"
}

export function getNdviRecommendations(ndvi: number): string[] {
  const recommendations: string[] = []
  
  if (ndvi < 0.3) {
    recommendations.push("Consider irrigation to improve vegetation health")
    recommendations.push("Apply nitrogen-rich fertilizer")
    recommendations.push("Check for pest or disease damage")
  } else if (ndvi < 0.5) {
    recommendations.push("Monitor soil moisture levels closely")
    recommendations.push("Consider foliar feeding to boost growth")
  } else if (ndvi < 0.7) {
    recommendations.push("Vegetation health is good, maintain current practices")
    recommendations.push("Monitor for any changes in NDVI trends")
  } else {
    recommendations.push("Excellent vegetation health")
    recommendations.push("Consider reducing fertilizer application")
    recommendations.push("Optimal conditions for harvest timing analysis")
  }
  
  return recommendations
}

// Fetch weather data from OpenWeatherMap
export async function fetchWeatherData(lat: string, lon: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY
  
  if (!apiKey) {
    return getMockWeatherData()
  }
  
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const weatherResponse = await fetch(weatherUrl, { next: { revalidate: 300 } })
    
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }
    
    const weatherData = await weatherResponse.json()
    
    // Get wind direction from degrees
    const getWindDirection = (degrees: number) => {
      const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
      const index = Math.round(degrees / 45) % 8
      return directions[index]
    }
    
    // Map weather condition codes
    const getCondition = (code: number) => {
      if (code >= 200 && code < 300) return "Thunderstorm"
      if (code >= 300 && code < 400) return "Drizzle"
      if (code >= 500 && code < 600) return "Rain"
      if (code >= 600 && code < 700) return "Snow"
      if (code >= 700 && code < 800) return "Mist"
      if (code === 800) return "Clear"
      if (code > 800) return "Cloudy"
      return "Unknown"
    }
    
    return {
      temperature: Math.round(weatherData.main.temp * 10) / 10,
      humidity: weatherData.main.humidity,
      precipitation: weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0,
      windSpeed: Math.round(weatherData.wind.speed * 3.6),
      windDirection: getWindDirection(weatherData.wind.deg),
      uvIndex: 5,
      condition: getCondition(weatherData.weather[0].id),
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      forecast: []
    }
  } catch (error) {
    console.error("[v0] Weather fetch error:", error)
    return getMockWeatherData()
  }
}

// Fetch soil data from SoilGrids
export async function fetchSoilData(lat: string, lon: string): Promise<SoilData> {
  try {
    const properties = ["nitrogen", "phh2o", "cec", "soc", "clay", "sand", "silt"]
    const depth = "0-5cm"
    
    const soilUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=${properties.join("&property=")}&depth=${depth}&value=mean`
    
    const response = await fetch(soilUrl, {
      next: { revalidate: 86400 },
      headers: { "Accept": "application/json" }
    })
    
    if (!response.ok) {
      throw new Error(`SoilGrids API error: ${response.status}`)
    }
    
    const data = await response.json()
    const layers = data.properties?.layers || []
    
    let nitrogen = 75, phosphorus = 45, potassium = 82, ph = 6.5
    let organicCarbon = 2.5, clay = 25, sand = 45, silt = 30
    
    for (const layer of layers) {
      const value = layer.depths?.[0]?.values?.mean
      if (value === undefined) continue
      
      switch (layer.name) {
        case "nitrogen":
          nitrogen = Math.min(100, Math.round((value / 500) * 100))
          break
        case "phh2o":
          ph = value / 10
          break
        case "cec":
          potassium = Math.min(100, Math.round((value / 40) * 100))
          break
        case "soc":
          organicCarbon = value / 10
          phosphorus = Math.min(100, Math.round((value / 300) * 100))
          break
        case "clay":
          clay = value / 10
          break
        case "sand":
          sand = value / 10
          break
        case "silt":
          silt = value / 10
          break
      }
    }
    
    const getSoilType = (s: number, c: number, si: number) => {
      if (s > 70) return "Sandy"
      if (c > 40) return "Clay"
      if (si > 50) return "Silty"
      if (s > 45 && c < 20) return "Sandy Loam"
      if (c >= 20 && c <= 35 && si >= 28 && si <= 50) return "Loamy"
      return "Mixed"
    }
    
    const getSoilHealth = (n: number, p: number, k: number) => {
      const avg = (n + p + k) / 3
      if (avg >= 70) return "Optimal"
      if (avg >= 50) return "Good"
      if (avg >= 30) return "Fair"
      return "Poor"
    }
    
    return {
      nitrogen,
      phosphorus,
      potassium,
      ph: Math.round(ph * 10) / 10,
      organicCarbon: Math.round(organicCarbon * 10) / 10,
      texture: { clay: Math.round(clay), sand: Math.round(sand), silt: Math.round(silt) },
      soilType: getSoilType(sand, clay, silt),
      healthStatus: getSoilHealth(nitrogen, phosphorus, potassium),
      location: { lat: parseFloat(lat), lon: parseFloat(lon) }
    }
  } catch (error) {
    console.error("[v0] Soil fetch error:", error)
    return getMockSoilData(parseFloat(lat), parseFloat(lon))
  }
}

// Fetch NDVI data
export async function fetchNdviData(lat: string, lon: string): Promise<NdviData> {
  const nasaApiKey = process.env.NASA_API_KEY
  
  if (!nasaApiKey) {
    return getSimulatedNdviData(parseFloat(lat), parseFloat(lon))
  }
  
  try {
    const date = new Date()
    const year = date.getFullYear()
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000)
    
    const modisUrl = `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset?latitude=${lat}&longitude=${lon}&startDate=A${year}${String(dayOfYear).padStart(3, "0")}&endDate=A${year}${String(dayOfYear).padStart(3, "0")}&kmAboveBelow=0&kmLeftRight=0`
    
    const response = await fetch(modisUrl, {
      next: { revalidate: 86400 },
      headers: {
        "Authorization": `Bearer ${nasaApiKey}`,
        "Accept": "application/json"
      }
    })
    
    if (!response.ok) {
      throw new Error(`MODIS API error: ${response.status}`)
    }
    
    const data = await response.json()
    const ndviValue = data.subset?.[0]?.data?.[0]
    const ndvi = ndviValue ? ndviValue * 0.0001 : 0.65
    
    return {
      ndvi: Math.round(ndvi * 1000) / 1000,
      vegetationHealth: getVegetationHealth(ndvi),
      timestamp: new Date().toISOString(),
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      source: "MODIS MOD13Q1",
      recommendations: getNdviRecommendations(ndvi)
    }
  } catch (error) {
    console.error("[v0] NDVI fetch error:", error)
    return getSimulatedNdviData(parseFloat(lat), parseFloat(lon))
  }
}
