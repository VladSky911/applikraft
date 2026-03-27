# Applikraft

Job Application Tracker — track, manage and organize your job search process.

## Features

- User registration and authentication (JWT)
- Create, read, update, delete job applications
- Upload screenshots (cover letters, responses, job posts)
- Track application status: Applied → Interview → Offer / Rejected
- Multilingual interface (English, Deutsch, Русский)
- Modern glassmorphism UI design
- Protected routes — your data is private

## Tech Stack

**Frontend:** React, React Router, i18next, Axios

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/VladSky911/applikraft.git
cd applikraft
```

2. Setup backend
```bash
cd server
npm install
```

Create `server/.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. Setup frontend
```bash
cd ../client
npm install --legacy-peer-deps
```

4. Run the app

Terminal 1 (backend):
```bash
cd server
npm run dev
```

Terminal 2 (frontend):
```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Screenshots

*Coming soon*

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

**Vladimir** — [GitHub](https://github.com/VladSky911)
