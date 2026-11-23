# Glucode Task Manager

A full-stack task management application developed as part of the Glucode Web Frontend Engineer technical assessment.

The application allows users to create, complete, and delete tasks while displaying current weather information, including temperature, weather conditions, sunrise, and sunset.

## Tech Stack

### Frontend
- Angular 20
- TypeScript
- SCSS
- Angular Signals
- Responsive design

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- RESTful APIs

### Database
- PostgreSQL 16
- Docker

### External API
- WeatherAPI.com

## Features

- Create tasks with a title and description
- View pending and completed tasks in separate columns
- Mark tasks as completed
- Delete tasks
- Persist tasks in PostgreSQL
- Display current weather information
- Retrieve weather using browser geolocation with Johannesburg as a fallback
- Responsive desktop and mobile layout
- Automatic light and dark themes based on system preferences

## Project Structure

```text
glucode-task-manager/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── angular.json
│   └── package.json
└── README.md
```

## Prerequisites

- Java 21
- Maven
- Node.js and npm
- Docker
- WeatherAPI.com API key

## Database Setup

Start the PostgreSQL Docker container:

```powershell
docker start glucode-postgres-5433
```

The local development configuration uses:

- Database: `glucode_tasks`
- Username: `glucode`
- Port: `5433`

If the container does not already exist, create a PostgreSQL 16 container with these settings and a locally chosen password.

## Backend Setup

Navigate to the backend:

```powershell
cd backend
```

Configure the required environment variables in PowerShell:

```powershell
$env:DB_PASSWORD = (Read-Host "Database password")
$env:WEATHER_API_KEY = (Read-Host "WeatherAPI key").Trim()
```

Start Spring Boot:

```powershell
mvn spring-boot:run
```

The backend runs at:

http://localhost:8080

## Frontend Setup

Open a separate terminal:

```powershell
cd frontend
npm install
npm start
```

The Angular application runs at:

http://localhost:4200

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a task |
| GET | `/api/weather?city=Johannesburg` | Retrieve weather |

The backend also provides task completion and deletion operations.

## Testing

Run backend tests:

```powershell
cd backend
mvn test
```

Run frontend tests:

```powershell
cd frontend
npm test -- --watch=false
```

## Light and Dark Mode

The application uses the CSS `prefers-color-scheme` media query to support automatic light and dark themes based on the user's system preferences.

## Author

Sabelo Miya

Web Frontend Engineer Technical Assessment — Glucode
