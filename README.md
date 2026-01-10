# Async Race SPA

Welcome to the **Async Race** project! This is a high-performance Single Page Application (SPA) designed to manage a radio-controlled car collection, simulate real-time racing, and track winner statistics.

## Project Overview

A customer has installed radio-controlled equipment with HTTP-compatible interfaces in his car collection. Our mission is to build a management dashboard to:

1.  Control car engines (Start/Stop).
2.  Organize drag-racing competitions.
3.  Track and visualize race results.

**Deadline:** We must launch within two weeks to beat the "The Fast and the Furious" company!

## Objectives

- **SPA Architecture:** Manage cars and races without page reloads.
- **Project Revival:** Reconstruct the UI based on the server mock and demo requirements.
- **Competitive Edge:** Deliver a smooth, high-performance animation and management system.

## Features

### Garage View

- **CRUD Operations:** Create, update, and delete cars with custom names and colors.
- **Color Picker:** Choose any color from an RGB palette with a real-time car preview.
- **Mass Generation:** A "Generate Cars" button that adds 100 random cars to the database instantly.
- **Pagination:** Clean navigation (7 cars per page) with state persistence.

### Racing & Animation

- **Engine Control:** Individual Start/Stop buttons for each car.
- **Real-time Race:** A "Race" button to start all cars on the current page simultaneously.
- **Dynamic Physics:** Animations adapt to the screen width (responsive down to 500px).
- **Winner Declaration:** Once a car finishes, the winner's name is displayed.
- **Reset:** Return all cars to the starting line with one click.

### Winners View

- **Statistics Table:** Displays car image, name, total wins, and the best time (seconds).
- **Sorting:** Sort data by the number of wins or the best time in ascending/descending order.
- **Pagination:** Manage large lists of winners efficiently.

## Technical Stack & Requirements

- **Language:** TypeScript (Strict mode: no `any`, no type assertions `as`, no non-null assertions `!`).
- **Frameworks:** **None.** (Pure TypeScript/JavaScript only).
- **Styling:** CSS / SASS Modules / Bootstrap (CSS only).
- **Bundler:** Vite / Webpack.
- **Code Quality:**
  - Follows **Airbnb JavaScript Style Guide**.
  - **ESLint** with Unicorn configuration.
  - Max function length: 40 lines.
  - No "magic numbers" or "magic strings".

## How to Run

1. **Clone the Server Mock:**
   ```bash
   git clone [link-to-server-repo]
   cd server-repo
   npm install
   npm start
   ```
