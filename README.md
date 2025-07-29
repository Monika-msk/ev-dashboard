
# EV Corridor Dashboard

An interactive web dashboard built with React and Mapbox GL JS for visualizing Electric Vehicle corridor sites across India. This powerful tool enables exploration, analysis, and export of site and corridor data with an intuitive interface optimized for efficiency and user experience.

---

## Key Features

- **High-performance interactive map:** Powered by Mapbox GL JS to render detailed EV corridors and site markers with smooth zoom and pan.
- **Corridor & Site Visualization:** Clear route rendering and site pinpointing with custom markers and informative popups.
- **Dynamic Search & Filtering:** Search by corridor ID, name, or site attributes for quick data access.
- **Sidebar Navigation:** Intuitive sidebar for corridor selection and easy navigation of site clusters.
- **Exportable Data:** Export site data effortlessly to Excel (.xlsx) for offline analysis and reporting.
- **Full Data Table:** View complete site information in a searchable and filterable table overlay.
- **Responsive Design:** Optimized layout adapts across screen sizes for desktop and tablet use.
- **Map Style Toggle:** Switch between street and satellite views to suit user preference.
- **Performance Optimizations:** Handles route fetching and rendering efficiently with batch loading and caching strategies.

---

## Live Demo

Experience the fully functional dashboard deployed on GitHub Pages:  
[https://monika-msk.github.io/ev-dashboard/](https://monika-msk.github.io/ev-dashboard/)

---

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Monika-msk/ev-dashboard.git
   cd ev-dashboard
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

Access the app at [http://localhost:3000](http://localhost:3000).

---

## Deployment

To build and deploy to GitHub Pages:

```
npm run build
npm run deploy
```

Your updated site will be published automatically at the GitHub Pages URL.

---

## Technical Overview

- **React:** Functional components with hooks for state management and lifecycle.
- **Mapbox GL JS:** Advanced vector map rendering with route and marker layers.
- **Data Layer:** Dynamic loading of corridor and site data with API-driven routing geometry.
- **UX Enhancements:** Popup tooltips, search inputs, and responsive controls for seamless interaction.
- **Data Export:** Excel export via XLSX JS library for convenient reporting.
- **Code Structure:** Modular and maintainable architecture for extensibility.

---

## Project Structure

- `/src`: Source code for components, styles, and data
- `/public`: Static assets and HTML template
- `/build`: Production optimized build folder
- `.gitignore`: Lists untracked/ignored files including dependencies and build files

---




## Author

Monika S Kumar





