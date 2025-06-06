import { NextRequest, NextResponse } from 'next/server';
import { database, ensureDbConnection } from '@/lib/database';
import { plantAPI } from '@/lib/plant-api';
import { InitialPlantFormData, PlacementType, ContainerUnit } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await ensureDbConnection();
    
    const formData = await request.formData();
    
    // Extract form data
    const plantData: InitialPlantFormData = {
      user_defined_name: formData.get('user_defined_name') as string,
      placement_type: formData.get('placement_type') as PlacementType,
      photo: formData.get('photo') as File | null || undefined,
    };

    // Handle container details if placement type is Container
    if (plantData.placement_type === 'Container') {
      plantData.container_details = {
        material: formData.get('container_material') as string,
        volume: parseFloat(formData.get('container_volume') as string),
        unit: formData.get('container_unit') as ContainerUnit,
        is_self_watering: formData.get('is_self_watering') === 'true',
      };
    }

    // Validate required fields
    if (!plantData.user_defined_name) {
      return NextResponse.json(
        { error: 'Plant name is required' },
        { status: 400 }
      );
    }

    if (plantData.placement_type === 'Container') {
      if (!plantData.container_details?.material || !plantData.container_details?.volume) {
        return NextResponse.json(
          { error: 'Container details are required for container plants' },
          { status: 400 }
        );
      }
    }

    // Create plant in database
    const plantId = await database.createPlantFromInitialData(plantData);

    // If photo is provided, try to identify the plant
    let identificationResults = null;
    if (plantData.photo) {
      try {
        identificationResults = await plantAPI.identifyPlant(plantData.photo);
        
        // If we get identification results, update the plant with the information
        if (identificationResults.length > 0) {
          const topResult = identificationResults[0];
          const plantDetails = topResult.plant_details.plant_details;
          
          const updatedPlantData = plantAPI.convertToPlantSchema(
            plantDetails,
            plantData.user_defined_name
          );
          
          await database.updatePlant(plantId, updatedPlantData);
        }
      } catch (error) {
        console.error('Plant identification failed:', error);
        // Continue without identification - not a critical failure
      }
    }

    return NextResponse.json({
      success: true,
      plantId,
      identificationResults,
      message: 'Plant created successfully!',
    });

  } catch (error) {
    console.error('Error creating plant:', error);
    return NextResponse.json(
      { error: 'Failed to create plant' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDbConnection();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');

    if (search) {
      const plants = await database.searchPlants(search, userId || undefined);
      return NextResponse.json({ plants });
    }

    if (userId) {
      const plants = await database.getPlantsByUser(userId);
      return NextResponse.json({ plants });
    }

    return NextResponse.json(
      { error: 'userId or search parameter is required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching plants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plants' },
      { status: 500 }
    );
  }
} 