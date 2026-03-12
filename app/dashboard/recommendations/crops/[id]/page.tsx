import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ArrowLeft, 
  Share2, 
  Calendar, 
  Droplets, 
  Mountain, 
  Thermometer,
  Sprout,
  Bug,
  Tractor,
  Bell,
  Home,
  Leaf,
  Store,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cropData: Record<string, {
  name: string
  scientificName: string
  growthPeriod: string
  waterNeed: string
  soilType: string
  idealTemp: string
  image: string
  plantingGuide: string[]
  pestManagement: {
    pests: string
    pestDescription: string
    organicSolution: string
  }
  harvesting: string
}> = {
  wheat: {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    growthPeriod: "90-120 days",
    waterNeed: "400-600mm",
    soilType: "Loamy Soil",
    idealTemp: "15°C - 25°C",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBh4N8pXdGR4wdmSVELVvVgWqotRvPvYwQX1joQ1TIVvY9FAJCNgnowOYWfAuVyLjUOJDovbK44Gd7T2s6icx71UbmsifkSEIEErC5HHSkETH9JhccECmA288Ru8K5nxwWtNu9PgyP2A4IMnZP3xmCLSt5g_IKD4MsQ7mLKHzgg8V-XRX2WviShpFqMlK41WXKv2IzAeOka3BrYXtS2x0h61kRJZ8TDC32eMGKe6CWhMDAVN25ckFrMS1SxdEubTVIL5cnt2ho5lbc",
    plantingGuide: [
      "Prepare the seedbed by plowing and leveling the soil to a fine tilth.",
      "Sow seeds at a depth of 3-5cm with a row spacing of 20-22.5cm.",
      "Apply basal fertilization with NPK (Nitrogen, Phosphorus, Potassium) based on soil test."
    ],
    pestManagement: {
      pests: "Aphids & Rust",
      pestDescription: "Common pests that can reduce yield significantly if not managed.",
      organicSolution: "Use Neem oil spray for aphids and practice crop rotation to prevent fungal rust buildup."
    },
    harvesting: "Wheat is ready for harvest when the grains are hard and cannot be easily crushed by teeth. The straw should be dry and brittle."
  },
  tomatoes: {
    name: "Tomatoes",
    scientificName: "Solanum lycopersicum",
    growthPeriod: "60-80 days",
    waterNeed: "600-800mm",
    soilType: "Well-drained, Fertile",
    idealTemp: "20°C - 30°C",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxJ210EFQ_FHOqzH9UvVIE1iK3ipp5AUfn5wtDBzY3Ldr2Eq2deA5JChiWuy8J6wpONtRN_rnrYYnD-xOrIJkF7jqULJ0mg5mmfpNljbKBCx4iqXenJdH2cnXpiywFm4pWq1tQomTx1LSOGzb3IhX_TTaWuELRSUoyA_JcqWdR4cptuzTIvQ5eni6_8YXFvqfMddG9SqSzAsvfwEzOUnzno0tLLuCpvasLj6yGyXP16yXO-L5su_f0jMqGnS9ympOBykauA06wehkK",
    plantingGuide: [
      "Start seeds indoors 6-8 weeks before the last frost date.",
      "Transplant seedlings when they have 2-3 true leaves and soil temperature is above 15°C.",
      "Space plants 45-60cm apart in rows 90-120cm apart."
    ],
    pestManagement: {
      pests: "Hornworms & Blight",
      pestDescription: "Hornworms can defoliate plants quickly. Blight causes leaf spots and fruit rot.",
      organicSolution: "Handpick hornworms and use copper-based fungicides for blight prevention."
    },
    harvesting: "Harvest when fruits are fully colored and slightly soft to the touch. Pick regularly to encourage continued production."
  },
  cucumbers: {
    name: "Cucumbers",
    scientificName: "Cucumis sativus",
    growthPeriod: "50-70 days",
    waterNeed: "500-700mm",
    soilType: "Rich, Well-composted",
    idealTemp: "18°C - 30°C",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjdyedlAnj5AcGdnHQRhlI2eydG5yc5Sm55EFJISRLIsmmczhb-p_PdBGwxp1RhyMXlW5EZcQZ_ONVbnL-p2IxM_rCHzZtk9zWavVUrlUMl7CtFHaSgjKDbxXSD0BZ23Y8ZPL83kmUZwBc6YYkIg8TZjU4-Kf-JBosnLBFFiqifLAQa7s1FRzrOZC4Jq_NwNHf-HXcZW4vEoZsm6f5y3-pNVs5QdeMGyTuYLK7TZ4Ywa3VYNdUTQzWR6Tucx5RK2nUtFgo89JXopvO",
    plantingGuide: [
      "Direct sow seeds after all danger of frost has passed and soil is warm.",
      "Plant seeds 2-3cm deep, spacing plants 30-45cm apart.",
      "Provide trellis support for vining varieties to improve air circulation."
    ],
    pestManagement: {
      pests: "Cucumber Beetles & Powdery Mildew",
      pestDescription: "Beetles spread bacterial wilt. Powdery mildew affects leaf health.",
      organicSolution: "Use row covers early season and apply sulfur-based fungicides for mildew."
    },
    harvesting: "Pick cucumbers when they reach desired size, typically 15-20cm for slicing varieties. Harvest frequently to promote production."
  },
  potatoes: {
    name: "Potatoes",
    scientificName: "Solanum tuberosum",
    growthPeriod: "70-120 days",
    waterNeed: "400-600mm",
    soilType: "Loose, Sandy",
    idealTemp: "15°C - 20°C",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP_cI-RaHreDUGy1mNBn7HbnLScaS9lvMsWkH6e6PvaK9a5QEWtbYqCwZ-L8MsrTDbcfNQp8cyn67rVy0780dmUL9gyY_oHCGICPll8FmjOEYCHQx7gO4uoXjxMLXKtUbXAyW2eQTULYmLHq5CpC0liw86Qv1YMbSClZElD_WQeoJCaHIgNHV-7cY6CEeMZ-2cO96KIJM6qriDN_Oh_MLMkQc89RrWs50vXbTHo_2Aox_yYFhIo3kqXQrd7C_V1Bpr48U5w-osnC_d",
    plantingGuide: [
      "Cut seed potatoes into pieces with 2-3 eyes each and let them cure for 2 days.",
      "Plant 10-15cm deep with 30cm spacing in rows 75-90cm apart.",
      "Hill soil around plants as they grow to prevent greening of tubers."
    ],
    pestManagement: {
      pests: "Colorado Potato Beetle & Late Blight",
      pestDescription: "Beetles defoliate plants. Late blight can destroy entire crops rapidly.",
      organicSolution: "Handpick beetles and use Bacillus thuringiensis. Ensure good drainage for blight prevention."
    },
    harvesting: "Harvest when foliage dies back naturally. New potatoes can be harvested earlier when plants flower."
  }
}

