import React, { useState } from 'react'
import { Plant } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, MapPin, Leaf, Calendar, Droplets, Save } from 'lucide-react'
import Image from 'next/image'

interface GardenManagementProps {
  plants: Plant[]
  setPlants: (plants: Plant[]) => void
  gardenLocation: string
  setGardenLocation: (location: string) => void
}

interface PlantFormData {
  name: string
  type: string
  plantingDate: string
  wateringFrequency: number
  careTips: string
}

export default function GardenManagement({ 
  plants, 
  setPlants, 
  gardenLocation, 
  setGardenLocation 
}: GardenManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const [locationInput, setLocationInput] = useState(gardenLocation)
  const [formData, setFormData] = useState<PlantFormData>({
    name: '',
    type: '',
    plantingDate: '',
    wateringFrequency: 7,
    careTips: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      plantingDate: '',
      wateringFrequency: 7,
      careTips: ''
    })
    setEditingPlant(null)
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
      careTips: plant.careTips
    })
    setEditingPlant(plant)
    setIsDialogOpen(true)
  }

  const generatePlantImage = (plantName: string) => {
    // Generate a placeholder image URL based on plant name
    const encodedName = encodeURIComponent(plantName.toLowerCase())
    return `https://images.unsplash.com/400x300/?${encodedName},plant,green`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPlant) {
      // Update existing plant
      setPlants(plants.map(plant => 
        plant.id === editingPlant.id 
          ? {
              ...plant,
              name: formData.name,
              type: formData.type,
              plantingDate: formData.plantingDate,
              wateringFrequency: formData.wateringFrequency,
              careTips: formData.careTips
            }
          : plant
      ))
    } else {
      // Add new plant
      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        name: formData.name,
        picture: generatePlantImage(formData.name),
        type: formData.type,
        plantingDate: formData.plantingDate,
        wateringFrequency: formData.wateringFrequency,
        careTips: formData.careTips
      }
      setPlants([...plants, newPlant])
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const deletePlant = (plantId: string) => {
    setPlants(plants.filter(plant => plant.id !== plantId))
  }

  const saveLocation = () => {
    setGardenLocation(locationInput)
  }

  const handleInputChange = (field: keyof PlantFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPlant ? 'Edit Plant' : 'Add New Plant'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plant Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Monstera Deliciosa"
                  required
                />
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
                  rows={3}
                />
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
                >
                  {editingPlant ? 'Update Plant' : 'Add Plant'}
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
            My Plants ({plants.length})
          </h2>
        </CardHeader>
        <CardContent>
          {plants.length === 0 ? (
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
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{plant.name}</h3>
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
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