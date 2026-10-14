# EventHub - Premium Full-Stack Event Management & Registration Platform

## 1. Project Overview & Architecture
EventHub is an enterprise-grade full-stack event discovery, management, and registration web application. It combines a robust **Java Spring Boot** backend, **Spring Security** with **stateless JWT authentication**, **MySQL 8** relational persistence, and a modern **React 18 Single-Page Application (SPA)** along with standalone HTML/CSS/JS interfaces organized cleanly inside the `frontend/` directory.

---

## 2. Technology Stack

### Frontend Architecture (`frontend/`)
- **React SPA (`frontend/`):**
  - **Framework:** React 18 (Functional Components, Hooks)
  - **Build Tool & Dev Server:** Vite 5
  - **Routing:** React Router DOM 6
  - **State Management:** React Context API (`AuthContext`, `NotificationContext`)
  - **HTTP Client:** Centralized Fetch API service with authorization interceptor
  - **Utilities:** Reusable date, time, currency, and formatting helpers in `src/utils/`
  - **UI / Styling:** Lucide React icons, Custom CSS Design System (CSS Custom Properties, Responsive Grid, Modals, Toasts)

### Backend Architecture (`backend/`)
- **Framework:** Java 17, Spring Boot
- **Security:** Spring Security with stateless JSON Web Token (JWT) authentication & RBAC (`USER` vs `ADMIN`)
- **Data & Persistence:** Spring Data JPA, Hibernate ORM
- **Database:** MySQL 8
- **Build Tool:** Maven with Maven Wrapper (`mvnw`, `mvnw.cmd`)

---

## 3. Project Structure

The project has a clean root structure with `frontend/`, `backend/`, and `README.md`:

```text
EventHub/
│
├── frontend/                             # React 18 SPA (Vite)
│   ├── package.json                      # Frontend dependencies & scripts
│   ├── package-lock.json                 # Lockfile for reproducible builds
│   ├── vite.config.js                    # Vite configuration with backend API proxy
│   ├── index.html                        # Vite HTML entry point
│   ├── .env                              # API base URL configuration
│   ├── .env.example                      # Environment template
│   ├── public/                           # Public assets
│   ├── dist/                             # Compiled production bundle
│   └── src/                              # React application source code
│       ├── main.jsx                      # React DOM entry
│       ├── App.jsx                       # Providers & top-level router
│       ├── styles/
│       │   └── index.css                 # Elevated React design system
│       ├── utils/
│       │   ├── formatters.js             # Reusable date, time, currency formatters
│       │   └── index.js                  # Centralized utility exports
│       ├── context/
│       │   ├── AuthContext.jsx           # User, token, role & session state
│       │   └── NotificationContext.jsx   # Toast notification provider
│       ├── hooks/
│       │   ├── useAuth.js                # Authentication hook
│       │   └── useNotification.js        # Toast notifications hook
│       ├── services/
│       │   ├── api.js                    # Centralized Fetch API client
│       │   ├── authService.js            # Login, register & profile calls
│       │   ├── eventService.js           # Event catalog & admin CRUD calls
│       │   ├── categoryService.js        # Category management calls
│       │   ├── registrationService.js    # Bookings & cancellations
│       │   └── dashboardService.js       # Admin analytics endpoints
│       ├── components/
│       │   ├── Navbar.jsx                # Dynamic responsive navigation
│       │   ├── Footer.jsx                # Platform footer
│       │   ├── EventCard.jsx             # Reusable card with seat badges
│       │   ├── Modal.jsx                 # Accessible dialog modal
│       │   ├── LoadingSpinner.jsx        # Loading indicator
│       │   ├── EmptyState.jsx            # Reusable empty data placeholder
│       │   └── ToastContainer.jsx        # Stacked toast notifications
│       ├── layouts/
│       │   └── RootLayout.jsx            # App shell layout
│       ├── routes/
│       │   ├── AppRoutes.jsx             # Route map
│       │   └── ProtectedRoute.jsx        # Role-based & auth guard
│       └── pages/
│           ├── HomePage.jsx              # Hero banner & featured events
│           ├── EventsPage.jsx            # Search & category filter catalog
│           ├── EventDetailPage.jsx       # Event view & ticket booking
│           ├── LoginPage.jsx             # Sign-in form & redirect handler
│           ├── RegisterPage.jsx          # Signup form with auto-login
│           ├── MyRegistrationsPage.jsx   # Ticket booking history
│           ├── ProfilePage.jsx           # User profile editor
│           ├── NotFoundPage.jsx          # 404 handler
│           └── admin/
│               ├── AdminDashboardPage.jsx  # Metrics & bookings feed
│               ├── ManageEventsPage.jsx    # Event CRUD & capacity manager
│               └── ManageCategoriesPage.jsx# Category manager
│
├── backend/                              # Complete Spring Boot backend
│   ├── pom.xml                           # Spring Boot Maven configuration
│   ├── mvnw / mvnw.cmd                   # Maven wrapper
│   └── src/
│       ├── main/java/com/eventhub/
│       │   ├── config/                   # SecurityConfig, CorsConfig, DataSeeder
│       │   ├── controller/               # REST API endpoints
│       │   ├── dto/                      # Data Transfer Objects
│       │   ├── entity/                   # JPA Entities (User, Event, Category, Registration)
│       │   ├── exception/                # GlobalExceptionHandler
│       │   ├── repository/               # Spring Data JPA interfaces
│       │   ├── security/                 # JwtAuthFilter, JwtService, UserDetails
│       │   └── service/                  # Business logic services
│       └── main/resources/
│           ├── application.properties    # MySQL, server port & JWT secret
│           └── static/                   # Static resources served by Spring
│
└── README.md                             # Complete project documentation
```

