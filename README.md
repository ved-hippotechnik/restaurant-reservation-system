# Restaurant Reservation System

A modern, full-stack restaurant reservation system built with React and Spring Boot.

## Features

- 🍽️ **Restaurant Discovery**: Browse and search restaurants by cuisine, location, and ratings
- 📅 **Easy Reservations**: Simple and intuitive reservation flow with date/time selection
- 👥 **User Management**: Secure authentication and user profiles
- 📊 **Restaurant Dashboard**: Manage reservations and tables (for restaurant staff)
- 🎨 **Modern UI**: Clean, responsive design with Material-UI components
- 🔔 **Real-time Updates**: WebSocket support for live notifications

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API calls

### Backend
- Spring Boot 3.2
- Spring Security with JWT authentication
- Spring Data JPA with PostgreSQL
- WebSocket support for real-time features
- Maven for dependency management

## Prerequisites

- Node.js 16+ and npm
- Java 17+
- Maven 3.6+
- PostgreSQL 12+

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/[your-username]/restaurant-reservation-system.git
cd restaurant-reservation-system
```

### 2. Set up the Backend

1. Configure PostgreSQL database:
   - Create a database named `restaurant_reservation`
   - Update `backend/src/main/resources/application.yml` with your database credentials

2. Run the backend:
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Set up the Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Quick Start

Use the provided startup script:
```bash
./run-app.sh
```

This will start both frontend and backend services.

## Project Structure

```
restaurant-reservation-system/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store and slices
│   │   ├── api/          # API configuration
│   │   └── theme/        # Custom Material-UI theme
│   └── public/           # Static assets
├── backend/              # Spring Boot backend application
│   └── src/
│       └── main/
│           ├── java/     # Java source code
│           └── resources/# Configuration files
└── README.md
```

## Key Features Implementation

### Restaurant Search
- Full-text search across restaurant names and descriptions
- Filter by cuisine type and location
- Sort by ratings and reviews

### Reservation System
- Real-time availability checking
- Table selection based on party size
- Special requests and occasion handling

### Authentication
- JWT-based authentication
- Secure password handling
- Role-based access control (Customer, Restaurant Staff)

## API Documentation

The backend exposes RESTful APIs:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/restaurants` - List restaurants
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/my` - User's reservations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
EOF < /dev/null