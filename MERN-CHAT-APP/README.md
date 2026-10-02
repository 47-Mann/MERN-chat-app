# MERN Chat App

A real-time group chat application built with MongoDB, Express, React, Node.js, and Socket.IO. The app supports user authentication, guest access, group membership, and live messaging for multiple users.

## Tech Stack

- Frontend: React + Vite + Chakra UI
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Real-time communication: Socket.IO
- Authentication: JWT + bcrypt

## Features

- User registration and login
- Guest demo access
- JWT-protected API routes
- Group creation and membership management
- Real-time messaging within groups
- Online status updates
- Typing indicators
- Admin-only group creation flow
- Responsive dark-themed UI

## Project Structure

```text
MERN-CHAT-APP/
├── .env.example
├── .env
├── README.md
├── package.json
├── server.js
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── socket.js
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── node_modules/
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- npm installed
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Setup

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Example configuration:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/mern-chat-app
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Notes:

- The backend also accepts `MONGODB_URI` if you prefer that variable name.
- `FRONTEND_URL` supports comma-separated origins for multiple frontend domains.
- `JWT_SECRET` should be a long random string. You can generate one with:

```bash
openssl rand -base64 48
```

Do not commit your `.env` file to version control.

## Installation

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

## Run the App

Start the backend from the project root:

```bash
npm start
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Open the app in your browser at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

Make sure MongoDB is running before starting the server.

## Root Scripts

From the project root:

```bash
npm start   # Start the Express API server
npm run dev # Start the Vite frontend
npm test    # Run frontend lint, frontend build, and backend syntax checks
```

## Frontend Scripts

Inside the `frontend` folder:

```bash
npm run dev     # Start the Vite dev server
npm run build   # Produce a production build
npm run preview # Preview the production build
npm run lint    # Run ESLint
```

## How the App Works

1. Register an account or use the guest login flow.
2. Join an existing group or create one if you are an admin.
3. Select a group to view messages and members.
4. Send messages in real time; other members receive updates instantly.
5. Leave a group or log out when finished.

## Admin Workflow

New accounts are regular members by default. To make the first admin account:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { isAdmin: true } });
```

Then log out and back in. Admin users can create groups from the UI.

## API Overview

The backend exposes the following route groups:

```text
/api/users
/api/groups
/api/messages
```

Common routes:

```text
POST /api/users/register
POST /api/users/login
POST /api/users/guest

GET  /api/groups
POST /api/groups
POST /api/groups/:groupId/join
DELETE /api/groups/:groupId/leave

GET  /api/messages/:groupId
POST /api/messages
```

Protected routes require a valid JWT from the auth flow.

## Deployment Notes

For production, deploy the backend and frontend as separate services and set the environment variables in each environment:

Backend:

```env
PORT=5001
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

Frontend:

```env
VITE_API_URL=https://your-backend-domain.com
```

Use strong secrets and a production MongoDB instance for deployment.

## License

This project is licensed under the ISC license.
