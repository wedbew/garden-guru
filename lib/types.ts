export type PlacementType = 'In-ground' | 'Container' | 'Raised Bed';

export type ContainerUnit = 'liters' | 'gallons' | 'cubic_feet';

export type WateringNeeds = 'low' | 'moderate' | 'high';

export type SunNeeds = 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade';

export type DrainageType = 'well_draining' | 'moisture_retaining' | 'waterlogged';

export type SoilTexture = 'clay' | 'loam' | 'sand' | 'silt';

export type PlantStatus = 'healthy' | 'stressed' | 'diseased' | 'dormant';

export type JournalEntryType = 'watering' | 'fertilizing' | 'pruning' | 'observation' | 'photo';

export type AssessmentType = 'pest' | 'disease' | 'nutrient_deficiency' | 'environmental_stress';

export type AssessmentStatus = 'identified' | 'treating' | 'resolved';

export interface ContainerDetails {
  material: string;
  volume: number;
  unit: ContainerUnit;
  is_self_watering: boolean;
}

export interface PlantPlacement {
  type: PlacementType;
  date_planted?: Date;
  date_acquired?: Date;
  container_details?: ContainerDetails;
}

export interface PlantIdentity {
  user_defined_name: string;
  common_name?: string;
  scientific_name?: string;
  aliases?: string[];
  cultivar?: string;
  api_references?: {
    perenual_id?: number;
    plantnet_id?: string;
  };
}

export interface SoilNeeds {
  ph_range?: {
    min: number;
    max: number;
  };
  drainage: DrainageType;
  texture: SoilTexture[];
}

export interface CareProfile {
  watering_needs: WateringNeeds;
  sun_needs: SunNeeds[];
  soil_needs: SoilNeeds;
  fertilization_notes?: string;
}

export interface JournalEntry {
  entry_id: string;
  timestamp: Date;
  type: JournalEntryType;
  notes?: string;
  photos: string[];
}

export interface PlantJournal {
  current_status: PlantStatus;
  entries: JournalEntry[];
}

export interface HealthAssessment {
  assessment_id: string;
  timestamp: Date;
  type: AssessmentType;
  identification: string;
  treatment_applied?: string;
  status: AssessmentStatus;
  photos: string[];
}

export interface PlantHealth {
  assessments: HealthAssessment[];
}

export interface Plant {
  id: string;
  area_id: string;
  identity: PlantIdentity;
  placement: PlantPlacement;
  care_profile: CareProfile;
  journal: PlantJournal;
  health: PlantHealth;
}

// Form data types for the wizard
export interface InitialPlantFormData {
  user_defined_name: string;
  placement_type: PlacementType;
  container_details?: {
    material: string;
    volume: number;
    unit: ContainerUnit;
    is_self_watering: boolean;
  };
  photo?: File;
} 