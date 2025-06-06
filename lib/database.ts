import { MongoClient, Db, Collection, ObjectId, Document } from 'mongodb';
import { ComplexPlant, InitialPlantFormData } from './types';

const MONGODB_URI = 'mongodb+srv://marcinbawolski:6UsdBSuMIegkui99@gardenguru.fscb82g.mongodb.net/';
const DATABASE_NAME = 'garden-guru';

// MongoDB document types
interface PlantDocument extends Omit<ComplexPlant, 'id'> {
  _id?: ObjectId;
}

class DatabaseService {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE_NAME);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }

  private getCollection<T extends Document = Document>(collectionName: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db.collection<T>(collectionName);
  }

  // Plant operations
  async createPlant(plantData: Partial<ComplexPlant>): Promise<string> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    
    const plant: PlantDocument = {
      area_id: plantData.area_id || new ObjectId().toString(),
      identity: plantData.identity!,
      placement: plantData.placement!,
      care_profile: plantData.care_profile || {
        watering_needs: 'moderate',
        sun_needs: ['partial_sun'],
        soil_needs: {
          drainage: 'well_draining',
          texture: ['loam'],
        },
      },
      journal: plantData.journal || {
        current_status: 'healthy',
        entries: [],
      },
      health: plantData.health || {
        assessments: [],
      },
    };

    const result = await plantsCollection.insertOne(plant);
    return result.insertedId.toString();
  }

  async createPlantFromInitialData(formData: InitialPlantFormData, userId?: string): Promise<string> {
    const plantData: Partial<ComplexPlant> = {
      area_id: userId || new ObjectId().toString(),
      identity: {
        user_defined_name: formData.user_defined_name,
      },
      placement: {
        type: formData.placement_type,
        date_acquired: new Date(),
        container_details: formData.container_details,
      },
      journal: {
        current_status: 'healthy',
        entries: [],
      },
      health: {
        assessments: [],
      },
    };

    // If photo is provided, we would typically upload it to a storage service
    // and store the URL in the journal entries
    if (formData.photo) {
      const photoEntry = {
        entry_id: new ObjectId().toString(),
        timestamp: new Date(),
        type: 'photo' as const,
        notes: 'Initial plant photo',
        photos: ['placeholder-url'], // In a real app, this would be the uploaded photo URL
      };
      
      plantData.journal!.entries = [photoEntry];
    }

    return this.createPlant(plantData);
  }

  async getPlant(plantId: string): Promise<ComplexPlant | null> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const plant = await plantsCollection.findOne({ _id: new ObjectId(plantId) });
    
    if (plant) {
      return {
        ...plant,
        id: plant._id!.toString(),
      };
    }
    
    return null;
  }

  async getPlantsByUser(userId: string): Promise<ComplexPlant[]> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const plants = await plantsCollection.find({ area_id: userId }).toArray();
    
    return plants.map(plant => ({
      ...plant,
      id: plant._id!.toString(),
    }));
  }

  async updatePlant(plantId: string, updateData: Partial<ComplexPlant>): Promise<boolean> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const result = await plantsCollection.updateOne(
      { _id: new ObjectId(plantId) },
      { $set: updateData }
    );
    
    return result.modifiedCount > 0;
  }

  async deletePlant(plantId: string): Promise<boolean> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const result = await plantsCollection.deleteOne({ _id: new ObjectId(plantId) });
    
    return result.deletedCount > 0;
  }

  // Journal operations
  async addJournalEntry(plantId: string, entry: Omit<NonNullable<ComplexPlant['journal']>['entries'][0], 'entry_id'>): Promise<string> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const entryId = new ObjectId().toString();
    
    const journalEntry = {
      ...entry,
      entry_id: entryId,
    };

    await plantsCollection.updateOne(
      { _id: new ObjectId(plantId) },
      { $push: { 'journal.entries': journalEntry } }
    );

    return entryId;
  }

  async updatePlantStatus(plantId: string, status: NonNullable<ComplexPlant['journal']>['current_status']): Promise<boolean> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const result = await plantsCollection.updateOne(
      { _id: new ObjectId(plantId) },
      { $set: { 'journal.current_status': status } }
    );

    return result.modifiedCount > 0;
  }

  // Health assessment operations
  async addHealthAssessment(plantId: string, assessment: Omit<NonNullable<ComplexPlant['health']>['assessments'][0], 'assessment_id'>): Promise<string> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    const assessmentId = new ObjectId().toString();
    
    const healthAssessment = {
      ...assessment,
      assessment_id: assessmentId,
    };

    await plantsCollection.updateOne(
      { _id: new ObjectId(plantId) },
      { $push: { 'health.assessments': healthAssessment } }
    );

    return assessmentId;
  }

  // Search operations
  async searchPlants(query: string, userId?: string): Promise<ComplexPlant[]> {
    const plantsCollection = this.getCollection<PlantDocument>('plants');
    
    const searchFilter: Record<string, unknown> = {
      $or: [
        { 'identity.user_defined_name': { $regex: query, $options: 'i' } },
        { 'identity.common_name': { $regex: query, $options: 'i' } },
        { 'identity.scientific_name': { $regex: query, $options: 'i' } },
      ],
    };

    if (userId) {
      searchFilter.area_id = userId;
    }

    const plants = await plantsCollection.find(searchFilter).toArray();
    
    return plants.map(plant => ({
      ...plant,
      id: plant._id!.toString(),
    }));
  }

  // Garden area operations (for future use)
  async createGardenArea(areaData: { name: string; type: string; userId: string }): Promise<string> {
    const areasCollection = this.getCollection('garden_areas');
    const result = await areasCollection.insertOne({
      ...areaData,
      created_at: new Date(),
    });
    
    return result.insertedId.toString();
  }

  async getGardenAreas(userId: string): Promise<Array<Record<string, unknown> & { id: string }>> {
    const areasCollection = this.getCollection('garden_areas');
    const areas = await areasCollection.find({ userId }).toArray();
    
    return areas.map(area => ({
      ...area,
      id: area._id.toString(),
    }));
  }
}

// Singleton instance
export const database = new DatabaseService();

// Helper function to ensure database connection
export async function ensureDbConnection(): Promise<void> {
  try {
    await database.connect();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await database.disconnect();
  process.exit(0);
}); 