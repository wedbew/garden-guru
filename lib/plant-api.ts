const PERENUAL_API_KEY = 'sk-1hMq68431228a918610875';
const PERENUAL_BASE_URL = 'https://perenual.com/api';

export interface PlantSearchResult {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image?: {
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  };
}

export interface PlantDetails {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  family: string;
  origin: string[];
  type: string;
  dimension: string;
  dimensions: {
    type: string;
    min_value: number;
    max_value: number;
    unit: string;
  };
  cycle: string;
  watering: string;
  watering_general_benchmark: {
    value: string;
    unit: string;
  };
  watering_period: string;
  sunlight: string[];
  pruning_month: string[];
  pruning_count: {
    amount: number;
    interval: string;
  };
  seeds: number;
  attracts: string[];
  propagation: string[];
  hardiness: {
    min: string;
    max: string;
  };
  hardiness_location: {
    full_url: string;
    full_iframe: string;
  };
  flowers: boolean;
  flowering_season: string;
  soil: string[];
  pest_susceptibility: string[];
  cones: boolean;
  fruits: boolean;
  edible_fruit: boolean;
  edible_fruit_taste_profile: string;
  fruit_nutritional_value: string;
  fruit_color: string[];
  harvest_season: string;
  leaf: boolean;
  leaf_color: string[];
  edible_leaf: boolean;
  cuisine: boolean;
  medicinal: boolean;
  poisonous_to_humans: number;
  poisonous_to_pets: number;
  description: string;
  default_image?: {
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  };
  other_images: Array<{
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  }>;
}

export interface PlantIdentificationResult {
  id: number;
  plant_name: string;
  plant_details: {
    common_names: string[];
    url: string;
    name_authority: string;
    plant_details: PlantDetails;
  };
  probability: number;
  confirmed: boolean;
  similar_images: Array<{
    id: string;
    url: string;
    license_name: string;
    license_url: string;
    citation: string;
    similarity: number;
    url_small: string;
  }>;
}

class PlantAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = PERENUAL_API_KEY;
    this.baseUrl = PERENUAL_BASE_URL;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('key', this.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Plant API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search for plants by name
   */
  async searchPlants(query: string, page: number = 1): Promise<{ data: PlantSearchResult[]; total: number }> {
    return this.makeRequest('/species-list', {
      q: query,
      page: page.toString(),
    });
  }

  /**
   * Get detailed information about a specific plant
   */
  async getPlantDetails(plantId: number): Promise<PlantDetails> {
    return this.makeRequest(`/species/details/${plantId}`);
  }

  /**
   * Identify a plant from an image
   */
  async identifyPlant(imageFile: File): Promise<PlantIdentificationResult[]> {
    const formData = new FormData();
    formData.append('images', imageFile);
    formData.append('modifiers', JSON.stringify(['crops_fast', 'similar_images']));
    formData.append('plant_language', 'en');
    formData.append('plant_net_api_key', this.apiKey);

    const response = await fetch('https://my-api.plantnet.org/v2/identify/weurope', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Plant identification failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.results || [];
  }

  /**
   * Get plant care recommendations based on plant details
   */
  getCareRecommendations(plantDetails: PlantDetails) {
    return {
      watering: {
        frequency: plantDetails.watering,
        period: plantDetails.watering_period,
        benchmark: plantDetails.watering_general_benchmark,
      },
      sunlight: plantDetails.sunlight,
      soil: plantDetails.soil,
      pruning: {
        months: plantDetails.pruning_month,
        frequency: plantDetails.pruning_count,
      },
      hardiness: plantDetails.hardiness,
      pests: plantDetails.pest_susceptibility,
      edible: {
        fruit: plantDetails.edible_fruit,
        leaf: plantDetails.edible_leaf,
      },
      safety: {
        poisonous_to_humans: plantDetails.poisonous_to_humans,
        poisonous_to_pets: plantDetails.poisonous_to_pets,
      },
    };
  }

  /**
   * Convert Perenual plant data to our internal plant schema
   */
  convertToPlantSchema(plantDetails: PlantDetails, userDefinedName: string) {
    return {
      identity: {
        user_defined_name: userDefinedName,
        common_name: plantDetails.common_name,
        scientific_name: plantDetails.scientific_name[0] || '',
        aliases: plantDetails.other_name || [],
        api_references: {
          perenual_id: plantDetails.id,
        },
      },
      care_profile: {
        watering_needs: this.mapWateringNeeds(plantDetails.watering),
        sun_needs: this.mapSunNeeds(plantDetails.sunlight),
        soil_needs: {
          drainage: 'well_draining' as const,
          texture: this.mapSoilTexture(plantDetails.soil),
        },
      },
    };
  }

  private mapWateringNeeds(watering: string): 'low' | 'moderate' | 'high' {
    const wateringLower = watering.toLowerCase();
    if (wateringLower.includes('frequent') || wateringLower.includes('daily')) {
      return 'high';
    } else if (wateringLower.includes('average') || wateringLower.includes('regular')) {
      return 'moderate';
    } else {
      return 'low';
    }
  }

  private mapSunNeeds(sunlight: string[]): Array<'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'> {
    return sunlight.map(sun => {
      const sunLower = sun.toLowerCase();
      if (sunLower.includes('full sun')) return 'full_sun';
      if (sunLower.includes('partial sun')) return 'partial_sun';
      if (sunLower.includes('partial shade')) return 'partial_shade';
      return 'full_shade';
    }) as Array<'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'>;
  }

  private mapSoilTexture(soil: string[]): Array<'clay' | 'loam' | 'sand' | 'silt'> {
    const textureMap: Array<'clay' | 'loam' | 'sand' | 'silt'> = [];
    
    soil.forEach(soilType => {
      const soilLower = soilType.toLowerCase();
      if (soilLower.includes('clay')) textureMap.push('clay');
      if (soilLower.includes('loam')) textureMap.push('loam');
      if (soilLower.includes('sand')) textureMap.push('sand');
      if (soilLower.includes('silt')) textureMap.push('silt');
    });

    return textureMap.length > 0 ? textureMap : ['loam'];
  }
}

export const plantAPI = new PlantAPIService(); 