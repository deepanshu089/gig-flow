# GigFlow

A mini-freelance marketplace platform.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Real-time: Socket.io
- Authentication: JWT with HttpOnly cookies

## Features
- User Authentication (Login/Register)
- Post Gigs (Jobs)
- Browse Gigs (Search by title)
- Place Bids on Gigs
- Hire Freelancers (Atomic transaction)
- Real-time Notifications (Socket.io)
- Dashboard for managing Gigs and Bids

## Setup

### Backend
1. `cd server`
2. `npm install`
3. Create `.env` file (copy from `.env.example`).
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_jwt_secret
   ```
4. `npm run dev` (Runs on port 5000)

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

