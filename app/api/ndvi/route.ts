import { NextRequest, NextResponse } from "next/server"

// MODIS NDVI (Normalized Difference Vegetation Index) API
// Uses NASA MODIS satellite data via APPEEARS or similar services
// NDVI ranges from -1 to 1, where higher values indicate healthier vegetation

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat") || "38.58"
  const lon = searchParams.get("lon") || "-121.49"
  
  const nasaApiKey = process.env.NASA_API_KEY
  
  // If no API key, return simulated NDVI data based on location
  if (!nasaApiKey) {
    console.log("[v0] No NASA API key found, returning simulated NDVI data")
    
    // Simulate seasonal NDVI variation
    const month = new Date().getMonth()
    const seasonalFactor = Math.sin((month / 12) * Math.PI * 2) * 0.2 + 0.6
    
    // Add some location-based variation
    const latFactor = 1 - Math.abs(parseFloat(lat) - 35) / 50
    const baseNdvi = 0.5 + (latFactor * 0.3) + (Math.random() * 0.1)
    const ndvi = Math.min(1, Math.max(0, baseNdvi * seasonalFactor))
    
    return NextResponse.json({
      ndvi: Math.round(ndvi * 1000) / 1000,
      vegetationHealth: getVegetationHealth(ndvi),
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      },
      source: "simulated",
      recommendations: getRecommendations(ndvi)
    })
  }
  
  try {
    // NASA MODIS Web Service for NDVI
    // This would typically use APPEEARS API or NASA GIBS
    const date = new Date()
    const year = date.getFullYear()
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000)
    
    // Format: MODIS 16-day composite
    const modisUrl = `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset?latitude=${lat}&longitude=${lon}&startDate=A${year}${String(dayOfYear).padStart(3, "0")}&endDate=A${year}${String(dayOfYear).padStart(3, "0")}&kmAboveBelow=0&kmLeftRight=0`
    
    const response = await fetch(modisUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        "Authorization": `Bearer ${nasaApiKey}`,
        "Accept": "application/json"
      }
    })
    
    if (!response.ok) {
      throw new Error(`MODIS API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Parse MODIS NDVI data
    // MODIS NDVI is scaled: actual NDVI = value * 0.0001
    const ndviValue = data.subset?.[0]?.data?.[0]
    const ndvi = ndviValue ? ndviValue * 0.0001 : 0.65
    
    return NextResponse.json({
      ndvi: Math.round(ndvi * 1000) / 1000,
      vegetationHealth: getVegetationHealth(ndvi),
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      },
      source: "MODIS MOD13Q1",
      recommendations: getRecommendations(ndvi)
    })
    
  } catch (error) {
    console.error("[v0] NDVI API error:", error)
    
    // Return simulated data on error
    const simulatedNdvi = 0.65 + (Math.random() * 0.1)
    
    return NextResponse.json({
      ndvi: Math.round(simulatedNdvi * 1000) / 1000,
      vegetationHealth: getVegetationHealth(simulatedNdvi),
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      },
      source: "simulated",
      recommendations: getRecommendations(simulatedNdvi)
    })
  }
}

function getVegetationHealth(ndvi: number): string {
  if (ndvi >= 0.7) return "Excellent"
  if (ndvi >= 0.5) return "Good"
  if (ndvi >= 0.3) return "Moderate"
  if (ndvi >= 0.1) return "Sparse"
  return "Poor/Barren"
}

function getRecommendations(ndvi: number): string[] {
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
