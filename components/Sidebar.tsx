import React from 'react'
import { ViewType } from '@/lib/types'
import { Leaf, Calendar, Sprout, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const menuItems = [
    {
      id: 'daily-tasks' as ViewType,
      label: 'Daily Tasks',
      icon: Calendar,
    },
    {
      id: 'plants' as ViewType,
      label: 'My Garden',
      icon: Sprout,
    },
    {
      id: 'task-history' as ViewType,
      label: 'Task History',
      icon: History,
    },
  ]

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-green-100 dark:border-slate-700 min-h-screen p-6">
      {/* Logo and App Name */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-green-800 dark:text-green-400">Garden Guru</h1>
          <p className="text-sm text-green-600 dark:text-green-500">Your Plant Care Assistant</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start space-x-3 ${
                isActive
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900'
              }`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          )
        })}
      </nav>
    </div>
  )
} 