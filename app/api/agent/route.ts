// pages/api/plant-agent.ts (or app/api/plant-agent/route.ts for App Router)

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Types
interface Plant {
  id: string;
  name: string;
  picture: string;
  type: string;
  plantingDate: string;
  wateringFrequency: number; // days
  careTips: string;
  quantity: number;
}

interface PlantAgentRequest {
  plants: Plant[];
  currentDate?: string;
  gardenLocation?: string;
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
  taskName: string;
  description: string;
  dueDate: string;
  estimatedTime: string;
  tools?: string[];
  tips?: string[];
}

interface Task {
  id: string;
  taskName: string;
  completionDate: string | null;
  plantId: string;
  dueDate: string;
  taskType: "watering" | "fertilizing" | "pruning" | "repotting" | "other";
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  estimatedTime?: string;
  tools?: string[];
  tips?: string[];
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

async function generatePlantTasks(plants: Plant[], currentDate: string, gardenLocation?: string, preferences?: PlantAgentRequest['preferences']): Promise<Task[]> {
  // Check if API key is available
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google API key not configured. Please set GOOGLE_API_KEY environment variable.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Calculate days since planting for each plant
  const plantsWithAge = plants.map(plant => {
    const plantingDate = new Date(plant.plantingDate);
    const today = new Date(currentDate);
    const daysSincePlanting = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    return { ...plant, daysSincePlanting };
  });

  const prompt = `You are an expert plant care specialist. Based on the following information, generate specific, actionable plant care tasks.

CURRENT DATE: ${currentDate}
GARDEN LOCATION: ${gardenLocation || 'Not specified'}
NUMBER OF PLANTS: ${plants.length}

PLANTS INFORMATION:
${plantsWithAge.map((plant, index) => `
Plant ${index + 1}:
- Name: ${plant.name}
- Type: ${plant.type}
- Quantity: ${plant.quantity}
- Days since planting: ${plant.daysSincePlanting}
- Watering frequency: Every ${plant.wateringFrequency} days
- Care tips: ${plant.careTips}
`).join('\n')}

USER PREFERENCES:
- Experience Level: ${preferences?.experienceLevel || 'intermediate'}
- Available Time: ${preferences?.availableTime || 'medium'}
- Task Frequency: ${preferences?.taskFrequency || 'weekly'}

Please generate a JSON response with an array of tasks. Each task should include:
- plantIndex: index of the plant (0-based)
- taskType: watering, fertilizing, pruning, repotting, other
- priority: low, medium, high, urgent
- taskName: short descriptive title
- description: detailed instructions
- dueDate: suggested date (YYYY-MM-DD format)
- estimatedTime: how long the task takes
- tools: array of tools needed (optional)
- tips: array of helpful tips (optional)

Consider:
1. Current season and weather patterns for ${gardenLocation || 'the location'}
2. Plant-specific care requirements based on type and care tips
3. Watering schedule based on each plant's watering frequency
4. Plant age and development stage
5. Seasonal activities (repotting in spring, dormancy care in winter)
6. User's experience level and available time
7. Plant quantity (some tasks may need to be done multiple times)

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
      taskName: task.taskName,
      completionDate: null,
      dueDate: task.dueDate,
      taskType: task.taskType as "watering" | "fertilizing" | "pruning" | "repotting" | "other",
      priority: task.priority as 'low' | 'medium' | 'high' | 'urgent' | undefined,
      description: task.description,
      estimatedTime: task.estimatedTime,
      tools: task.tools,
      tips: task.tips
    }));
    
    return tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw new Error('Failed to generate plant care tasks');
  }
}

async function generateSummary(tasks: Task[], plants: Plant[]): Promise<string> {
  // Check if API key is available
  if (!process.env.GOOGLE_API_KEY) {
    return `You have ${plants.length} plants that need attention. I've generated ${tasks.length} tasks to help keep them healthy and thriving!`;
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Create a brief, encouraging summary for a plant parent based on these generated tasks:

PLANTS: ${plants.length} plants (${plants.map(p => p.name).join(', ')})
TASKS GENERATED: ${tasks.length} tasks

TASK BREAKDOWN:
${tasks.map(task => `- ${task.taskName} (${task.priority || 'No priority'} priority, due ${task.dueDate})`).join('\n')}

Create a 2-3 sentence summary that:
1. Acknowledges their plant collection
2. Highlights the most important upcoming tasks
3. Provides encouraging words about plant care

Keep it friendly, concise, and motivating.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    return `You have ${plants.length} plants that need attention. I've generated ${tasks.length} tasks to help keep them healthy and thriving!`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PlantAgentRequest = await request.json();
    
    // Same validation and processing logic as above
    const { plants, currentDate, preferences } = body;
    
    console.log('Received request:', { 
      plantsCount: plants?.length, 
      currentDate, 
      hasApiKey: !!process.env.GOOGLE_API_KEY 
    });
    
    if (!plants || !Array.isArray(plants) || plants.length === 0) {
      console.log('Invalid plants data:', plants);
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
        console.log('Invalid plant data:', plant);
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

    console.log('Generating tasks for plants:', plantsWithIds.map(p => ({ id: p.id, name: p.name, type: p.type })));

    const tasks = await generatePlantTasks(plantsWithIds, date, body.gardenLocation, preferences);
    const summary = await generateSummary(tasks, plantsWithIds);

    console.log('Successfully generated tasks:', tasks.length);

    return NextResponse.json({
      success: true,
      tasks,
      summary
    });

  } catch (error) {
    console.error('Plant agent error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json({
      success: false,
      tasks: [],
      summary: '',
      error: errorMessage
    }, { status: 500 });
  }
}