// pages/api/plant-agent.ts (or app/api/plant-agent/route.ts for App Router)

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Types
interface Plant {
  id: string;
  name: string;
  type: string;
  variety?: string;
  age?: string;
  location: string; // indoor/outdoor/greenhouse
  lastWatered?: string;
  lastFertilized?: string;
  season?: string;
  healthStatus?: 'healthy' | 'sick' | 'recovering' | 'dormant';
  specialNotes?: string;
}

interface PlantAgentRequest {
  plants: Plant[];
  currentDate?: string;
  preferences?: {
    taskFrequency?: 'daily' | 'weekly' | 'monthly';
    experienceLevel?: 'beginner' | 'intermediate' | 'expert';
    availableTime?: 'low' | 'medium' | 'high';
  };
}

interface TaskData {
  plantIndex?: number;
  taskType: string;
  priority: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedTime: string;
  tools?: string[];
  tips?: string[];
}

interface Task {
  id: string;
  plantId: string;
  plantName: string;
  taskType: 'watering' | 'fertilizing' | 'pruning' | 'repotting' | 'monitoring' | 'treatment' | 'seasonal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  dueDate: string;
  estimatedTime: string;
  tools?: string[];
  tips?: string[];
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyAbaljp6MneexHJYoeceen8JdO0FO3wdH0');

async function generatePlantTasks(plants: Plant[], currentDate: string, preferences?: PlantAgentRequest['preferences']): Promise<Task[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are an expert plant care specialist. Based on the following information, generate specific, actionable plant care tasks.

CURRENT DATE: ${currentDate}
NUMBER OF PLANTS: ${plants.length}

PLANTS INFORMATION:
${plants.map((plant, index) => `
Plant ${index + 1}:
- Name: ${plant.name}
- Type: ${plant.type}
- Variety: ${plant.variety || 'Not specified'}
- Age: ${plant.age || 'Not specified'}
- Location: ${plant.location}
- Last Watered: ${plant.lastWatered || 'Not specified'}
- Last Fertilized: ${plant.lastFertilized || 'Not specified'}
- Health Status: ${plant.healthStatus || 'Not specified'}
- Special Notes: ${plant.specialNotes || 'None'}
`).join('\n')}

USER PREFERENCES:
- Experience Level: ${preferences?.experienceLevel || 'intermediate'}
- Available Time: ${preferences?.availableTime || 'medium'}
- Task Frequency: ${preferences?.taskFrequency || 'weekly'}

Please generate a JSON response with an array of tasks. Each task should include:
- plantId: reference to the plant
- taskType: watering, fertilizing, pruning, repotting, monitoring, treatment, seasonal
- priority: low, medium, high, urgent
- title: short descriptive title
- description: detailed instructions
- dueDate: suggested date (YYYY-MM-DD format)
- estimatedTime: how long the task takes
- tools: array of tools needed (optional)
- tips: array of helpful tips (optional)

Consider:
1. Current season and weather patterns
2. Plant-specific care requirements
3. Overdue care (if last watered/fertilized dates are old)
4. Seasonal activities (repotting in spring, dormancy care in winter)
5. Health issues that need attention
6. User's experience level and available time

Format the response as a valid JSON array of task objects.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const tasksData = JSON.parse(jsonMatch[0]);
    
    // Add unique IDs and ensure plant references
    const tasks: Task[] = tasksData.map((task: TaskData, index: number) => ({
      id: `task_${Date.now()}_${index}`,
      plantId: plants[task.plantIndex || 0]?.id || plants[0]?.id,
      plantName: plants[task.plantIndex || 0]?.name || plants[0]?.name,
      ...task
    }));
    
    return tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw new Error('Failed to generate plant care tasks');
  }
}

async function generateSummary(tasks: Task[], plants: Plant[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Create a brief, encouraging summary for a plant parent based on these generated tasks:

PLANTS: ${plants.length} plants (${plants.map(p => p.name).join(', ')})
TASKS GENERATED: ${tasks.length} tasks

TASK BREAKDOWN:
${tasks.map(task => `- ${task.title} (${task.priority} priority, due ${task.dueDate})`).join('\n')}

Create a 2-3 sentence summary that:
1. Acknowledges their plant collection
2. Highlights the most important upcoming tasks
3. Provides encouraging words about plant care

Keep it friendly, concise, and motivating.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch {
    return `You have ${plants.length} plants that need attention. I've generated ${tasks.length} tasks to help keep them healthy and thriving!`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PlantAgentRequest = await request.json();
    
    // Same validation and processing logic as above
    const { plants, currentDate, preferences } = body;
    
    if (!plants || !Array.isArray(plants) || plants.length === 0) {
      return NextResponse.json({
        success: false,
        tasks: [],
        summary: '',
        error: 'Plants array is required and must not be empty'
      }, { status: 400 });
    }

    // Validate plant data
    for (const plant of plants) {
      if (!plant.name || !plant.type) {
        return NextResponse.json({
          success: false,
          tasks: [],
          summary: '',
          error: 'Each plant must have a name and type'
        }, { status: 400 });
      }
    }

    const date = currentDate || new Date().toISOString().split('T')[0];
    const plantsWithIds = plants.map((plant, index) => ({
      ...plant,
      id: plant.id || `plant_${index + 1}`
    }));

    const tasks = await generatePlantTasks(plantsWithIds, date, preferences);
    const summary = await generateSummary(tasks, plantsWithIds);

    return NextResponse.json({
      success: true,
      tasks,
      summary
    });

  } catch (error) {
    console.error('Plant agent error:', error);
    return NextResponse.json({
      success: false,
      tasks: [],
      summary: '',
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}