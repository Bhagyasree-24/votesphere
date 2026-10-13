<<<<<<< HEAD
# VoteSphere — Student Voting App

A full-stack educational voting app built with React, TypeScript, Node.js, Express, Mongoose, and MongoDB.

## Features
- Create polls with 2–6 options
- List polls
- Cast one vote per voter ID per poll
- View results and percentages
- Server-side validation and error handling
- MongoDB persistence
- Separated routes, controllers, models, configuration, and middleware

## Requirements
- Node.js 20+ and npm
- MongoDB Community Server running locally, OR a MongoDB Atlas cluster

## 1. Configure the backend
```powershell
cd backend
Copy-Item .env.example .env
npm install
```
Edit `backend/.env`. For local MongoDB, the default is:
`MONGO_URI=mongodb://127.0.0.1:27017/votesphere`

For Atlas, use your own connection string. Do not commit `.env` or share your database password.

## 2. Configure the frontend
Open a second terminal:
```powershell
cd frontend
Copy-Item .env.example .env
npm install
```

## 3. Start the app
Terminal 1:
```powershell
cd backend
npm run dev
```
Terminal 2:
```powershell
cd frontend
npm run dev
```
Open the URL printed by Vite, usually http://localhost:5173.

## API
- `GET /api/health`
- `GET /api/polls`
- `POST /api/polls`
- `POST /api/polls/:id/vote`
- `GET /api/polls/:id/results`

Create poll JSON:
```json
{
  "question": "Which language do you prefer?",
  "options": ["TypeScript", "Python", "Java"]
}
```

Vote JSON:
```json
{
  "optionId": "ID_FROM_POLL_OPTIONS",
  "voterId": "student-demo-123456"
}
```

## Important security limitation
This project demonstrates duplicate-vote prevention using a client-provided voter ID. It is not secure identity verification because users can change or clear browser storage. For real elections, add authentication and enforce eligibility server-side.
=======
# votesphere
VoteSphere – A secure and user-friendly online voting platform designed to simplify the voting process through a digital interface.
>>>>>>> origin/main
