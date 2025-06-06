'use client'

import React, { useState } from 'react'
import { Plant, Task, ViewType } from '@/lib/types'
import Sidebar from '@/components/Sidebar'
import DailyTasks from '@/components/DailyTasks'
import GardenManagement from '@/components/GardenManagement'
import TaskHistory from '@/components/TaskHistory'

export default function GardenGuruApp() {
  const [currentView, setCurrentView] = useState<ViewType>('daily-tasks')
  const [plants, setPlants] = useState<Plant[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [gardenLocation, setGardenLocation] = useState<string>('')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'daily-tasks':
        return <DailyTasks plants={plants} tasks={tasks} setTasks={setTasks} />
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
        return <DailyTasks plants={plants} tasks={tasks} setTasks={setTasks} />
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