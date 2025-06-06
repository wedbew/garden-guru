import React, { useState, useEffect, useCallback } from 'react'
import { Plant } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, MapPin, Leaf, Calendar, Droplets, Save, Search, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface GardenManagementProps {
  plants: Plant[]
  setPlants: (plants: Plant[]) => void
  gardenLocation: string
  setGardenLocation: (location: string) => void
}

interface PerenualSearchResult {
  id: number
  common_name: string
  scientific_name: string[]
  other_name: string[]
  family: string | null
  origin: string[] | null
  type: string
  dimension: string | null
  dimensions: {
    type: string | null
    min_value: number | null
    max_value: number | null
    unit: string | null
  } | null
  cycle: string
  watering: string
  sunlight: string[]
  default_image: {
    license: number
    license_name: string
    license_url: string
    original_url: string
    regular_url: string
    medium_url: string
    small_url: string
    thumbnail: string
  } | null
  indoor: boolean
  care_level: string
  pest_susceptibility: string[]
  flowers: boolean
  flowering_season: string | null
  color: string
  edible_fruit: boolean
  edible_fruit_taste_profile: string | null
  fruit_nutritional_value: string | null
  fruit_color: string[]
  harvest_season: string | null
  leaf: boolean
  leaf_color: string[]
  edible_leaf: boolean
  cuisine: boolean
  medicinal: boolean
  poisonous_to_humans: number
  poisonous_to_pets: number
  description: string | null
  problem: string | null
  growth_rate: string
  maintenance: string | null
  care_guides: string
  soil: string[]
  growth_habit: string | null
  hardiness: {
    min: string
    max: string
  }
}

interface PerenualDetailedPlant extends PerenualSearchResult {
  care_guides: string
  section: Array<{
    id: number
    type: string
    description: string
  }>
}

interface PlantFormData {
  name: string
  type: string
  plantingDate: string
  wateringFrequency: number
  careTips: string
  quantity: number
  selectedPlant: PerenualSearchResult | null
}

const PERENUAL_API_KEY = 'sk-1hMq68431228a918610875'
const PERENUAL_BASE_URL = 'https://perenual.com/api/v2'

// Fallback plant suggestions when API is unavailable
const COMMON_PLANTS: PerenualSearchResult[] = [
  {
    id: 1,
    common_name: 'Rose',
    scientific_name: ['Rosa species'],
    other_name: ['Garden Rose'],
    family: 'Rosaceae',
    origin: ['Europe', 'Asia'],
    type: 'Perennial',
    dimension: null,
    dimensions: null,
    cycle: 'perennial',
    watering: 'average',
    sunlight: ['full_sun'],
    default_image: {
      license: 1,
      license_name: 'CC0',
      license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
      original_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      regular_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      medium_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      small_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    },
    indoor: false,
    care_level: 'medium',
    pest_susceptibility: ['aphids'],
    flowers: true,
    flowering_season: 'spring',
    color: 'red',
    edible_fruit: false,
    edible_fruit_taste_profile: null,
    fruit_nutritional_value: null,
    fruit_color: [],
    harvest_season: null,
    leaf: true,
    leaf_color: ['green'],
    edible_leaf: false,
    cuisine: false,
    medicinal: false,
    poisonous_to_humans: 0,
    poisonous_to_pets: 0,
    description: 'Beautiful flowering shrub',
    problem: null,
    growth_rate: 'medium',
    maintenance: 'medium',
    care_guides: 'regular-watering-full-sun',
    soil: ['well-drained'],
    growth_habit: 'shrub',
    hardiness: { min: '3', max: '9' }
  },
  {
    id: 2,
    common_name: 'Tomato',
    scientific_name: ['Solanum lycopersicum'],
    other_name: ['Love Apple'],
    family: 'Solanaceae',
    origin: ['South America'],
    type: 'Annual',
    dimension: null,
    dimensions: null,
    cycle: 'annual',
    watering: 'frequent',
    sunlight: ['full_sun'],
    default_image: {
      license: 1,
      license_name: 'CC0',
      license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
      original_url: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop',
      regular_url: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop',
      medium_url: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop',
      small_url: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=300&fit=crop'
    },
    indoor: false,
    care_level: 'medium',
    pest_susceptibility: ['aphids', 'whiteflies'],
    flowers: true,
    flowering_season: 'summer',
    color: 'yellow',
    edible_fruit: true,
    edible_fruit_taste_profile: 'sweet and tangy',
    fruit_nutritional_value: 'high in vitamin C',
    fruit_color: ['red'],
    harvest_season: 'summer',
    leaf: true,
    leaf_color: ['green'],
    edible_leaf: false,
    cuisine: true,
    medicinal: false,
    poisonous_to_humans: 0,
    poisonous_to_pets: 1,
    description: 'Popular edible fruit plant',
    problem: null,
    growth_rate: 'fast',
    maintenance: 'medium',
    care_guides: 'frequent-watering-full-sun',
    soil: ['well-drained', 'fertile'],
    growth_habit: 'vine',
    hardiness: { min: '9', max: '11' }
  }
]

