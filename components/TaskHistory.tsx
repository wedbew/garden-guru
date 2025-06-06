import React, { useState } from 'react'
import { Plant, Task } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { History, Droplets, Leaf, Scissors, Zap, Calendar } from 'lucide-react'

interface TaskHistoryProps {
  plants: Plant[]
  tasks: Task[]
}

export default function TaskHistory({ plants, tasks }: TaskHistoryProps) {
  const [selectedPlant, setSelectedPlant] = useState<string>('all')
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all')

  const completedTasks = tasks.filter(task => task.completionDate !== null)

  const filteredTasks = completedTasks.filter(task => {
    const plantMatch = selectedPlant === 'all' || task.plantId === selectedPlant
    const typeMatch = selectedTaskType === 'all' || task.taskType === selectedTaskType
    return plantMatch && typeMatch
  })

  const getPlantName = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId)
    return plant?.name || 'Unknown Plant'
  }

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'watering':
        return <Droplets className="w-4 h-4 text-blue-500" />
      case 'fertilizing':
        return <Zap className="w-4 h-4 text-yellow-500" />
      case 'pruning':
        return <Scissors className="w-4 h-4 text-purple-500" />
      case 'repotting':
        return <div className="w-4 h-4 bg-orange-500 rounded-full" />
      default:
        return <Leaf className="w-4 h-4 text-green-500" />
    }
  }

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'watering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'fertilizing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'pruning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'repotting':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
  }

  // Group tasks by plant
  const tasksByPlant = filteredTasks.reduce((acc, task) => {
    const plantId = task.plantId
    if (!acc[plantId]) {
      acc[plantId] = []
    }
    acc[plantId].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  // Sort tasks by completion date (most recent first)
  Object.keys(tasksByPlant).forEach(plantId => {
    tasksByPlant[plantId].sort((a, b) => 
      new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime()
    )
  })

  // Calculate summary statistics
  const taskTypeStats = completedTasks.reduce((acc, task) => {
    acc[task.taskType] = (acc[task.taskType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-green-900 dark:text-green-100">Task History</h1>
          <p className="text-green-600 dark:text-green-400 mt-1">
            View your completed plant care tasks
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">Filters</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Plant
              </label>
              <Select value={selectedPlant} onValueChange={setSelectedPlant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plants</SelectItem>
                  {plants.map(plant => (
                    <SelectItem key={plant.id} value={plant.id}>
                      {plant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Task Type
              </label>
              <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Task Types</SelectItem>
                  <SelectItem value="watering">Watering</SelectItem>
                  <SelectItem value="fertilizing">Fertilizing</SelectItem>
                  <SelectItem value="pruning">Pruning</SelectItem>
                  <SelectItem value="repotting">Repotting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">Summary Statistics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{completedTasks.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taskTypeStats.watering || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Watering</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{taskTypeStats.fertilizing || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fertilizing</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{taskTypeStats.pruning || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pruning</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{taskTypeStats.repotting || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Repotting</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task History by Plant */}
      <div className="space-y-6">
        {Object.keys(tasksByPlant).length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  {completedTasks.length === 0 
                    ? "No completed tasks yet. Complete some tasks to see your history!"
                    : "No tasks match your current filters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.entries(tasksByPlant).map(([plantId, plantTasks]) => (
            <Card key={plantId}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    {getPlantName(plantId)} ({plantTasks.length} tasks)
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plantTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTaskIcon(task.taskType)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{task.taskName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs ${getTaskTypeColor(task.taskType)}`}>
                              {task.taskType}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(task.completionDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 