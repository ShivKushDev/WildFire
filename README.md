# WildFire - Interactive Wildfire Tracking Application

A modern web application for tracking and visualizing wildfire data using interactive maps and real-time route planning.

## Features

- 🗺️ Interactive Google Maps integration
- 🔥 Real-time wildfire tracking
- 📍 Route planning and navigation
- 🎨 Modern, responsive UI using shadcn/ui components
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Maps:** Google Maps API (@googlemaps/js-api-loader, @react-google-maps/api)
- **Backend/Database:** Supabase
- **State Management:** React Hook Form
- **Routing:** React Router v6
- **Component Documentation:** Storybook
- **Form Validation:** Zod
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or yarn
- Supabase account and project
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WildFire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_supabase_project_id
```

## Development

Start the development server:
```bash
npm run dev
```

Other available commands:
- `npm run build` - Create production build
- `npm run build-no-errors` - Build ignoring TypeScript errors
- `npm run preview` - Preview production build
- `npm run lint` - Lint the codebase
- `npm run types:supabase` - Generate Supabase TypeScript types

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── ...           # Feature-specific components
├── lib/               # Utility functions and API clients
├── stories/           # Storybook component documentation
└── types/             # TypeScript type definitions
```

### Key Components

- `InteractiveMap`: Main map component with Google Maps integration
- `RoutePanel`: Navigation and route planning interface
- `MapControls`: Map interaction controls
- `MapHeader`: Header component with map-related information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
