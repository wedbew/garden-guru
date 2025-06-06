"use client";

import React, { useState } from 'react';
import InitialPlantStep from '@/components/InitialPlantStep';
import { InitialPlantFormData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function WizardPage() {
  const [formData, setFormData] = useState<InitialPlantFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    plantId?: string;
    message?: string;
    error?: string;
  } | null>(null);

  const handleNext = async (data: InitialPlantFormData) => {
    setIsSubmitting(true);
    setFormData(data);
    
    try {
      // Create FormData for API submission
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('user_defined_name', data.user_defined_name);
      formDataToSubmit.append('placement_type', data.placement_type);
      
      if (data.container_details) {
        formDataToSubmit.append('container_material', data.container_details.material);
        formDataToSubmit.append('container_volume', data.container_details.volume.toString());
        formDataToSubmit.append('container_unit', data.container_details.unit);
        formDataToSubmit.append('is_self_watering', data.container_details.is_self_watering.toString());
      }
      
      if (data.photo) {
        formDataToSubmit.append('photo', data.photo);
      }

      const response = await fetch('/api/plants', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          plantId: result.plantId,
          message: result.message,
        });
      } else {
        setSubmitResult({
          success: false,
          error: result.error || 'Failed to create plant',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({
        success: false,
        error: 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setFormData(null);
    setSubmitResult(null);
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <h2 className="text-xl font-semibold mb-2">Creating Your Plant...</h2>
              <p className="text-muted-foreground text-center">
                We&apos;re saving your plant information and analyzing the photo if provided.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (submitResult) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                {submitResult.success ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-xl">✕</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {submitResult.success ? 'Plant Added Successfully!' : 'Something Went Wrong'}
              </CardTitle>
              <CardDescription className="text-center">
                {submitResult.success 
                  ? submitResult.message || 'Your plant has been added to your garden.'
                  : submitResult.error || 'Please try again.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitResult.success && submitResult.plantId && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Plant ID:</strong> {submitResult.plantId}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <Button onClick={resetWizard} variant="outline">
                  Add Another Plant
                </Button>
                {submitResult.success && (
                  <Button onClick={() => window.location.href = '/'}>
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {formData && (
            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Submitted Data:</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(formData, (key, value) => {
                  // Don't stringify the File object
                  if (key === 'photo' && value instanceof File) {
                    return `[File: ${value.name}, ${value.size} bytes]`;
                  }
                  return value;
                }, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Garden Guru Plant Wizard</h1>
          <p className="text-muted-foreground">
            Welcome to your plant journey! Let&apos;s add your first plant.
          </p>
        </div>

        <InitialPlantStep onNext={handleNext} />
      </div>
    </div>
  );
} 