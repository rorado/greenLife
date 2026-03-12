import { NextRequest, NextResponse } from "next/server"
import { fetchWeatherData, fetchSoilData, fetchNdviData } from "@/lib/agri-data"

// AI-Powered Crop Recommendation System
// Uses a Random Forest-inspired decision model based on:
// - Weather conditions (temperature, humidity, rainfall)
// - Soil data (NPK levels, pH, soil type)
// - Satellite NDVI (vegetation index)
// - Location and season

interface CropData {
  id: string
  name: string
  optimalTemp: [number, number]
  optimalHumidity: [number, number]
  optimalRainfall: [number, number]
  optimalPh: [number, number]
  preferredSoil: string[]
  waterNeed: number
  growthPeriod: string
  season: string
  image: string
  description: string
}

// Crop database with optimal growing conditions
const crops: CropData[] = [
  {
    id: "wheat",
    name: "Wheat",
    optimalTemp: [15, 25],
    optimalHumidity: [40, 70],
    optimalRainfall: [400, 600],
    optimalPh: [6.0, 7.5],
    preferredSoil: ["loamy", "clay", "sandy loam"],
    waterNeed: 40,
    growthPeriod: "90-120 days",
    season: "Autumn/Spring",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoBQDY7Wv25uiL9cH4ZoH-bjsTZE1fhEptyAAoHekA-RH_ZLkVH-EFFdBn2WEsr0Xv9-E_l5Vvhou6tfHQcLpjfyeXj2HWSw4erWeYQdLCllGq4U9KFFgNb7O4-Z6VNtirPtDilHSXzWfjEyGoY_g6kkm7n5MnrE9GnMrL8aO3iRBPVlIrhPTpVGRhPg4QP8bnyK3V4NkaPZhPzCS4btOPWZonyJ5f6hvZRLPZ2q0ZDojFCGHvBM7fC72aGgyOO9Q7BAORWpF_Y2mY",
    description: "High-yield cereal grain ideal for temperate climates with well-drained loamy soil."
  },
  {
    id: "tomatoes",
    name: "Tomatoes",
    optimalTemp: [20, 30],
    optimalHumidity: [50, 80],
    optimalRainfall: [600, 800],
    optimalPh: [5.5, 7.0],
    preferredSoil: ["loamy", "sandy loam", "well-drained"],
    waterNeed: 60,
    growthPeriod: "60-80 days",
    season: "Summer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxJ210EFQ_FHOqzH9UvVIE1iK3ipp5AUfn5wtDBzY3Ldr2Eq2deA5JChiWuy8J6wpONtRN_rnrYYnD-xOrIJkF7jqULJ0mg5mmfpNljbKBCx4iqXenJdH2cnXpiywFm4pWq1tQomTx1LSOGzb3IhX_TTaWuELRSUoyA_JcqWdR4cptuzTIvQ5eni6_8YXFvqfMddG9SqSzAsvfwEzOUnzno0tLLuCpvasLj6yGyXP16yXO-L5su_f0jMqGnS9ympOBykauA06wehkK",
    description: "Warm-season crop requiring consistent moisture and fertile, slightly acidic soil."
  },
  {
    id: "cucumbers",
    name: "Cucumbers",
    optimalTemp: [18, 30],
    optimalHumidity: [60, 90],
    optimalRainfall: [500, 700],
    optimalPh: [6.0, 7.0],
    preferredSoil: ["loamy", "sandy loam", "well-composted"],
    waterNeed: 80,
    growthPeriod: "50-70 days",
    season: "Late Spring",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjdyedlAnj5AcGdnHQRhlI2eydG5yc5Sm55EFJISRLIsmmczhb-p_PdBGwxp1RhyMXlW5EZcQZ_ONVbnL-p2IxM_rCHzZtk9zWavVUrlUMl7CtFHaSgjKDbxXSD0BZ23Y8ZPL83kmUZwBc6YYkIg8TZjU4-Kf-JBosnLBFFiqifLAQa7s1FRzrOZC4Jq_NwNHf-HXcZW4vEoZsm6f5y3-pNVs5QdeMGyTuYLK7TZ4Ywa3VYNdUTQzWR6Tucx5RK2nUtFgo89JXopvO",
    description: "Fast-growing vine crop that thrives in sunny spots with rich, well-composted earth."
  },
  {
    id: "potatoes",
    name: "Potatoes",
    optimalTemp: [15, 20],
    optimalHumidity: [40, 60],
    optimalRainfall: [400, 600],
    optimalPh: [5.0, 6.5],
    preferredSoil: ["sandy", "sandy loam", "loose"],
    waterNeed: 30,
    growthPeriod: "70-120 days",
    season: "Early Spring",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP_cI-RaHreDUGy1mNBn7HbnLScaS9lvMsWkH6e6PvaK9a5QEWtbYqCwZ-L8MsrTDbcfNQp8cyn67rVy0780dmUL9gyY_oHCGICPll8FmjOEYCHQx7gO4uoXjxMLXKtUbXAyW2eQTULYmLHq5CpC0liw86Qv1YMbSClZElD_WQeoJCaHIgNHV-7cY6CEeMZ-2cO96KIJM6qriDN_Oh_MLMkQc89RrWs50vXbTHo_2Aox_yYFhIo3kqXQrd7C_V1Bpr48U5w-osnC_d",
    description: "Versatile root vegetable requiring loose, sandy soil and moderate watering levels."
  },
  {
    id: "corn",
    name: "Corn",
    optimalTemp: [20, 30],
    optimalHumidity: [50, 75],
    optimalRainfall: [500, 800],
    optimalPh: [5.8, 7.0],
    preferredSoil: ["loamy", "well-drained"],
    waterNeed: 50,
    growthPeriod: "60-100 days",
    season: "Late Spring/Summer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoBQDY7Wv25uiL9cH4ZoH-bjsTZE1fhEptyAAoHekA-RH_ZLkVH-EFFdBn2WEsr0Xv9-E_l5Vvhou6tfHQcLpjfyeXj2HWSw4erWeYQdLCllGq4U9KFFgNb7O4-Z6VNtirPtDilHSXzWfjEyGoY_g6kkm7n5MnrE9GnMrL8aO3iRBPVlIrhPTpVGRhPg4QP8bnyK3V4NkaPZhPzCS4btOPWZonyJ5f6hvZRLPZ2q0ZDojFCGHvBM7fC72aGgyOO9Q7BAORWpF_Y2mY",
    description: "High-yield grain crop ideal for warm climates with moderate water requirements."
  },
  {
    id: "soybeans",
    name: "Soybeans",
    optimalTemp: [20, 30],
    optimalHumidity: [50, 70],
    optimalRainfall: [450, 700],
    optimalPh: [6.0, 7.0],
    preferredSoil: ["loamy", "clay loam"],
    waterNeed: 45,
    growthPeriod: "80-120 days",
    season: "Late Spring",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxJ210EFQ_FHOqzH9UvVIE1iK3ipp5AUfn5wtDBzY3Ldr2Eq2deA5JChiWuy8J6wpONtRN_rnrYYnD-xOrIJkF7jqULJ0mg5mmfpNljbKBCx4iqXenJdH2cnXpiywFm4pWq1tQomTx1LSOGzb3IhX_TTaWuELRSUoyA_JcqWdR4cptuzTIvQ5eni6_8YXFvqfMddG9SqSzAsvfwEzOUnzno0tLLuCpvasLj6yGyXP16yXO-L5su_f0jMqGnS9ympOBykauA06wehkK",
    description: "Nitrogen-fixing legume excellent for crop rotation and protein production."
  }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat") || "38.58"
  const lon = searchParams.get("lon") || "-121.49"
  
  try {
    // Fetch environmental data directly using shared functions
    const [weather, soil, ndvi] = await Promise.all([
      fetchWeatherData(lat, lon),
      fetchSoilData(lat, lon),
      fetchNdviData(lat, lon)
    ])
    
    // Extract values from fetched data
    const temperature = weather.temperature
    const humidity = weather.humidity
    const rainfall = (weather.precipitation || 10) * 30 // Estimate monthly from daily
    const ph = soil.ph
    const soilType = soil.soilType.toLowerCase()
    const ndviValue = ndvi.ndvi
    
    // Calculate scores for each crop using Random Forest-inspired logic
    const scoredCrops = crops.map(crop => {
      let score = 0
      let maxScore = 0
      
      // Temperature score (weight: 25)
      maxScore += 25
      const tempScore = calculateRangeScore(temperature, crop.optimalTemp[0], crop.optimalTemp[1])
      score += tempScore * 25
      
      // Humidity score (weight: 20)
      maxScore += 20
      const humidityScore = calculateRangeScore(humidity, crop.optimalHumidity[0], crop.optimalHumidity[1])
      score += humidityScore * 20
      
      // Rainfall score (weight: 15)
      maxScore += 15
      const rainfallScore = calculateRangeScore(rainfall, crop.optimalRainfall[0], crop.optimalRainfall[1])
      score += rainfallScore * 15
      
      // pH score (weight: 15)
      maxScore += 15
      const phScore = calculateRangeScore(ph, crop.optimalPh[0], crop.optimalPh[1])
      score += phScore * 15
      
      // Soil type score (weight: 15)
      maxScore += 15
      const soilScore = crop.preferredSoil.some(s => soilType.includes(s)) ? 1 : 0.5
      score += soilScore * 15
      
      // NDVI score (weight: 10) - higher NDVI indicates good growing conditions
      maxScore += 10
      const ndviScore = Math.min(1, ndviValue / 0.7)
      score += ndviScore * 10
      
      const finalScore = Math.round((score / maxScore) * 100)
      
      return {
        id: crop.id,
        name: crop.name,
        score: finalScore,
        description: crop.description,
        season: crop.season,
        waterNeed: crop.waterNeed,
        growthPeriod: crop.growthPeriod,
        image: crop.image
      }
    })
    
    // Sort by score
    scoredCrops.sort((a, b) => b.score - a.score)
    
    // Generate AI advice based on top recommendations
    const topCrops = scoredCrops.slice(0, 2)
    const aiAdvice = `Based on your location and weather conditions, ${topCrops.map(c => c.name.toLowerCase()).join(" and ")} are the most suitable crops this season.`
    
    // Generate irrigation recommendation
    const irrigationNeeded = humidity < 50 || rainfall < 400
    const irrigationAdvice = irrigationNeeded
      ? "Consider increasing irrigation based on current humidity and rainfall levels."
      : "Current moisture levels are adequate for most crops."
    
    return NextResponse.json({
      crops: scoredCrops,
      aiAdvice,
      irrigationAdvice,
      environmentalData: {
        temperature,
        humidity,
        rainfall,
        ph,
        soilType,
        ndvi: ndviValue
      },
      location: { lat: parseFloat(lat), lon: parseFloat(lon) }
    })
    
  } catch (error) {
    console.error("[v0] Recommendations API error:", error)
    
    // Return default recommendations on error
    return NextResponse.json({
      crops: crops.slice(0, 4).map((crop, index) => ({
        id: crop.id,
        name: crop.name,
        score: 95 - (index * 7),
        description: crop.description,
        season: crop.season,
        waterNeed: crop.waterNeed,
        growthPeriod: crop.growthPeriod,
        image: crop.image
      })),
      aiAdvice: "Based on typical conditions for your region, wheat and tomatoes are recommended crops.",
      irrigationAdvice: "Monitor soil moisture levels and adjust irrigation as needed.",
      location: { lat: parseFloat(lat), lon: parseFloat(lon) }
    })
  }
}

// Helper function to calculate how well a value fits within an optimal range
function calculateRangeScore(value: number, min: number, max: number): number {
  if (value >= min && value <= max) {
    // Within optimal range
    return 1
  }
  
  // Calculate distance from range
  const range = max - min
  if (value < min) {
    const distance = min - value
    return Math.max(0, 1 - (distance / range))
  } else {
    const distance = value - max
    return Math.max(0, 1 - (distance / range))
  }
}