---

## 4. Key Workflows & Features

1. **Event Discovery & Filtering:**
   - Search by title, city, or venue.
   - Filter dynamically by category (Technology, Workshop, Business, Conference, etc.).
   - Real-time seat calculation: displays available spots and detects sold-out status.
2. **Stateless JWT Authentication:**
   - Login and Register return a JWT token with user metadata.
   - Token is attached via `Authorization: Bearer <token>` in the centralized `api.js` client.
   - Front-end sessions persist through page refreshes.
   - 401 unauthorized errors trigger automated token clearing and navigation guards.
3. **Attendee Reservations:**
   - One-click seat booking with atomic availability updates.
   - Attendees can inspect active bookings in "My Registrations" and cancel tickets anytime.
4. **Admin Dashboard & CRUD:**
   - Protected by `hasRole('ADMIN')` in Spring Security and frontend `ProtectedRoute`.
   - Real-time counter metrics for Total Users, Total Events, and Total Registrations.
   - Full CRUD over Events (title, category, date, start/end time, venue, description, image).
   - Full CRUD over Categories with foreign-key integrity protection.

---

## 5. Development Setup & Execution

### Prerequisites
- Java 17+
- Node.js 18+ (tested with v24)
- MySQL 8+ running on port `3306`

### Database Setup
1. Create the MySQL database:
   ```sql
   CREATE DATABASE eventhub;
   ```
2. Verify credentials in `backend/src/main/resources/application.properties` (default: `root` / `root`).

---

### Step 1: Start the Spring Boot Backend

Open a terminal in the `backend/` directory:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

- The server will start on **`http://localhost:8081`**.
- Default event categories (`Technology`, `Business`, `Workshop`, etc.) are seeded automatically on first launch.

---

### Step 2: Start the React Frontend

Open a new terminal in the `frontend/` (or `frontend/react/`) directory:

```bash
cd frontend
npm install
npm run dev
```

- The React development server will start on **`http://localhost:5173`**.
- Requests to `/api/*` are automatically proxied to `http://localhost:8081` via Vite's proxy configuration in `vite.config.js`.

---

## 6. Production Build & Deployment

### React Production Bundle
To build the optimized static production bundle:
```bash
cd frontend/react
npm run build
```
The output is generated into `frontend/react/dist/`.

### Deployment Options:
1. **Independent Frontend Server (Recommended for micro-frontends):**
   - Host `frontend/react/dist/` on Vercel, Netlify, Nginx, or AWS S3/CloudFront.
   - Configure `VITE_API_BASE_URL` to point to the backend domain.
   - Spring Boot's `CorsConfig` is pre-configured to allow CORS requests with credentials.
2. **Spring Boot Static Hosting:**
   - Copy the contents of `frontend/react/dist/` to `backend/src/main/resources/static/`.
   - Spring Boot will serve the React application directly on `http://localhost:8081`.

---

## 7. Verification & Testing

Both build chains have been compiled and verified:
1. **Maven Backend Build:**
   ```bash
   cd backend
   .\mvnw.cmd test-compile
   # Result: BUILD SUCCESS
   ```
2. **React Production Build:**
   ```bash
   cd frontend/react
   npm run build
   # Result: ✓ built in 33.88s (0 errors, 0 warnings)
   ```
