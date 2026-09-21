# MERN Chat Application

A real-time group chat application built with MongoDB, Express, React, Node.js, and Socket.IO. Users can create accounts, join groups, exchange messages in real time, see member presence, and receive typing indicators.

## Features

- User registration and JWT authentication
- Protected user, group, and message routes
- Admin-only group creation
- Group join and leave workflows
- Group chat with Socket.IO real-time messages
- Online and offline member presence
- Typing indicators and message timestamps
- Responsive Chakra UI interface
- MongoDB persistence for users, groups, and messages

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
│       ├── components/
│       └── pages/
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
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
```

The backend also accepts `MONGODB_URI` instead of `MONGO_URI`. If `PORT` is omitted, the backend uses port `5001`.

The frontend uses `http://localhost:5001` by default during local development. For a deployed frontend, set `VITE_API_URL` to the deployed backend URL when building it. `FRONTEND_URL` supports comma-separated origins when more than one frontend origin is needed.

Generate a JWT secret with:

```bash
openssl rand -base64 48
```

Never commit `.env` or expose `JWT_SECRET`, `MONGO_URI`, or other backend secrets in frontend code.

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

Open `http://localhost:5173` in a browser. Make sure MongoDB is running locally or that `MONGO_URI` points to a reachable MongoDB Atlas database.

## Available Commands

From the project root:

```bash
npm start       # Start the backend
npm run dev     # Start the Vite frontend through the root script
npm test        # Run frontend lint, frontend build, and backend syntax checks
```

From the `frontend/` directory:

```bash
npm run dev     # Start the Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build locally
npm run lint    # Run ESLint
```

## Using the Application

1. Register a user account.
2. Log in to open the chat screen.
3. Join an available group.
4. Select a joined group to view its messages and members.
5. Send messages and test the real-time typing indicator.
6. Leave a group or log out when finished.

## Administrator Workflow

New accounts are regular members by default. To create the first administrator, register an account and set its `isAdmin` field to `true` in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { isAdmin: true } });
```

Log out and log back in after changing the role. Administrators can then:

- Create groups with the `+` button.

## Deployment

Deploy the backend and frontend as separate services. Configure these variables in the backend hosting environment:

```env
PORT=5001
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

Configure this variable in the frontend build environment:

```env
VITE_API_URL=https://your-backend-domain.com
```

Use a dedicated production database and unique secrets. Do not publish demo admin credentials unless the account is intentionally disposable.

## API Routes

The backend exposes these route groups:

```text
/api/users
/api/groups
/api/messages
```

Protected routes require a JWT returned by the user authentication endpoints.

```text
POST   /api/users/register
POST   /api/users/login

GET    /api/groups
POST   /api/groups
POST   /api/groups/:groupId/join
DELETE /api/groups/:groupId/leave

GET    /api/messages/:groupId
POST   /api/messages
```

## License

See the `LICENSE` file for licensing terms.
