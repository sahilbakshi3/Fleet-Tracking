# 🚛 Fleet Tracking System

A real-time fleet tracking dashboard built with **React**, **WebSockets**, and **Leaflet.js** — simulating live vehicle location updates on an interactive map with vehicle status panels, route history, and fleet-wide analytics.

🔗 **Live Demo:** [fleet-tracking-beige.vercel.app](https://fleet-tracking-beige.vercel.app)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Key Implementation Details](#key-implementation-details)
- [Screenshots](#screenshots)
- [Author](#author)

---

## Overview

Fleet Tracking System is a frontend application that demonstrates real-time data streaming, interactive map rendering, and complex state management in React. Vehicles broadcast location updates over a WebSocket connection; the dashboard consumes those updates to keep map markers, status panels, and analytics in sync without page refresh.

This project was built to explore production-relevant frontend engineering problems: handling high-frequency data streams efficiently, managing map lifecycle inside React's render cycle, and building an intuitive operator-facing UI for monitoring vehicle fleets.

---

## Features

- **Live Map View** — Interactive Leaflet map with per-vehicle markers updating in real-time as location data streams in
- **Vehicle Status Panel** — Sidebar listing all vehicles with their current speed, status (moving / idle / offline), and last-seen timestamp
- **Route History** — Polyline trails showing the path each vehicle has traveled in the current session
- **Fleet Analytics** — Summary stats: total vehicles, active count, idle count, average speed across the fleet
- **Vehicle Selection** — Click any vehicle card or map marker to focus the map and highlight that vehicle's data
- **Status Indicators** — Color-coded badges (green = moving, yellow = idle, red = offline) for instant visual parsing
- **Responsive Layout** — Sidebar + map layout adapts cleanly across screen sizes

---

## Tech Stack

| Technology | Role |
|---|---|
| **React 19** | UI framework, component state management |
| **Create React App** | Build tooling, dev server |
| **Leaflet.js** | Interactive map rendering |
| **WebSockets** | Real-time vehicle location streaming |
| **Lucide React** | Icon library |
| **CSS3** | Custom styling, layout, animations |
| **Vercel** | Deployment |

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     React App                        │
│                                                      │
│  ┌─────────────────┐     ┌──────────────────────┐   │
│  │  WebSocket Hook │────▶│   Fleet State (useState│   │
│  │  (useFleet /    │     │   / useReducer)       │   │
│  │   useWebSocket) │     └──────────┬───────────┘   │
│  └─────────────────┘               │                │
│           ▲                        ▼                │
│           │          ┌─────────────────────────┐   │
│  Simulated│          │     Component Tree      │   │
│  WS Server│          │  ┌──────────┐ ┌───────┐ │   │
│  or Mock  │          │  │MapView   │ │Sidebar│ │   │
│  Data Feed│          │  │(Leaflet) │ │Panel  │ │   │
│           │          │  └──────────┘ └───────┘ │   │
└───────────┼──────────└─────────────────────────┘───┘
            │
     Vehicle Location
       Updates (WS)
```

The app uses a custom hook to manage the WebSocket connection lifecycle and pipe incoming location events into React state. Leaflet map instances are managed via `useRef` to avoid remounting on every render — a critical pattern when working with imperative map libraries inside declarative frameworks.

---

## Project Structure

```
Fleet-Tracking/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Map/              # Leaflet map container, marker management
│   │   ├── Sidebar/          # Vehicle list, status cards
│   │   ├── VehicleCard/      # Individual vehicle status row
│   │   └── Analytics/        # Fleet summary stats bar
│   ├── hooks/
│   │   ├── useWebSocket.js   # WS connection, reconnect logic
│   │   └── useFleet.js       # Vehicle state aggregation
│   ├── utils/
│   │   ├── mockData.js       # Simulated vehicle feed for demo
│   │   └── helpers.js        # Speed/status calculation utilities
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .gitignore
├── package.json
├── text.drawio               # System design / architecture diagram
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 16
- npm >= 8

### Installation

```bash
# Clone the repository
git clone https://github.com/sahilbakshi3/Fleet-Tracking.git

# Navigate into the project
cd Fleet-Tracking

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output is in the `build/` directory, ready for static hosting.

---

## Key Implementation Details

### WebSocket Integration

The custom `useWebSocket` hook handles connection setup, teardown on unmount, and reconnection on unexpected drops. Incoming messages are parsed and dispatched to update individual vehicle entries in fleet state — only the changed vehicle re-renders via keyed components.

```js
// Pseudocode — key pattern
const { vehicles, connected } = useFleet(WS_URL);
```

### Leaflet Inside React

Leaflet is an imperative library. Mounting it naively inside React causes duplicate map instances on re-renders. The solution is to store the map instance in a `useRef`, initialize it once in `useEffect` with an empty dep array, and update markers imperatively via `leafletInstance.current` — never through React state.

```js
const mapRef = useRef(null);

useEffect(() => {
  mapRef.current = L.map('map-container').setView([20.5937, 78.9629], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
  return () => mapRef.current.remove(); // cleanup on unmount
}, []); // run once only
```

### Real-Time Marker Updates

Rather than destroying and recreating markers on each position update, the app keeps a `markersRef` map keyed by vehicle ID. On each incoming update, only that vehicle's marker position is updated via `.setLatLng()` — keeping the DOM mutation surface minimal.

### Mock Data Simulation

For the live demo, vehicle positions are simulated using a `setInterval`-based feed that generates realistic lat/lng deltas to mimic vehicles moving along routes. This allows the full real-time UX to work without a deployed backend.

---

## Screenshots

> Live map with vehicle markers and route trails:  
> [fleet-tracking-beige.vercel.app](https://fleet-tracking-beige.vercel.app)

The system design diagram (`text.drawio`) in the repo root documents the data flow architecture and component relationships.

---

## Author

**Sahil Bakshi**
Frontend Engineer · React · TypeScript · JavaScript

- GitHub: [@sahilbakshi3](https://github.com/sahilbakshi3)
- Live Demo: [fleet-tracking-beige.vercel.app](https://fleet-tracking-beige.vercel.app)
- Machine Coding Practice: [sahilbakshi3/Machine-Coding](https://github.com/sahilbakshi3/Machine-Coding)
