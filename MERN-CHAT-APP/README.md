# MERN Chat Application

A real-time group chat application built with MongoDB, Express, React, Node.js, and Socket.IO. Users can create accounts, sign in, create or join groups, and exchange messages in real time.

## Features

- User registration and JWT authentication
- Protected user, group, and message routes
- Group chat with Socket.IO real-time updates
- MongoDB persistence for users, groups, and messages
- React frontend with Chakra UI and React Router

## Project Structure

```text
MERN-CHAT-APP/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── socket.js
├── docs/
├── frontend/
│   ├── public/
│   └── src/
├── server.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- A MongoDB database, local or hosted through MongoDB Atlas

## Configuration

Create a `.env` file in the project root. Do not commit this file or share its values.

```env
PORT=5001
MONGO_URI=mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

The backend also accepts `MONGODB_URI` instead of `MONGO_URI`. If `PORT` is omitted, the backend uses port `5001`.

## Installation

Install backend dependencies from the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

## Running Locally

Start the backend in one terminal from the project root:

```bash
npm start
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Vite usually serves the frontend at `http://localhost:5173`. The backend usually runs at `http://localhost:5001`.

The frontend currently uses the deployed backend URL in `frontend/utils.js`. To run the complete application against your local backend, change that value to:

```js
const apiURL = "http://localhost:5001";
```

The backend CORS configuration allows the Vite development origin at port `5173`.

## Available Commands

From the project root:

```bash
npm start       # Start the backend
```

From the `frontend/` directory:

```bash
npm run dev     # Start the Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build locally
npm run lint    # Run ESLint
```

## API Routes

The backend exposes these route groups:

```text
/api/users
/api/groups
/api/messages
```

Protected routes require a JWT returned by the user authentication endpoints.

## License

See the `LICENSE` file for licensing terms.
