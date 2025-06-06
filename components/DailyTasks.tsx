import React, { useState } from 'react'
import { Plant, Task } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Droplets, AlertTriangle, Leaf, Sparkles, Loader2, Plus } from 'lucide-react'

interface DailyTasksProps {
  plants: Plant[]
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  gardenLocation?: string
}

export default function DailyTasks({ plants, tasks, setTasks, gardenLocation }: DailyTasksProps) {
  const [isGeneratingAITasks, setIsGeneratingAITasks] = useState(false)
  const [aiTasksError, setAiTasksError] = useState<string | null>(null)
  const [aiTasksSuccess, setAiTasksSuccess] = useState<string | null>(null)
  
  const today = new Date().toISOString().split('T')[0]
  
  console.log('DailyTasks render - Current tasks:', tasks)
  console.log('Today\'s date:', today)
  console.log('Tasks due dates:', tasks.map(t => ({ id: t.id, dueDate: t.dueDate, name: t.taskName })))
  
  const todaysTasks = tasks.filter(
    task => task.completionDate === null && task.dueDate === today
  )
  
  const overdueTasks = tasks.filter(
    task => task.completionDate === null && task.dueDate < today
  )
  
  const upcomingTasks = tasks.filter(
    task => task.completionDate === null && task.dueDate > today
  )

  const generateTasks = () => {
    const newTasks: Task[] = []
    
    plants.forEach(plant => {
      const lastWateringTask = tasks
        .filter(task => task.plantId === plant.id && task.taskType === 'watering')
        .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())[0]
      
      let nextWateringDate: Date
      
      if (lastWateringTask) {
        const lastDate = new Date(lastWateringTask.dueDate)
        nextWateringDate = new Date(lastDate.getTime() + plant.wateringFrequency * 24 * 60 * 60 * 1000)
      } else {
        nextWateringDate = new Date()
      }
      
      const nextWateringDateString = nextWateringDate.toISOString().split('T')[0]
      
      if (nextWateringDateString <= today) {
        const existingTask = tasks.find(
          task => task.plantId === plant.id && 
                  task.taskType === 'watering' && 
                  task.dueDate === nextWateringDateString &&
                  task.completionDate === null
        )
        
        if (!existingTask) {
          newTasks.push({
            id: `task-${Date.now()}-${plant.id}`,
            taskName: `Water ${plant.name}`,
            completionDate: null,
            plantId: plant.id,
            dueDate: nextWateringDateString,
            taskType: 'watering'
          })
        }
      }
    })
    
    if (newTasks.length > 0) {
      setTasks([...tasks, ...newTasks])
    }
  }

  const generateAITasks = async () => {
    if (plants.length === 0) {
      setAiTasksError('No plants found. Please add some plants first.')
      return
    }

    setIsGeneratingAITasks(true)
    setAiTasksError(null)
    setAiTasksSuccess(null)

    try {
      console.log('Sending request to AI agent with:', {
        plantsCount: plants.length,
        plants: plants.map(p => ({ id: p.id, name: p.name, type: p.type })),
        currentDate: today,
        gardenLocation
      })

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plants,
          currentDate: today,
          gardenLocation,
          preferences: {
            taskFrequency: 'weekly',
            experienceLevel: 'intermediate',
            availableTime: 'medium'
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received AI response:', data)

      if (data.success && data.tasks) {
        console.log('AI generated tasks:', data.tasks)
        
        // Filter out tasks that already exist
        const existingTaskKeys = new Set(
          tasks.map(task => `${task.plantId}-${task.taskType}-${task.dueDate}`)
        )
        console.log('Existing task keys:', Array.from(existingTaskKeys))

        const newAITasks = data.tasks.filter((task: Task) => {
          const taskKey = `${task.plantId}-${task.taskType}-${task.dueDate}`
          const exists = existingTaskKeys.has(taskKey)
          console.log(`Task ${taskKey}: exists=${exists}`)
          return !exists
        })

        console.log('New AI tasks after filtering:', newAITasks)

        if (newAITasks.length > 0) {
          const updatedTasks = [...tasks, ...newAITasks]
          console.log('Setting tasks to:', updatedTasks)
          setTasks(updatedTasks)
          setAiTasksSuccess('AI tasks successfully added to your task list.')
        } else {
          console.log('No new tasks to add - all tasks already exist')
          setAiTasksError('All suggested tasks already exist in your task list.')
        }
      } else {
        throw new Error(data.error || 'Failed to generate AI tasks')
      }
    } catch (error) {
      console.error('Error generating AI tasks:', error)
      setAiTasksError(error instanceof Error ? error.message : 'Failed to generate AI tasks')
    } finally {
      setIsGeneratingAITasks(false)
    }
  }

  const completeTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completionDate: new Date().toISOString().split('T')[0] }
        : task
    ))
  }

  const getPlantName = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId)
    return plant?.name || 'Unknown Plant'
  }

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'watering':
        return <Droplets className="w-4 h-4 text-blue-500" />
      default:
        return <Leaf className="w-4 h-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-green-900 dark:text-green-100">Daily Tasks</h1>
          <p className="text-green-600 dark:text-green-400 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateTasks} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate Tasks
          </Button>
          <Button 
            onClick={generateAITasks} 
            variant="outline" 
            size="sm"
            disabled={isGeneratingAITasks}
          >
            {isGeneratingAITasks ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGeneratingAITasks ? 'Generating...' : 'AI Tasks'}
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button 
              onClick={() => {
                console.log('Current tasks state:', tasks)
                console.log('LocalStorage tasks:', localStorage.getItem('garden-guru-tasks'))
                alert(`Tasks in state: ${tasks.length}, Tasks in localStorage: ${localStorage.getItem('garden-guru-tasks') ? JSON.parse(localStorage.getItem('garden-guru-tasks')!).length : 0}`)
              }} 
              variant="outline" 
              size="sm"
            >
              Debug
            </Button>
          )}
        </div>
      </div>

      {aiTasksError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {aiTasksError}
        </div>
      )}

      {aiTasksSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {aiTasksSuccess}
        </div>
      )}

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                Overdue Tasks ({overdueTasks.length})
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTaskIcon(task.taskType)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.taskName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getPlantName(task.plantId)} • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => completeTask(task.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Today's Tasks */}
      <Card>
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">
            Today&apos;s Tasks ({todaysTasks.length})
          </h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No tasks for today! All plants are happy.</p>
            </div>
          ) : (
            todaysTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTaskIcon(task.taskType)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.taskName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getPlantName(task.plantId)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => completeTask(task.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
              Upcoming Tasks ({upcomingTasks.length})
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTaskIcon(task.taskType)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.taskName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getPlantName(task.plantId)} • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => completeTask(task.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">Quick Stats</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{plants.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Plants</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todaysTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Today</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{upcomingTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 