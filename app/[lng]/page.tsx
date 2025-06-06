'use client'

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Leaf,
  Calendar,
  CheckCircle,
  Star,
  Users,
  Camera,
  Droplets,
  Sun,
  Scissors,
  Heart,
  ArrowRight,
  Quote,
} from "lucide-react"
import Image from "next/image"
import { useTranslation } from '@/app/i18n/client'
import LanguageSwitcher from '@/components/language-switcher'
import ThemeSwitcher from '@/components/theme-switcher'
import { use } from 'react'

export default function GardenGuruLanding({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = use(params)
  const { t } = useTranslation(lng, 'common')
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Navigation Header */}
        <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-green-100 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-800 dark:text-green-400">Garden-Guru</span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-6">
              <a href="#how-it-works" className="text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium">
                How It Works
              </a>
              <a href="#features" className="text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium">
                Reviews
              </a>
            </nav>
            
            <div className="flex items-center gap-2">
              <ThemeSwitcher lng={lng} />
              <LanguageSwitcher lng={lng} />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-16 md:py-24 lg:py-32">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Your Personal Plant Whisperer</Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 dark:text-green-100 leading-tight">
                    Never Kill a Plant Again. Your Personal Garden Guru is Here.
                  </h1>
                  <p className="text-xl text-green-700 dark:text-green-300 leading-relaxed">
                    Get daily, hyper-personalized tasks for your specific plants, right at your fingertips. From watering
                    schedules to soil health, we've got you covered.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900 px-8 py-3 text-lg"
                  >
                    See a Demo
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-green-600 dark:text-green-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=600&width=500"
                    alt="Thriving indoor garden with various healthy plants"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
                </div>

                {/* Floating task cards */}
                <div className="absolute -right-4 top-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 max-w-xs">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm dark:text-slate-200">Today's Task</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Water your Monstera - soil feels dry!</p>
                </div>

                <div className="absolute -left-4 bottom-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 max-w-xs">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-sm dark:text-slate-200">Reminder</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Move your Snake Plant closer to the window</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="px-4 py-16 bg-green-50 dark:bg-slate-800">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100 mb-8">Tired of Guesswork? We Were Too.</h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Before Garden-Guru</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-slate-400">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-red-500">😵</span>
                    </div>
                    <span>Overwatering kills another plant</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-slate-400">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-red-500">❓</span>
                    </div>
                    <span>Confused about when to fertilize</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-slate-400">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <span className="text-red-500">📱</span>
                    </div>
                    <span>Googling plant care at 2 AM</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">After Garden-Guru</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-slate-400">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-500">🌱</span>
                    </div>
                    <span>Thriving plants everywhere</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-slate-400">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-500">😊</span>
                    </div>
                    <span>Confident in your plant care</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-slate-400">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-500">⏰</span>
                    </div>
                    <span>More time to enjoy your garden</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100 mb-4">Your 3 Steps to a Greener Thumb</h2>
              <p className="text-xl text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                Getting started with Garden-Guru is as easy as planting a seed
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">Tell Us About Your Plants</h3>
                <p className="text-green-700 dark:text-green-300">
                  Quickly add the plants you own from our extensive database or by simply snapping a photo.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">Share Your Location</h3>
                <p className="text-green-700 dark:text-green-300">
                  Your local climate and the current day of the year are key to our personalized recommendations.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">Receive Daily Tasks</h3>
                <p className="text-green-700 dark:text-green-300">
                  Get easy-to-follow daily and weekly tasks, from watering reminders to soil-changing alerts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100 mb-4">
                The "Magic" Behind the Guru: Personalized for You
              </h2>
              <p className="text-xl text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                Our smart technology adapts to your unique situation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100">Location-Based Intelligence</h3>
                  <p className="text-green-700 dark:text-green-300">
                    Enter your location and we'll factor in your local climate, humidity, and seasonal changes to give you
                    perfectly timed recommendations.
                  </p>

                  <div className="space-y-3">
                    <label htmlFor="location" className="block text-sm font-medium text-green-800 dark:text-green-200">
                      Enter Your City or Zip Code
                    </label>
                    <div className="relative">
                      <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={handleLocationChange}
                        className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500 dark:border-green-700 dark:bg-slate-800"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                    </div>
                    {location && (
                      <div className="text-sm text-green-600 dark:text-green-400 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Great! We'll customize everything for {location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100">Smart Task Suggestions</h3>
                  <p className="text-green-700 dark:text-green-300">
                    The more you interact with Garden-Guru, the smarter our suggestions become. We learn from your actions
                    to provide even better care recommendations.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Today's Personalized Tasks</h4>

                <Card className="border-green-200 dark:border-green-700 dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-1">
                        <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-slate-100">Water Wednesday</h5>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                          Time to give your Monstera a drink! Check the soil moisture first.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                          Mark as Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-700 dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-1">
                        <Sun className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-slate-100">Fertilizer Friday</h5>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                          Your Fiddle Leaf Fig could use a nutrient boost this week.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                          Mark as Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-700 dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-1">
                        <Scissors className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-slate-100">Soil Saturday</h5>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                          Consider repotting your Snake Plant into fresh soil soon.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                          Mark as Done
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section id="testimonials" className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-100 mb-4">
                Join Our Growing Community of Happy Plant Parents
              </h2>
              <div className="flex justify-center items-center space-x-8 text-green-600 dark:text-green-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">10,000+ Happy Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">50,000+ Plants Saved</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-green-200 dark:border-green-700 dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-green-200 dark:text-green-700 mb-4" />
                  <p className="text-gray-600 dark:text-slate-400 mb-4">
                    "I went from killing every plant I touched to having a thriving indoor jungle. Garden-Guru's daily
                    reminders are a game-changer!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold">SM</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">Sarah Martinez</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Plant Parent for 6 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-700 dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-green-200 dark:text-green-700 mb-4" />
                  <p className="text-gray-600 dark:text-slate-400 mb-4">
                    "The location-based recommendations are spot on. My plants have never looked better, and I finally
                    understand what they need!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold">DJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">David Johnson</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Urban Gardener</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-700 dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-green-200 dark:text-green-700 mb-4" />
                  <p className="text-gray-600 dark:text-slate-400 mb-4">
                    "As a busy mom, I love how Garden-Guru keeps my plants healthy without me having to remember
                    everything. It's like having a plant expert in my pocket!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold">EL</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">Emily Liu</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Busy Plant Mom</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-16 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="space-y-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Plant Care?</h2>
              <p className="text-xl text-green-100 dark:text-green-200 max-w-2xl mx-auto">
                Join thousands of plant parents who've discovered the secret to thriving plants. Your personalized garden
                journey starts today.
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-white text-gray-900 border-0 h-12"
                />
                <Button size="lg" className="w-full bg-white text-green-700 hover:bg-green-50 h-12 text-lg font-semibold">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="flex justify-center items-center space-x-6 text-sm text-green-100 dark:text-green-200">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>No setup fees</span>
                </div>
              </div>

              <p className="text-sm text-green-200 dark:text-green-300">
                Still have questions?{" "}
                <Button variant="link" className="text-white underline p-0 h-auto">
                  Explore Our Features
                </Button>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 bg-green-900 dark:bg-slate-900 text-green-100 dark:text-slate-300">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Garden-Guru</span>
              </div>

              <div className="flex space-x-6 text-sm">
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-green-800 dark:border-slate-700 text-center text-sm text-green-300 dark:text-slate-400">
              <p>
                &copy; {new Date().getFullYear()} Garden-Guru. All rights reserved. Helping plants thrive, one garden at a
                time.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}