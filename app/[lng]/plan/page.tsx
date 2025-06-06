"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Leaf, 
  Database, 
  Smartphone, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function PlanPage() {
  const features = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Smart Plant Identification",
      description: "Upload a photo and our AI will identify your plant species and provide detailed care information.",
      status: "implemented"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Plant Database Integration",
      description: "Connected to Perenual API with 10,000+ plant species and comprehensive care data.",
      status: "implemented"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Dynamic Form Fields",
      description: "Intelligent forms that adapt based on your plant's placement (container, in-ground, raised bed).",
      status: "implemented"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Photo Upload & Preview",
      description: "Drag & drop or click to upload plant photos with instant preview functionality.",
      status: "implemented"
    }
  ];

  const userPersonas = [
    {
      name: "Ava - The Novice",
      description: "New to gardening, needs simple and intuitive guidance",
      needs: ["Easy plant identification", "Basic care instructions", "Beginner-friendly interface"],
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Marcus - The Enthusiast",
      description: "Experienced gardener wanting to track and optimize plant care",
      needs: ["Detailed plant data", "Care tracking", "Advanced features"],
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Elena - The Professional",
      description: "Landscape professional managing multiple gardens",
      needs: ["Bulk plant management", "Professional tools", "Client reporting"],
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const wizardSteps = [
    {
      step: 1,
      title: "Plant Information",
      description: "Enter your plant's name and basic details",
      features: ["User-defined plant name", "Placement type selection", "Container details (if applicable)"]
    },
    {
      step: 2,
      title: "Photo Upload",
      description: "Add a photo for AI identification",
      features: ["Drag & drop upload", "Photo preview", "AI plant identification"]
    },
    {
      step: 3,
      title: "Save & Analyze",
      description: "Store in database and get care recommendations",
      features: ["MongoDB storage", "Care profile generation", "Success confirmation"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Garden Guru Plant Wizard
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Plant Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A frictionless, AI-powered plant onboarding experience designed for gardeners of all levels. 
            From novice to professional, our wizard makes plant care accessible and intelligent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/wizard">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Try the Wizard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* User Personas Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Designed for Every Gardener</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our wizard adapts to different user needs, from complete beginners to seasoned professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {userPersonas.map((persona, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Badge className={persona.color}>
                      {persona.name.split(' - ')[1]}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{persona.name.split(' - ')[0]}</CardTitle>
                  <CardDescription>{persona.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Needs:</h4>
                    <ul className="space-y-1">
                      {persona.needs.map((need, needIndex) => (
                        <li key={needIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard Steps Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How the Wizard Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple 3-step process that gets your plants into the system quickly and accurately.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {wizardSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Zap className="h-3 w-3 mr-2 text-yellow-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {index < wizardSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern technology and best practices for a seamless user experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Implementation Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technical Implementation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern web technologies for performance, scalability, and maintainability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">Next.js 15</Badge>
                  <Badge variant="outline">React 19</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">UI Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">shadcn/ui</Badge>
                  <Badge variant="outline">Radix UI</Badge>
                  <Badge variant="outline">Lucide Icons</Badge>
                  <Badge variant="outline">Responsive Design</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">MongoDB</Badge>
                  <Badge variant="outline">Perenual API</Badge>
                  <Badge variant="outline">PlantNet API</Badge>
                  <Badge variant="outline">Next.js API Routes</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline">AI Plant ID</Badge>
                  <Badge variant="outline">Photo Upload</Badge>
                  <Badge variant="outline">Dynamic Forms</Badge>
                  <Badge variant="outline">Type Safety</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Plant Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the most intuitive plant onboarding wizard designed for gardeners of all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/en/wizard">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                Launch Plant Wizard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 