# Itinera
### Bespoke Journeys Crafted with Absolute Precision

Itinera is an intelligent travel orchestration platform engineered for discerning travelers and collaborative group expeditions. Built with a focus on relational data integrity, climate resilience, multi-currency financial precision, and editorial user experience design, Itinera transforms fragmented journey planning into a unified, seamless architectural workflow.

---

## Table of Contents
- [System Highlights](#system-highlights)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Core Functional Capabilities](#core-functional-capabilities)
- [Database Schema & Relational Integrity](#database-schema--relational-integrity)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation & Seeding](#installation--seeding)
  - [Running the Services](#running-the-services)
- [API Architecture & Route Specifications](#api-architecture--route-specifications)
- [Design Philosophy & Aesthetic Standards](#design-philosophy--aesthetic-standards)

---

## System Highlights

- **Relational Integrity by Design**: Strict third-normal-form (3NF) relational schema with enforced foreign keys, cascading rules, and ACID transaction boundaries. Zero static mock JSON.
- **Adaptive Climate Resilience (Rain Check)**: Real-time meteorological intelligence tracking precipitation risk and dynamically flagging outdoor activities with indoor contingency backups.
- **Multi-Member Debt Simplification**: Graph-based debt simplification algorithm minimizing the number of settlement transactions across multi-traveler circles.
- **Real-Time Multi-Currency Engine**: Live foreign exchange conversions with normalized base currency calculations for global purchasing.
- **Editorial Vector PDF Export**: Client-side vector-rendered travel itineraries and vouchers ready for offline execution.

---

## Architecture & Tech Stack

```
+-----------------------------------------------------------------------------+
|                             FRONTEND LAYER                                  |
|  React 18 (Vite)  |  Bootstrap 5 + SCSS  |  Lucide Icons  |  Framer Motion   |
|  Zustand / Query  |  Recharts Analytics  |  Swiper.js     |  jsPDF / Canvas  |
+-----------------------------------------------------------------------------+
                                       | RESTful HTTP / JWT
+-----------------------------------------------------------------------------+
|                             BACKEND LAYER                                   |
|  Node.js + Express.js  |  Zod Payload Validation  |  Centralized Middleware |
|  JWT & Bcrypt Security |  Open-Meteo Weather Service | FX Exchange Engine   |
+-----------------------------------------------------------------------------+
                                       | Relational Query Layer
+-----------------------------------------------------------------------------+
|                             DATABASE LAYER                                  |
|  PostgreSQL / SQLite with Strict Relational Constraints and Foreign Keys    |
|  Users | Trips | Collaborators | Days | Activities | Expenses | Splits     |
+-----------------------------------------------------------------------------+
```

### Technology Specifications

| Domain | Technology | Implementation Detail |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Vite) | Component-driven architecture with fast HMR and optimized asset bundling |
| **Styling & Layout** | Bootstrap 5 + SCSS | Custom theme tokens, burgundy and cream palette, zero glassmorphism |
| **Iconography** | Lucide React | Clean, geometric line iconography |
| **State & Data Fetching**| Zustand / TanStack Query | Reactive client state and cached asynchronous server synchronization |
| **Visual Analytics** | Recharts | Donut category distributions, budget burn-downs, and participant splits |
| **Backend Framework** | Node.js + Express | Layered MVC pattern with strict controller-service separation |
| **Schema Validation** | Zod | Runtime payload and parameter validation |
| **Security & Auth** | JWT + Bcrypt | Secure password hashing and stateless token-based authorization |
| **Database Engine** | PostgreSQL / SQLite | Relational schema with foreign key constraints, indexes, and migrations |

---

## Core Functional Capabilities

### 1. Day-Wise Itinerary Architect & Timeline
Construct multi-day journeys with structured time allocations, geographical locations, and activity categories. The interactive timeline provides a sequential chronological overview of every scheduled event.

### 2. Multi-Member Expense Split & Settlement
Log individual or group expenses incurred across any currency. The internal settlement engine calculates net balances per participant and outputs the minimum number of peer-to-peer transfers required to square all accounts.

### 3. Adaptive Climate Resilience ("Rain Check")
Every activity is categorized by weather sensitivity (Indoor vs. Outdoor). Real-time precipitation probability feeds trigger automatic contingency warnings and surface indoor backup recommendations from the destination catalog.

### 4. Multi-Currency Purchasing & Live FX
Supports real-time conversion rates across international currencies. Expenses incurred in foreign currencies are dynamically normalized to the trip's base currency for consistent budget auditing.

### 5. Visual City & Activity Showcase
Curated destination directories featuring high-resolution photo slideshows, category filters (Culture, Gastronomy, Adventure, Leisure), estimated durations, and cost metrics.

### 6. Financial & Budget Analytics Dashboard
Visualizes target budget versus actual expenditure in real time. Dynamic charts highlight category-wise spending ratios, individual member burdens, and remaining liquidity.

### 7. Editorial PDF Export & Public Itinerary Sharing
Generates clean, print-ready travel vouchers with complete day schedules, contact details, and route notes. Shareable tokens enable read-only web access for external collaborators.

---

## Database Schema & Relational Integrity

The data layer is structured to guarantee relational integrity, eliminating duplicate data and preventing orphaned records through foreign key constraints.

```mermaid
erDiagram
    USERS ||--o{ TRIPS : creates
    USERS ||--o{ TRIP_COLLABORATORS : participates
    TRIPS ||--o{ TRIP_COLLABORATORS : includes
    TRIPS ||--o{ ITINERARY_DAYS : contains
    ITINERARY_DAYS ||--o{ ACTIVITIES : schedules
    CITIES ||--o{ ACTIVITIES : hosts
    CITIES ||--o{ DESTINATION_PHOTOS : contains
    TRIPS ||--o{ EXPENSES : incurs
    USERS ||--o{ EXPENSES : pays
    EXPENSES ||--o{ EXPENSE_SPLITS : divides
    USERS ||--o{ EXPENSE_SPLITS : owes

    USERS {
        uuid id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar base_currency
        timestamp created_at
    }

    TRIPS {
        uuid id PK
        uuid owner_id FK
        varchar title
        varchar destination
        date start_date
        date end_date
        decimal total_budget
        varchar currency
        varchar share_token UK
        timestamp created_at
    }

    TRIP_COLLABORATORS {
        uuid id PK
        uuid trip_id FK
        uuid user_id FK
        varchar role
        timestamp joined_at
    }

    ITINERARY_DAYS {
        uuid id PK
        uuid trip_id FK
        int day_number
        date date
        text notes
    }

    ACTIVITIES {
        uuid id PK
        uuid day_id FK
        uuid city_id FK
        varchar title
        varchar category
        time start_time
        time end_time
        decimal estimated_cost
        varchar weather_sensitivity
    }

    CITIES {
        uuid id PK
        varchar name
        varchar country
        decimal latitude
        decimal longitude
    }

    DESTINATION_PHOTOS {
        uuid id PK
        uuid city_id FK
        varchar image_url
        varchar caption
    }

    EXPENSES {
        uuid id PK
        uuid trip_id FK
        uuid paid_by_user_id FK
        varchar title
        decimal amount
        varchar currency
        decimal exchange_rate
        varchar category
        timestamp created_at
    }

    EXPENSE_SPLITS {
        uuid id PK
        uuid expense_id FK
        uuid user_id FK
        decimal split_amount
        boolean is_settled
    }
```

---

## Directory Structure

```
odoo-2026/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets and branding
│   ├── src/
│   │   ├── assets/             # Images, vectors, and font declarations
│   │   ├── components/         # Modular UI components
│   │   │   ├── common/         # Buttons, Modals, Navbar, Sidebar, Loaders
│   │   │   ├── itinerary/      # Timeline, DayCard, ActivitySlot
│   │   │   ├── expenses/       # SplitMatrix, AddExpenseModal, BalanceSheet
│   │   │   ├── weather/        # RainCheckBadge, ForecastModal
│   │   │   └── analytics/      # BudgetDonut, SpendBarChart
│   │   ├── context/            # Global context providers (Auth, Currency)
│   │   ├── hooks/              # Custom hooks (useWeather, useCurrency)
│   │   ├── pages/              # Primary route views
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TripBuilderPage.jsx
│   │   │   ├── TripDetailsPage.jsx
│   │   │   ├── CatalogPage.jsx
│   │   │   └── SharedTripPage.jsx
│   │   ├── services/           # Axios HTTP client and API wrappers
│   │   ├── styles/             # SCSS modules and theme variable overrides
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database initialization and environment constants
│   │   ├── controllers/        # Request and response orchestrators
│   │   │   ├── authController.js
│   │   │   ├── tripController.js
│   │   │   ├── itineraryController.js
│   │   │   ├── expenseController.js
│   │   │   └── catalogController.js
│   │   ├── middlewares/        # Authentication, Zod validation, Error handlers
│   │   ├── models/             # Relational schemas, migrations, and queries
│   │   ├── routes/             # REST endpoint definitions
│   │   ├── services/           # Business logic (Split algorithm, FX, Weather)
│   │   ├── utils/              # Seed scripts and helper utilities
│   │   └── app.js              # Express app configuration
│   ├── package.json
│   └── server.js               # HTTP listener initialization
│
├── docs/                       # Specifications and strategy records
│   ├── dayplan.md
│   └── odoo instructions keywords.txt
├── feature_list.md             # Functional tracking index
├── product_design_document.md  # Aesthetic specifications and design rules
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL (or local SQLite)

### Environment Configuration

#### Server Configuration (`server/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/itinera_db
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

#### Client Configuration (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Installation & Seeding

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shlok377/odoo-2026.git
   cd odoo-2026
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Run Database Migrations & Seeds**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Services

1. **Start the Backend Service**:
   ```bash
   cd server
   npm run dev
   ```
   The backend API will be available at `http://localhost:5000`.

2. **Start the Frontend Application**:
   ```bash
   cd client
   npm run dev
   ```
   The web application will be accessible at `http://localhost:5173`.

---

## API Architecture & Route Specifications

All endpoints return structured JSON payloads with standard HTTP status codes and unified error formats.

### Authentication
- `POST /api/auth/register` - Create user account with preferred currency
- `POST /api/auth/login` - Authenticate credentials and return JWT bearer token
- `GET /api/auth/me` - Retrieve authenticated user profile

### Trip Orchestration
- `GET /api/trips` - List all trips associated with the authenticated user
- `POST /api/trips` - Create a new trip with destination, dates, and budget
- `GET /api/trips/:id` - Fetch comprehensive trip data including days, expenses, and members
- `PUT /api/trips/:id` - Update trip metadata
- `DELETE /api/trips/:id` - Soft-delete trip and cascade dependencies
- `GET /api/trips/share/:token` - Public read-only trip access

### Itinerary & Activities
- `POST /api/trips/:id/days` - Append an itinerary day
- `POST /api/days/:dayId/activities` - Schedule a new activity with weather profile
- `PUT /api/activities/:id` - Update activity timing, location, or cost
- `DELETE /api/activities/:id` - Remove activity from itinerary

### Expenses & Split Engine
- `POST /api/trips/:id/expenses` - Record a shared or single expense with FX rate
- `GET /api/trips/:id/balances` - Calculate net balances and simplified settlements
- `PUT /api/splits/:id/settle` - Mark an individual participant debt as settled

### Catalog & Meteorological Data
- `GET /api/catalog/cities` - List supported destinations with coordinates
- `GET /api/catalog/cities/:id/activities` - Search curated activities with photo arrays
- `GET /api/weather/forecast` - Fetch live 7-day weather predictions by latitude/longitude

---

## Design Philosophy & Aesthetic Standards

Itinera avoids generic interface paradigms in favor of an intentional, editorial aesthetic:

- **Color Palette**: 
  - Burgundy Base: `#591d26`
  - Cream Background / Surface: `#f5efe9`
  - Structural Black: `#1a1a1a`
- **Typography**: 
  - Display & Headings: *Neuton* (Serif elegance)
  - Interface & Numerics: Clean, high-legibility Sans-Serif
- **Micro-Interactions**: Subtle elevation changes on cursor hover (`translateY(-2px)`), crisp 1px solid borders, and zero glassmorphism to preserve contrast and visual discipline.

---

## License

This project is developed for the **Odoo Hackathon 2026**. All rights reserved.
