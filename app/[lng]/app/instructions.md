### Garden Guru Application Specification


PLease take  a look on main for for sytles insipration: app/[lng]/page.tsx

and please take look types.ts: lib/types.ts


## 1. Overview
Garden Guru is a web application designed to help users manage their personal gardens by tracking plant information and generating daily care tasks. The application features a responsive, single-page dashboard interface with multiple views for managing plants, tracking tasks, and viewing task history.
## 2. Technical Stack
- **Frontend Framework**: Next.js (App Router)
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS
- **State Management**: React useState hooks for local state
- **Icons**: Lucide React icons
- **Image Handling**: Next.js Image component
## 3. Screen Specifications
### 3.1 Dashboard Layout (All Screens)
The application uses a consistent layout across all screens:
- **Left Sidebar**:
- Logo display
- Application name and tagline
- Navigation menu with three options: Daily Tasks, My Garden, Task History
- Active menu item highlighted with green background
- **Main Content Area**:
- Changes based on selected navigation item
- Consistent padding and spacing
- Responsive design that adapts to different screen sizes
### 3.2 Daily Tasks Screen
**Purpose**: Display and manage tasks due today and overdue tasks.
**Components**:
- Header with date display
- "Generate Tasks" button
- Overdue tasks card (conditional display)
- Today's tasks card
- Quick stats card
**Functionality**:
- View tasks due today
- View overdue tasks
- Mark tasks as complete
- Generate watering tasks based on plant watering frequency
- View quick statistics about plants and tasks
**User Interactions**:
- Click "Complete" button to mark a task as done
- Click "Generate Tasks" to create new watering tasks based on plant schedules
- Navigate to other screens via sidebar
### 3.3 My Garden Screen
**Purpose**: Manage plants and garden location information.
**Components**:
- Header with section title
- "Add Plant" button
- Garden location card with input field
- Plant list with individual plant items
- Plant form dialog for adding/editing plants
**Functionality**:
- Add new plants with details (name, type, planting date, watering frequency, care tips)
- Edit existing plant information
- Delete plants
- Set and save garden location
**User Interactions**:
- Click "Add Plant" to open plant form dialog
- Click edit icon on a plant to modify its details
- Click delete icon to remove a plant
- Enter location and click "Save Location" to store garden location
- Navigate to other screens via sidebar
### 3.4 Task History Screen
**Purpose**: View completed tasks with filtering options.
**Components**:
- Header with section title
- Filters card with dropdown selectors
- Plant-grouped task history cards
- Summary statistics card
**Functionality**:
- View all completed tasks grouped by plant
- Filter tasks by plant
- Filter tasks by task type (watering, fertilizing, pruning, repotting, other)
- View summary statistics of completed tasks
**User Interactions**:
- Select filters from dropdown menus to refine task history view
- Navigate to other screens via sidebar
## 4. Component Specifications
### 4.1 Navigation Components
#### 4.1.1 Sidebar
- **Purpose**: Provide navigation and branding
- **Props**: currentView, setCurrentView
- **Functionality**:
- Display logo and app name
- Show navigation menu items
- Highlight active menu item
- Handle navigation between views
### 4.2 Plant Management Components
#### 4.2.1 GardenManagement
- **Purpose**: Manage plants and garden location
- **Props**: plants, setPlants, gardenLocation, setGardenLocation
- **Functionality**:
- Display list of plants
- Add/edit/delete plants
- Set and save garden location
#### 4.2.2 Plant Form Dialog
- **Purpose**: Add or edit plant details
- **State**: formData (name, type, plantingDate, wateringFrequency, careTips)
- **Functionality**:
- Collect plant information
- Validate inputs
- Submit new or updated plant data
### 4.3 Task Management Components
#### 4.3.1 DailyTasks
- **Purpose**: Display and manage current tasks
- **Props**: plants, tasks, setTasks
- **Functionality**:
- Show today's tasks
- Show overdue tasks
- Mark tasks as complete
- Generate watering tasks
#### 4.3.2 TaskHistory
- **Purpose**: Display completed tasks with filtering
- **Props**: plants, tasks
- **State**: selectedPlant, selectedTaskType
- **Functionality**:
- Group completed tasks by plant
- Filter tasks by plant and task type
- Display task completion statistics
### 4.4 UI Components
#### 4.4.1 Card Components
- **Purpose**: Consistent container styling
- **Variants**: Standard, with header, with title
#### 4.4.2 Button Components
- **Purpose**: User interaction elements
- **Variants**: Primary (green), Outline, Ghost, Icon
#### 4.4.3 Form Components
- **Purpose**: Data input elements
- **Types**: Input, Select, Textarea
## 5. Functionality Specifications
### 5.1 Plant Management
#### 5.1.1 Add Plant
- **Description**: Add a new plant to the garden
- **Implementation**:
- Open dialog form
- Collect plant details (name, type, planting date, watering frequency, care tips)
- Generate placeholder image based on plant name
- Add to plants state array
- Close dialog
#### 5.1.2 Edit Plant
- **Description**: Modify existing plant details
- **Implementation**:
- Open dialog form with pre-filled data
- Update plant details
- Save changes to plants state array
- Close dialog
#### 5.1.3 Delete Plant
- **Description**: Remove a plant from the garden
- **Implementation**:
- Filter plant from plants state array
- Update UI to reflect removal
#### 5.1.4 Save Garden Location
- **Description**: Store the garden's geographic location
- **Implementation**:
- Input location text
- Save to gardenLocation state
- Show confirmation of saved location
### 5.2 Task Management
#### 5.2.1 Generate Tasks
- **Description**: Create watering tasks based on plant schedules
- **Implementation**:
- Check last watering date for each plant
- Calculate next watering date based on frequency
- Create new task if due date is today or past
- Add to tasks state array
#### 5.2.2 Complete Task
- **Description**: Mark a task as completed
- **Implementation**:
- Update task's completionDate to current date
- Move task from active to completed state
- Update UI to reflect completion
#### 5.2.3 Filter Task History
- **Description**: Filter completed tasks by plant or task type
- **Implementation**:
- Select filter criteria from dropdowns
- Apply filters to task display
- Group filtered tasks by plant
## 6. Data Models
### 6.1 Plant
```typescript
type Plant = {
  id: string
  name: string
  picture: string
  type: string
  plantingDate: string
  wateringFrequency: number // days
  careTips: string
}
```
### 6.2 Task
```typescript
type Task = {
  id: string
  taskName: string
  completionDate: string | null
  plantId: string
  dueDate: string
  taskType: "watering" | "fertilizing" | "pruning" | "repotting" | "other"
}
```
### 6.3 ViewType
```typescript
type ViewType = "plants" | "daily-tasks" | "task-history"
```
## 7. Design System
### 7.1 Color Palette
- **Primary Colors**:
- Brand Green (various shades for accents and success states)
- Brand Gray (various shades for text, backgrounds, and borders)
- **Accent Colors**:
- Blue (for watering tasks)
- Yellow (for fertilizing tasks)
- Purple (for repotting tasks)
- Red (for warnings and overdue items)
### 7.2 Typography
- **Headings**: Font-light, larger sizes (3xl for main headings)
- **Body Text**: Regular weight, brand-gray-500 for secondary text
- **Buttons**: Regular weight, consistent sizing
### 7.3 Spacing
- Consistent 8-point grid system (p-8, gap-4, etc.)
- Vertical spacing between sections: space-y-8
- Card padding: p-4 to p-6
### 7.4 Shadows and Effects
- Subtle shadows for cards: shadow-sm
- Hover effects on interactive elements
- Rounded corners for cards and buttons
## 8. Future Enhancement Opportunities
1. **Data Persistence**: Implement database storage for plants and tasks
2. **User Authentication**: Add user accounts and authentication
3. **Weather Integration**: Use garden location to fetch weather data and adjust care recommendations
4. **Plant Image Upload**: Allow users to upload their own plant photos
5. **Notifications**: Add reminders for upcoming tasks
6. **Mobile App**: Develop native mobile applications
7. **Social Features**: Allow sharing of garden progress and tips
8. **Plant Recognition**: Implement AI-based plant identification
9. **Dark Mode**: Add dark theme support
10. **Export/Import**: Allow exporting and importing garden data
This specification provides a comprehensive overview of the Garden Guru application's current implementation and can serve as a foundation for future development and enhancement.