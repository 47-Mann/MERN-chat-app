# Multiple User Chat Application

A professional MERN stack chat application that enables multiple users to create accounts, sign in, and join shared chat groups for real-time communication.

## Overview

This project is designed to support collaborative conversations in a group-based environment. Users can register an account, authenticate securely, and access chat rooms where they can communicate with other members in real time.

## Key Features

- User registration and account creation
- Secure login using JWT-based authentication
- Group-based chat experience for multiple users
- Real-time messaging with Socket.IO
- MongoDB-powered persistence for users and chat data
- Express.js backend for RESTful API endpoints
- React-based frontend support for a modern user experience

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Socket.IO
- JWT Authentication

## Project Structure

```bash
MERN-CHAT-APP/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── socket.js
├── docs/
├── .env
├── index.js
├── package.json
├── server.js
├── README.md
└── ...
```

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- npm
- MongoDB database access
- A valid environment configuration in the `.env` file

## Environment Configuration

Create a `.env` file in the project root with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies:

```bash
npm install
```

## Run the Application

Start the backend server:

```bash
npm start
```

The application will run on the configured port, typically `5000` unless otherwise specified.

## Usage

1. Register a new user account.
2. Log in with the registered credentials.
3. Join an existing group or create a group conversation.
4. Start interacting with other users in real time.

## Notes

This application is intended for group-based communication and demonstrates a practical full-stack implementation of a real-time chat system using the MERN stack.

## License

This project is for educational and development purposes.
