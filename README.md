# README.md
📘 Overview

This project is a full-stack Q&A forum built with the MERN stack (MongoDB, Express, React, Node.js).
It allows members to post questions and answers, and managers to record organizational insights based on those questions.

Developed as part of the OneOrg.AI Developer Assignment.

🚀 Tech Stack

Frontend: React (Vite) + TailwindCSS

Backend: Node.js + Express.js

Database: MongoDB Atlas

Auth: JWT-based Authentication & Role Authorization

📂 Folder Structure
OneOrg_Assignment/
│
├── client/ # 🎨 React Frontend (Vite)
│ ├── src/
│ │ ├── pages/ # Page components (Feed, AskQuestion, QuestionDetail, ManagerDashboard)
│ │ ├── components/ # Reusable UI components (Navbar, etc.)
│ │ ├── context/ # Auth context and provider
│ │ ├── utils/ # Axios setup and API helper
│ │ └── assets/ # Static assets if any (images, icons)
│ ├── index.html # Root HTML
│ └── package.json # Frontend dependencies
│
├── server/ # ⚙️ Express Backend
│ ├── src/
│ │ ├── config/ # Database connection (db.js)
│ │ ├── controllers/ # Route handlers (auth, questions, answers, insights)
│ │ ├── models/ # Mongoose schemas (User, Question, Answer, Insight)
│ │ ├── routes/ # Express route definitions
│ │ ├── middleware/ # JWT auth and role-based protection
│ │ └── utils/ # Error handling utilities
│ ├── package.json # Backend dependencies
│ └── .env.example # Environment variables (PORT, MONGO_URI, JWT_SECRET)


🧩 Features
| Feature                         | Member | Manager |
| ------------------------------- | ------ | ------- |
| **Auth (Login/Register)**       | ✅      | ✅       |
| **Ask Question**                | ✅      | ✅       |
| **Answer Question**             | ✅      | ✅       |
| **View Feed + Search**          | ✅      | ✅       |
| **Manager Insights (Add/View)** | ❌      | ✅       |
| **Role-based Access**           | ✅      | ✅       |
| **Timestamps (createdAt)**      | ✅      | ✅       |

🔐 Roles & Permissions
Member: can register, log in, ask questions, and answer others’ questions.
Manager: can do all of the above plus create and view insights for questions.


⚙️ Setup Instructions (Local)
git clone https://github.com/iamtheharsh/OneOrg_Assignment.git
cd OneOrg_Assignment


🖥️ Backend Setup
cd server
npm install

Create a .env file inside the server folder:
PORT=8000
MONGO_URI=your_mongo_atlas_connection_string
JWT_SECRET=supersecretkey

Start the backend:
npm run dev

💻 Frontend Setup
cd ../client
npm install
npm run dev

Visit → http://localhost:5173




🧾 API Endpoints Summary
| Endpoint               | Method   | Description               | Auth      |
| ---------------------- | -------- | ------------------------- | --------- |
| `/auth/register`       | POST     | Register new user         | ❌         |
| `/auth/login`          | POST     | Login user                | ❌         |
| `/questions`           | GET/POST | Fetch or create questions | ✅         |
| `/answers/:questionId` | GET      | Get answers for question  | ✅         |
| `/answers`             | POST     | Create a new answer       | ✅         |
| `/insights`            | GET/POST | Get or create insights    | Manager ✅ |

✅
📸 UI Flow

Login/Register Page – Role selection and authentication

Feed Page – Shows all questions (searchable by title/tag)

Ask Question Page – Post a new question

Question Details – View all answers & post new ones

Manager Insights Dashboard – Add and view organizational insights