export default async function CropDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const crop = cropData[id]
  
  if (!crop) {
    notFound()
  }

  const quickInfo = [
    { icon: Calendar, label: "Growth Period", value: crop.growthPeriod },
    { icon: Droplets, label: "Water Need", value: crop.waterNeed },
    { icon: Mountain, label: "Soil Type", value: crop.soilType },
    { icon: Thermometer, label: "Ideal Temp", value: crop.idealTemp },
  ]

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-md p-4 justify-between border-b">
        <Button variant="ghost" size="icon" asChild className="text-primary">
          <Link href="/recommendations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h2 className="text-primary text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          {crop.name} Details
        </h2>
        <Button variant="ghost" size="icon" className="text-primary">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Hero Image */}
      <div className="px-4 py-3">
        <div className="w-full rounded-xl overflow-hidden min-h-64 shadow-md">
          <img 
            src={crop.image}
            alt={`${crop.name} field`}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>

      {/* Title & Scientific Name */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-primary text-3xl font-bold leading-tight">{crop.name}</h1>
        <p className="text-muted-foreground italic text-sm">{crop.scientificName}</p>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {quickInfo.map((info, index) => (
          <Card key={index} className="bg-amber-50/50 border-primary/10">
            <CardContent className="p-4 flex flex-col gap-2">
              <info.icon className="h-5 w-5 text-[#858a20]" />
              <div>
                <h3 className="text-sm font-bold leading-tight">{info.value}</h3>
                <p className="text-muted-foreground text-xs">{info.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="flex flex-col gap-6 px-4 pb-24">
        {/* Planting Guide */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sprout className="h-5 w-5" />
              Planting Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {crop.plantingGuide.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pest Management */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Bug className="h-5 w-5" />
              Pest Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-secondary pl-3">
              <h4 className="text-sm font-bold">{crop.pestManagement.pests}</h4>
              <p className="text-sm text-muted-foreground">{crop.pestManagement.pestDescription}</p>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                Organic Solutions
              </p>
              <p className="text-sm text-muted-foreground">{crop.pestManagement.organicSolution}</p>
            </div>
          </CardContent>
        </Card>

        {/* Harvesting */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Tractor className="h-5 w-5" />
              Harvesting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {crop.harvesting}
            </p>
            <Button className="w-full gap-2" variant="secondary">
              <Bell className="h-4 w-4" />
              Set Harvest Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex max-w-md mx-auto gap-2 border-t bg-card/90 backdrop-blur-md px-4 pb-6 pt-2">
        <Link href="/dashboard" className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/recommendations" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary">
          <Leaf className="h-5 w-5" />
          <span className="text-[10px] font-medium">My Crops</span>
        </Link>
        <Link href="/market" className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <Store className="h-5 w-5" />
          <span className="text-[10px] font-medium">Market</span>
        </Link>
        <Link href="/profile" className="flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  )
}
