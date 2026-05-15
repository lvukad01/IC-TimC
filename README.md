# Lumii
**A full-stack application for browsing, searching, and booking beauty salon services (hair, nails, makeup, barbershops)**

---

## Features
- Browse and search beauty salons by name, category, or location
- Discover nearby salons based on your location
- Check availability of salons in real time
- Browse salon services (hair, nails, makeup, barbershop)
- Add salons to favorites for quick access
- Image support for salon profiles and galleries (S3 storage)
- Registration of employees for salons
---

# Application is available on http://13.60.66.182/ (if you want to use it locally follow the steps below)

## Requirements
- Node.js (v18+ recommended)
- npm (Node Package Manager)
- Docker & Docker Compose:
---

## Installation
1. Clone the repository:
```
git clone git@github.com:lvukad01/IC-TimC.git
```

2. Navigate into the project folder:
```
cd IC-TimC
```

## Environment Variables
1. Navigate into the api(backend) folder:
   ```
   cd services/api
   ```

2. Copy the example environment file content into .env and change it by the instructions and explanations given:
   ```
   cp .env.example .env
   ```

## Finally
## Run with Docker
   1. Navigate into the root folder:
      ```
      cd ../..
      ```
   2. Run backend and database with docker compose:
   -  Windows/Mac
      ```
      docker compose up --build
      ```
   -  Linux
      ```
      sudo usermod -aG docker $USER
      docker compose up --build
      ```
   3. Navigate into the web folder:
      ```
      npm run dev
      ```
      
## Run with turbo
   1. Navigate into the root folder:
      ```
      cd ../..
      ```
   2. Install packages:
      ```
      npm install
      ```
   3. Build backend and frontend:
      ```
      npm run build
      ```
   4. Start backend:
      ```
      npm run start
      ```

## Access
   Frontend:
   If you started project with Docker you must have manually started the frontend so the url is:
   ```
   http://localhost:5173/
   ```
   If you started project with turbo then backend is serving frontend content on the same port on which it is running:
   ```
   http://localhost:3000/
   ```
   
   Backend Swagger documentation:
   ```
   http://localhost:3000/api
   ```








