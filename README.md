# Othello Game Project

This project consists of a React frontend and a Node.js backend for playing the classic Othello/Reversi game.

## Project Structure

```
othello/
├── othello-react/        # Frontend React application
└── othello-backend-test/ # Backend Node.js server
```

## Frontend Setup (othello-react)

### Prerequisites
- Node.js (v18.20.4 or higher)
- npm (Node Package Manager)

### Installation & Running

1. Navigate to the frontend directory:
```bash
cd othello-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`

## Backend Setup (othello-backend-test)

### Prerequisites
- Node.js (v18.20.4 or higher)
- npm (Node Package Manager)

### Installation & Running

1. Navigate to the backend directory:
```bash
cd othello-backend-test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend server will start running at `http://localhost:9000`

## Features

- Real-time game updates using Socket.io
- Interactive game board
- Move validation
- Score tracking
- Player turn indicators

## Technologies Used

### Frontend
- React.js
- Socket.io-client
- CSS Modules

### Backend
- Node.js
- Express.js
- Socket.io


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