// Local Storage Functions
const STORAGE_KEYS = {
  PLANTS: 'garden-guru-plants',
  LOCATION: 'garden-guru-location'
}

const saveToLocalStorage = (key: string, data: Plant[] | string) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const loadFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

export default function GardenManagement({ 
  plants, 
  setPlants, 
  gardenLocation, 
  setGardenLocation 
}: GardenManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const [locationInput, setLocationInput] = useState('')
  const [searchResults, setSearchResults] = useState<PerenualSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [formData, setFormData] = useState<PlantFormData>({
    name: '',
    type: '',
    plantingDate: '',
    wateringFrequency: 7,
    careTips: '',
    quantity: 1,
    selectedPlant: null
  })

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load data from localStorage on component mount
  useEffect(() => {
    if (!isHydrated) return
    
    const savedPlants = loadFromLocalStorage(STORAGE_KEYS.PLANTS)
    const savedLocation = loadFromLocalStorage(STORAGE_KEYS.LOCATION)
    
    if (savedPlants && Array.isArray(savedPlants)) {
      setPlants(savedPlants)
    }
    
    if (savedLocation) {
      setGardenLocation(savedLocation)
      setLocationInput(savedLocation)
    } else if (gardenLocation) {
      setLocationInput(gardenLocation)
    }
  }, [isHydrated, setPlants, setGardenLocation, gardenLocation])

  // Save plants to localStorage whenever plants array changes
  useEffect(() => {
    if (plants.length > 0) {
      saveToLocalStorage(STORAGE_KEYS.PLANTS, plants)
    }
  }, [plants])

  // Save location to localStorage whenever location changes
  useEffect(() => {
    if (gardenLocation) {
      saveToLocalStorage(STORAGE_KEYS.LOCATION, gardenLocation)
    }
  }, [gardenLocation])

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      plantingDate: '',
      wateringFrequency: 7,
      careTips: '',
      quantity: 1,
      selectedPlant: null
    })
    setEditingPlant(null)
    setSearchResults([])
    setShowSuggestions(false)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (plant: Plant) => {
    setFormData({
      name: plant.name,
      type: plant.type,
      plantingDate: plant.plantingDate,
      wateringFrequency: plant.wateringFrequency,
      careTips: plant.careTips,
      quantity: plant.quantity || 1, // Use existing quantity or default to 1
      selectedPlant: null
    })
    setEditingPlant(plant)
    setIsDialogOpen(true)
  }

  // Debounced search function using Perenual API
  const searchPlants = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    
    // First, try to find matches in our fallback suggestions
    const filteredSuggestions = COMMON_PLANTS.filter(plant => 
      plant.common_name.toLowerCase().includes(query.toLowerCase()) ||
      plant.scientific_name.some(name => name.toLowerCase().includes(query.toLowerCase()))
    )
    
    try {
      // Attempt to fetch from Perenual API
      const response = await fetch(
        `${PERENUAL_BASE_URL}/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}&page=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        const apiResults = data.data || []
        
        // Combine API results with fallback suggestions, removing duplicates
        const combinedResults = [...apiResults]
        filteredSuggestions.forEach(suggestion => {
          if (!apiResults.some((result: PerenualSearchResult) => 
            result.common_name?.toLowerCase() === suggestion.common_name.toLowerCase())) {
            combinedResults.push(suggestion)
          }
        })
        
        setSearchResults(combinedResults.slice(0, 10)) // Limit to 10 results
        setShowSuggestions(true)
      } else {
        console.warn('Perenual API returned error:', response.statusText)
        // Use fallback suggestions
        handleFallbackResults(query, filteredSuggestions)
      }
    } catch (error) {
      console.warn('Perenual API not accessible (likely CORS or network issue):', error)
      // Use fallback suggestions
      handleFallbackResults(query, filteredSuggestions)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleFallbackResults = (query: string, filteredSuggestions: PerenualSearchResult[]) => {
    if (filteredSuggestions.length > 0) {
      setSearchResults(filteredSuggestions)
    } else {
      // Create a custom result based on user input
      const customResult: PerenualSearchResult = {
        id: Date.now(),
        common_name: query,
        scientific_name: [`${query} species`],
        other_name: [],
        family: 'Unknown Family',
        origin: null,
        type: 'Unknown',
        dimension: null,
        dimensions: null,
        cycle: 'perennial',
        watering: 'average',
        sunlight: ['full_sun'],
        default_image: {
          license: 1,
          license_name: 'CC0',
          license_url: 'https://creativecommons.org/publicdomain/zero/1.0/',
          original_url: `https://images.unsplash.com/400x300/?${encodeURIComponent(query)},plant,green`,
          regular_url: `https://images.unsplash.com/400x300/?${encodeURIComponent(query)},plant,green`,
          medium_url: `https://images.unsplash.com/400x300/?${encodeURIComponent(query)},plant,green`,
          small_url: `https://images.unsplash.com/400x300/?${encodeURIComponent(query)},plant,green`,
          thumbnail: `https://images.unsplash.com/400x300/?${encodeURIComponent(query)},plant,green`
        },
        indoor: false,
        care_level: 'medium',
        pest_susceptibility: [],
        flowers: true,
        flowering_season: null,
        color: 'green',
        edible_fruit: false,
        edible_fruit_taste_profile: null,
        fruit_nutritional_value: null,
        fruit_color: [],
        harvest_season: null,
        leaf: true,
        leaf_color: ['green'],
        edible_leaf: false,
        cuisine: false,
        medicinal: false,
        poisonous_to_humans: 0,
        poisonous_to_pets: 0,
        description: null,
        problem: null,
        growth_rate: 'medium',
        maintenance: null,
        care_guides: 'basic-care',
        soil: ['well-drained'],
        growth_habit: null,
        hardiness: { min: '5', max: '9' }
      }
      setSearchResults([customResult])
    }
    setShowSuggestions(true)
  }

  // Debounce the search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.name && !formData.selectedPlant) {
        searchPlants(formData.name)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [formData.name, formData.selectedPlant, searchPlants])

  const fetchPlantDetails = async (plantId: number): Promise<PerenualDetailedPlant | null> => {
    try {
      const response = await fetch(
        `${PERENUAL_BASE_URL}/species/details/${plantId}?key=${PERENUAL_API_KEY}`
      )
      
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.error('Failed to fetch plant details:', response.statusText)
        return null
      }
    } catch (error) {
      console.error('Error fetching plant details:', error)
      return null
    }
  }

  const selectPlant = async (plant: PerenualSearchResult) => {
    setIsLoadingDetails(true)
    setShowSuggestions(false)
    
    try {
      const detailedPlant = await fetchPlantDetails(plant.id)
      
      if (detailedPlant) {
        // Generate care tips from API data
        const careTips = generateCareTips(detailedPlant)
        
        // Calculate watering frequency based on plant data
        const wateringFreq = calculateWateringFrequency(detailedPlant)
        
        setFormData(prev => ({
          ...prev,
          name: plant.common_name || plant.scientific_name[0],
          type: plant.type || plant.family || 'Unknown',
          selectedPlant: plant,
          careTips,
          wateringFrequency: wateringFreq
        }))
      } else {
        // Fallback to basic info if detailed fetch fails
        const careTips = generateCareTips(plant)
        const wateringFreq = calculateWateringFrequency(plant)
        
        setFormData(prev => ({
          ...prev,
          name: plant.common_name || plant.scientific_name[0],
          type: plant.type || plant.family || 'Unknown',
          selectedPlant: plant,
          careTips,
          wateringFrequency: wateringFreq
        }))
      }
    } catch (error) {
      console.error('Error selecting plant:', error)
      // Fallback to basic info
      const careTips = generateCareTips(plant)
      const wateringFreq = calculateWateringFrequency(plant)
      
      setFormData(prev => ({
        ...prev,
        name: plant.common_name || plant.scientific_name[0],
        type: plant.type || plant.family || 'Unknown',
        selectedPlant: plant,
        careTips,
        wateringFrequency: wateringFreq
      }))
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const generateCareTips = (plant: PerenualSearchResult | PerenualDetailedPlant): string => {
    const tips: string[] = []
    
    if (plant.description) {
      tips.push(`Description: ${plant.description}`)
    }
    
    // Sunlight requirements
    if (plant.sunlight && plant.sunlight.length > 0) {
      const sunlightMap: { [key: string]: string } = {
        'full_sun': 'Full sun (6+ hours daily)',
        'part_shade': 'Partial shade',
        'full_shade': 'Full shade',
        'sun-part_shade': 'Sun to partial shade'
      }
      const sunlightDesc = plant.sunlight.map(s => sunlightMap[s] || s).join(', ')
      tips.push(`Light: ${sunlightDesc}`)
    }
    
    // Watering requirements
    if (plant.watering) {
      const wateringMap: { [key: string]: string } = {
        'frequent': 'Frequent watering',
        'average': 'Average watering',
        'minimum': 'Minimal watering',
        'none': 'No watering needed'
      }
      tips.push(`Watering: ${wateringMap[plant.watering] || plant.watering}`)
    }
    
    // Care level
    if (plant.care_level) {
      tips.push(`Care level: ${plant.care_level}`)
    }
    
    // Growth rate
    if (plant.growth_rate) {
      tips.push(`Growth rate: ${plant.growth_rate}`)
    }
    
    // Soil requirements
    if (plant.soil && plant.soil.length > 0) {
      tips.push(`Soil: ${plant.soil.join(', ')}`)
    }
    
    // Hardiness zone
    if (plant.hardiness) {
      tips.push(`Hardiness zones: ${plant.hardiness.min}-${plant.hardiness.max}`)
    }
    
    // Toxicity warnings
    if (plant.poisonous_to_humans === 1) {
      tips.push(`⚠️ Poisonous to humans`)
    }
    if (plant.poisonous_to_pets === 1) {
      tips.push(`⚠️ Poisonous to pets`)
    }
    
    // Edible information
    if (plant.edible_fruit) {
      tips.push(`🍃 Produces edible fruit`)
      if (plant.edible_fruit_taste_profile) {
        tips.push(`Taste: ${plant.edible_fruit_taste_profile}`)
      }
    }
    
    if (plant.edible_leaf) {
      tips.push(`🍃 Has edible leaves`)
    }
    
    // Flowering information
    if (plant.flowers && plant.flowering_season) {
      tips.push(`🌸 Flowers in ${plant.flowering_season}`)
    }
    
    // Harvest season
    if (plant.harvest_season) {
      tips.push(`🌾 Harvest season: ${plant.harvest_season}`)
    }
    
    // Pest susceptibility
    if (plant.pest_susceptibility && plant.pest_susceptibility.length > 0) {
      tips.push(`Pest watch: ${plant.pest_susceptibility.join(', ')}`)
    }
    
    // If no tips from API, provide basic care tips based on plant name
    if (tips.length === 0) {
      const plantName = plant.common_name?.toLowerCase() || plant.scientific_name[0]?.toLowerCase() || ''
      
      if (plantName.includes('rose')) {
        tips.push('Needs full sun (6+ hours daily) • Well-draining soil • Regular watering • Prune in late winter')
      } else if (plantName.includes('tomato')) {
        tips.push('Full sun • Rich, well-draining soil • Regular deep watering • Support with stakes or cages')
      } else if (plantName.includes('basil')) {
        tips.push('Full sun to partial shade • Well-draining soil • Keep soil moist • Pinch flowers to encourage leaf growth')
      } else if (plantName.includes('lavender')) {
        tips.push('Full sun • Well-draining, alkaline soil • Drought tolerant once established • Prune after flowering')
      } else if (plantName.includes('monstera')) {
        tips.push('Bright, indirect light • Well-draining potting mix • Water when top inch of soil is dry • Provide support for climbing')
      } else {
        tips.push('Provide appropriate light conditions • Water when soil feels dry • Use well-draining soil • Monitor for pests and diseases')
      }
    }
    
    return tips.join(' • ')
  }

  const calculateWateringFrequency = (plant: PerenualSearchResult): number => {
    // Default watering frequency
    let frequency = 7
    
    if (plant.watering) {
      switch (plant.watering) {
        case 'frequent':
          frequency = 3
          break
        case 'average':
          frequency = 7
          break
        case 'minimum':
          frequency = 14
          break
        case 'none':
          frequency = 30
          break
        default:
          frequency = 7
      }
    }
    
    // Adjust based on plant type
    if (plant.type) {
      const type = plant.type.toLowerCase()
      if (type.includes('succulent') || type.includes('cactus')) {
        frequency = Math.max(frequency, 14) // Succulents need less water
      } else if (type.includes('tropical') || type.includes('fern')) {
        frequency = Math.min(frequency, 5) // Tropical plants need more water
      }
    }
    
    return frequency
  }

  const getBestPlantImage = (plant: PerenualSearchResult): string => {
    if (plant.default_image?.regular_url) {
      return plant.default_image.regular_url
    }
    
    if (plant.default_image?.original_url) {
      return plant.default_image.original_url
    }
    
    // Fallback to Unsplash image
    return `https://images.unsplash.com/400x300/?${encodeURIComponent(plant.common_name || plant.scientific_name[0])},plant,green`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPlant) {
      // Update existing plant
      const updatedPlants = plants.map(plant => 
        plant.id === editingPlant.id 
          ? {
              ...plant,
              name: formData.name,
              type: formData.type,
              plantingDate: formData.plantingDate,
              wateringFrequency: formData.wateringFrequency,
              careTips: formData.careTips,
              quantity: formData.quantity
            }
          : plant
      )
      setPlants(updatedPlants)
    } else {
      // Add new plant with quantity
      const plantImage = formData.selectedPlant 
        ? getBestPlantImage(formData.selectedPlant)
        : `https://images.unsplash.com/400x300/?${encodeURIComponent(formData.name)},plant,green`
      
      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        name: formData.name,
        picture: plantImage,
        type: formData.type,
        plantingDate: formData.plantingDate,
        wateringFrequency: formData.wateringFrequency,
        careTips: formData.careTips,
        quantity: formData.quantity
      }
      
      const updatedPlants = [...plants, newPlant]
      setPlants(updatedPlants)
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const deletePlant = (plantId: string) => {
    const updatedPlants = plants.filter(plant => plant.id !== plantId)
    setPlants(updatedPlants)
    
    // If no plants left, clear localStorage
    if (updatedPlants.length === 0) {
      localStorage.removeItem(STORAGE_KEYS.PLANTS)
    }
  }

  const saveLocation = () => {
    setGardenLocation(locationInput)
  }

  const handleInputChange = (field: keyof PlantFormData, value: string | number | PerenualSearchResult | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear selected plant if name is manually changed
    if (field === 'name' && typeof value === 'string' && formData.selectedPlant) {
      setFormData(prev => ({
        ...prev,
        selectedPlant: null
      }))
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-green-900 dark:text-green-100">My Garden</h1>
          <p className="text-green-600 dark:text-green-400 mt-1">
            Manage your plants and garden information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openAddDialog}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Plant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlant ? 'Edit Plant' : 'Add New Plant'}
              </DialogTitle>
              {!editingPlant && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🌱 Start typing a plant name to search our botanical database powered by Perenual API. Data is automatically saved to your browser.
                </p>
              )}
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="name">Plant Name</Label>
                <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Start typing to search plants..."
                  required
                    className="pr-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                  {!isSearching && formData.name && (
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                {/* Search Results Dropdown */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((plant) => (
                      <button
                        key={plant.id}
                        type="button"
                        onClick={() => selectPlant(plant)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center space-x-3"
                      >
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          {plant.default_image?.thumbnail ? (
                            <Image
                              src={plant.default_image.thumbnail}
                              alt={plant.common_name || plant.scientific_name[0]}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {plant.common_name || plant.scientific_name[0]}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {plant.scientific_name[0]} • {plant.family || 'Unknown family'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {plant.cycle}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {plant.watering}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {isLoadingDetails && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading plant details...</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Plant Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  placeholder="e.g., Houseplant, Succulent, Herb"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  required
                />
                <p className="text-xs text-gray-500">
                  {editingPlant ? 'Update the number of plants' : 'Add multiple plants of the same type'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plantingDate">Planting Date</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => handleInputChange('plantingDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wateringFrequency">Watering Frequency (days)</Label>
                <Input
                  id="wateringFrequency"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.wateringFrequency}
                  onChange={(e) => handleInputChange('wateringFrequency', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="careTips">Care Tips</Label>
                <Textarea
                  id="careTips"
                  value={formData.careTips}
                  onChange={(e) => handleInputChange('careTips', e.target.value)}
                  placeholder="Special care instructions, notes, etc."
                  rows={4}
                />
                {formData.selectedPlant && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    💡 Care tips have been automatically generated from Perenual plant database
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoadingDetails}
                >
                  {isLoadingDetails ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    editingPlant ? 'Update Plant' : 'Add Plant'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Garden Location */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">Garden Location</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter your garden location (e.g., San Francisco, CA)"
              className="flex-1"
            />
            <Button 
              onClick={saveLocation}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Location
            </Button>
          </div>
          {gardenLocation && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Current location: {gardenLocation}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Plants List */}
      <Card>
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
            My Plants {isHydrated && `(${plants.length})`}
          </h2>
        </CardHeader>
        <CardContent>
          {!isHydrated ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-green-500 mx-auto mb-3 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Loading your garden...</p>
            </div>
          ) : plants.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No plants in your garden yet. Add your first plant to get started!
              </p>
              <Button 
                onClick={openAddDialog}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Plant
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plants.map(plant => (
                <div key={plant.id} className="border border-green-100 dark:border-green-800 rounded-lg p-4 space-y-3">
                  <div className="relative h-32 bg-green-50 dark:bg-green-900/20 rounded-lg overflow-hidden">
                    <Image
                      src={plant.picture}
                      alt={plant.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to a default plant icon if image fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{plant.name}</h3>
                        {plant.quantity > 1 && (
                          <Badge variant="outline" className="text-xs">
                            {plant.quantity}x
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(plant)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePlant(plant.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      {plant.type}
                    </Badge>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(plant.plantingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-3 h-3" />
                        <span>Every {plant.wateringFrequency} days</span>
                      </div>
                    </div>
                    
                    {plant.careTips && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        lineHeight: '1.4em',
                        maxHeight: '2.8em'
                      }}>
                        {plant.careTips}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}