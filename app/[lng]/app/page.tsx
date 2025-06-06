'use client'

import React, { useState, useEffect } from 'react'
import { Plant, Task, ViewType } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import DailyTasks from '@/components/DailyTasks'
import GardenManagement from '@/components/GardenManagement'
import TaskHistory from '@/components/TaskHistory'

// Local Storage Functions
const STORAGE_KEYS = {
  PLANTS: 'garden-guru-plants',
  LOCATION: 'garden-guru-location',
  TASKS: 'garden-guru-tasks'
}

const saveToLocalStorage = (key: string, data: Plant[] | Task[] | string) => {
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

export default function GardenGuruApp() {
  const [currentView, setCurrentView] = useState<ViewType>('daily-tasks')
  const [plants, setPlants] = useState<Plant[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [gardenLocation, setGardenLocation] = useState<string>('')
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load tasks from localStorage on component mount
  useEffect(() => {
    if (!isHydrated) return
    
    const savedTasks = loadFromLocalStorage(STORAGE_KEYS.TASKS)
    
    if (savedTasks && Array.isArray(savedTasks)) {
      setTasks(savedTasks)
    }
  }, [isHydrated])

  // Save tasks to localStorage whenever tasks array changes
  useEffect(() => {
    if (isHydrated && tasks.length >= 0) { // Allow saving empty array
      saveToLocalStorage(STORAGE_KEYS.TASKS, tasks)
    }
  }, [tasks, isHydrated])

  const renderCurrentView = () => {
    switch (currentView) {
      case 'daily-tasks':
        return <DailyTasks plants={plants} tasks={tasks} setTasks={setTasks} gardenLocation={gardenLocation} />
      case 'plants':
        return (
          <GardenManagement
            plants={plants}
            setPlants={setPlants}
            gardenLocation={gardenLocation}
            setGardenLocation={setGardenLocation}
          />
        )
      case 'task-history':
        return <TaskHistory plants={plants} tasks={tasks} />
      default:
        return <DailyTasks plants={plants} tasks={tasks} setTasks={setTasks} gardenLocation={gardenLocation} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 p-8">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  )
} 