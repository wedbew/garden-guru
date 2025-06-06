Initial Prompt:

I am developing a Next.js application called 'Garden Guru', and I need to create a multi-step wizard to onboard users by gathering information about their gardens and plants. [cite_start]The overall goal is to make this process as frictionless as possible, especially for novice users, as outlined in the "Garden Guru App Development Plan".   

For the first step of this wizard, I want to focus exclusively on adding an initial plant. The form should be dynamic and based on the provided plant and garden_area schemas. [cite_start]For example, if a user specifies a plant is in a "Container," the form should dynamically show fields to input container details.   

Given the attached package.json, which indicates the use of Next.js, React, Prisma, and UI libraries like Radix UI (which is used by shadcn/ui), please generate the code for the first component in this wizard.

Requirements for the first step:

Component Name: InitialPlantStep.tsx
Functionality:
It should be the first of a multi-step form process.
Capture the most essential information for creating a single plant record. [cite_start]Based on the user personas, a novice like Ava needs a very simple start. Therefore, let's prioritize these fields:   
identity.user_defined_name: The user's name for the plant (e.g., "Living Room Fiddle Leaf").
placement.type: Where the plant is located (e.g., 'In-ground', 'Container', 'Raised Bed').
Dynamically display placement.container_details only if placement.type is 'Container'.
Include a prominent, intuitive way for the user to take or upload a photo of their plant. [cite_start]This will be used later for AI-powered identification, a key feature for users like Ava.   
Technical Implementation:
Use React hooks for state management (useState).
Use TypeScript for type safety, leveraging the provided schemas.
Build the UI using shadcn/ui components (e.g., Card, Label, Input, Select, Button). The package.json confirms that the necessary dependencies (@radix-ui/..., lucide-react, clsx, tailwind-merge) are available.
The component should be structured to easily pass its state to a parent wizard component.


here is the plan schema:

{
  "plant": {
    "id": "uuid",
    "area_id": "uuid",
    "identity": {
      "user_defined_name": "string",
      "common_name": "string",
      "scientific_name": "string",
      "aliases": [
        "string"
      ],
      "cultivar": "string",
      "api_references": {
        "perenual_id": "integer",
        "plantnet_id": "string"
      }
    },
    "placement": {
      "type": "enum",
      "date_planted": "date",
      "date_acquired": "date",
      "container_details": {
        "material": "string",
        "volume": "float",
        "unit": "enum",
        "is_self_watering": "boolean"
      }
    },
    "care_profile": {
      "watering_needs": "enum",
      "sun_needs": [
        "enum"
      ],
      "soil_needs": {
        "ph_range": {
          "min": "float",
          "max": "float"
        },
        "drainage": "enum",
        "texture": [
          "enum"
        ]
      },
      "fertilization_notes": "text"
    },
    "journal": {
      "current_status": "enum",
      "entries": [
        {
          "entry_id": "uuid",
          "timestamp": "timestamp",
          "type": "enum",
          "notes": "text",
          "photos": [
            "url"
          ]
        }
      ]
    },
    "health": {
      "assessments": [
        {
          "assessment_id": "uuid",
          "timestamp": "timestamp",
          "type": "enum",
          "identification": "string",
          "treatment_applied": "text",
          "status": "enum",
          "photos": [
            "url"
          ]
        }
      ]
    }
  }
}

Please use plant api to gather info about the plants

here is the api key: sk-1hMq68431228a918610875

please save data fot database based on this mongodb+srv://marcinbawolski:6UsdBSuMIegkui99@gardenguru.fscb82g.mongodb.net/
