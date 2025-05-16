# kpi-management-system

KPI Management System
A comprehensive system for managing Key Performance Indicators (KPIs) with a Next.js frontend and Node.js backend.
Project Structure
This project is structured in two main parts:

Frontend: Built with Next.js
Backend: Node.js application with TypeScript

Setup Instructions
Prerequisites

Node.js (v16 or later)
npm or yarn
Docker (optional, for containerized deployment)

Frontend Setup

Navigate to the frontend directory:
bashcd client-nexjs/frontend-kpi

Install dependencies:
bashnpm install
# or
yarn install

Configure environment variables:

Copy .env.example to .env (if not already present)
Update the variables as needed


Start the development server:
bashnpm run dev
# or
yarn dev

Access the application at http://localhost:3000

Backend Setup

Navigate to the backend directory:
bashcd src

Install dependencies:
bashnpm install
# or
yarn install

Configure environment variables:

Copy .env.example to .env
Update database connection strings and other configuration


Set up Prisma (ORM):
bashnpx prisma generate
npx prisma migrate dev

Start the server:
bashnpm run start
# or
yarn start


Docker Setup (Optional)
To run the application using Docker:

Build the Docker image:
bashdocker build -t kpi-management-system .

Run the container:
bashdocker run -p 3000:3000 -p 8080:8080 kpi-management-system


API Documentation
Authentication
Login

Endpoint: /api/auth/login
Method: POST
Body:
json{
  "username": "string",
  "password": "string"
}

Response:
json{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}


Register

Endpoint: /api/auth/register
Method: POST
Body:
json{
  "username": "string",
  "password": "string",
  "email": "string",
  "name": "string"
}

Response:
json{
  "id": "string",
  "username": "string"
}


User Management
Create User

Endpoint: /api/users
Method: POST
Authorization: Bearer Token (Admin only)
Body:
json{
  "username": "string",
  "password": "string",
  "email": "string",
  "name": "string",
  "role": "string"
}


Get User Role

Endpoint: /api/users/role/:userId
Method: GET
Authorization: Bearer Token
Response:
json{
  "role": "string"
}


KPI Endpoints
Create KPI

Endpoint: /api/kpis
Method: POST
Authorization: Bearer Token
Body:
json{
  "name": "string",
  "description": "string",
  "target": "number",
  "unit": "string",
  "frequency": "string"
}


Get KPIs

Endpoint: /api/kpis
Method: GET
Authorization: Bearer Token
Query Parameters:

page: number
limit: number


Response:
json{
  "kpis": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "target": "number",
      "unit": "string",
      "frequency": "string",
      "createdAt": "date"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}


Get KPI Details

Endpoint: /api/kpis/:id
Method: GET
Authorization: Bearer Token
Response:
json{
  "id": "string",
  "name": "string",
  "description": "string",
  "target": "number",
  "unit": "string",
  "frequency": "string",
  "createdAt": "date",
  "metrics": [
    {
      "id": "string",
      "value": "number",
      "date": "date"
    }
  ]
}


Update KPI

Endpoint: /api/kpis/:id
Method: PUT
Authorization: Bearer Token
Body:
json{
  "name": "string",
  "description": "string",
  "target": "number",
  "unit": "string",
  "frequency": "string"
}


Delete KPI

Endpoint: /api/kpis/:id
Method: DELETE
Authorization: Bearer Token

Environment Variables
Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:8080/api
Backend (.env)
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/kpi_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="24h"
Tech Stack
Frontend

Next.js
React
TypeScript
CSS modules

Backend

Node.js
Express
TypeScript
Prisma (ORM)
PostgreSQL

License
MIT
