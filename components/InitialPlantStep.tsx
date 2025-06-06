"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { InitialPlantFormData, PlacementType, ContainerUnit } from '@/lib/types';

interface InitialPlantStepProps {
  onNext: (data: InitialPlantFormData) => void;
  initialData?: Partial<InitialPlantFormData>;
}

export default function InitialPlantStep({ onNext, initialData }: InitialPlantStepProps) {
  const [formData, setFormData] = useState<InitialPlantFormData>({
    user_defined_name: initialData?.user_defined_name || '',
    placement_type: initialData?.placement_type || 'Container',
    container_details: initialData?.container_details || {
      material: '',
      volume: 0,
      unit: 'liters',
      is_self_watering: false,
    },
    photo: initialData?.photo,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof InitialPlantFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleContainerDetailChange = (field: keyof NonNullable<InitialPlantFormData['container_details']>, value: any) => {
    setFormData(prev => ({
      ...prev,
      container_details: {
        ...prev.container_details!,
        [field]: value,
      },
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Image size must be less than 10MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear photo error
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: undefined }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_defined_name.trim()) {
      newErrors.user_defined_name = 'Plant name is required';
    }

    if (formData.placement_type === 'Container') {
      if (!formData.container_details?.material.trim()) {
        newErrors.container_material = 'Container material is required';
      }
      if (!formData.container_details?.volume || formData.container_details.volume <= 0) {
        newErrors.container_volume = 'Container volume must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up container details if not needed
      const submitData = { ...formData };
      if (formData.placement_type !== 'Container') {
        delete submitData.container_details;
      }
      
      onNext(submitData);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Add Your First Plant</CardTitle>
        <CardDescription className="text-center">
          Let's start by gathering some basic information about your plant. This will help us provide personalized care recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plant Name */}
          <div className="space-y-2">
            <Label htmlFor="plant-name" className="text-sm font-medium">
              What would you like to call your plant? *
            </Label>
            <Input
              id="plant-name"
              type="text"
              placeholder="e.g., Living Room Fiddle Leaf, Kitchen Basil"
              value={formData.user_defined_name}
              onChange={(e) => handleInputChange('user_defined_name', e.target.value)}
              className={errors.user_defined_name ? 'border-red-500' : ''}
            />
            {errors.user_defined_name && (
              <p className="text-sm text-red-500">{errors.user_defined_name}</p>
            )}
          </div>

          {/* Plant Photo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Plant Photo</Label>
            <p className="text-xs text-muted-foreground">
              Adding a photo helps us identify your plant and provide better care advice
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Plant preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photo</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Take Photo</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Drag and drop an image here, or click to select
                  </p>
                </div>
              </div>
            )}
            
            {errors.photo && (
              <p className="text-sm text-red-500">{errors.photo}</p>
            )}
          </div>

          {/* Plant Placement */}
          <div className="space-y-2">
            <Label htmlFor="placement-type" className="text-sm font-medium">
              Where is your plant located? *
            </Label>
            <Select
              value={formData.placement_type}
              onValueChange={(value: PlacementType) => handleInputChange('placement_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select placement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Container">Container/Pot</SelectItem>
                <SelectItem value="In-ground">In-ground</SelectItem>
                <SelectItem value="Raised Bed">Raised Bed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Container Details - Only show if Container is selected */}
          {formData.placement_type === 'Container' && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium text-sm">Container Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="container-material" className="text-sm">
                    Container Material *
                  </Label>
                  <Input
                    id="container-material"
                    type="text"
                    placeholder="e.g., Ceramic, Plastic, Terracotta"
                    value={formData.container_details?.material || ''}
                    onChange={(e) => handleContainerDetailChange('material', e.target.value)}
                    className={errors.container_material ? 'border-red-500' : ''}
                  />
                  {errors.container_material && (
                    <p className="text-sm text-red-500">{errors.container_material}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="container-volume" className="text-sm">
                    Container Size *
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="container-volume"
                      type="number"
                      placeholder="Volume"
                      min="0"
                      step="0.1"
                      value={formData.container_details?.volume || ''}
                      onChange={(e) => handleContainerDetailChange('volume', parseFloat(e.target.value) || 0)}
                      className={errors.container_volume ? 'border-red-500' : ''}
                    />
                    <Select
                      value={formData.container_details?.unit || 'liters'}
                      onValueChange={(value: ContainerUnit) => handleContainerDetailChange('unit', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                        <SelectItem value="cubic_feet">Cubic Feet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.container_volume && (
                    <p className="text-sm text-red-500">{errors.container_volume}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="self-watering"
                  type="checkbox"
                  checked={formData.container_details?.is_self_watering || false}
                  onChange={(e) => handleContainerDetailChange('is_self_watering', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="self-watering" className="text-sm">
                  This is a self-watering container
                </Label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="px-8">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 