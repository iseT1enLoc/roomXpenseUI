# 🖥️ roomUI

A React-based frontend for the **roomXpenditure** backend system. This UI allows users to interact with the student room and expenditure management system, providing an easy and intuitive interface for managing room assignments, tracking expenses, and viewing reports.

---

## 🚀 Features

- **User Authentication** – Secure login and registration for students and administrators.
- **Room Management** – Manage room assignments and track room status.
- **Expense Tracking** – Track shared living expenses and view individual contributions.
- **Reports** – Visualize and generate monthly and yearly expenditure reports.
- **Responsive Design** – Works seamlessly on both desktop and mobile devices.
- **Real-time updates** – Receive live updates about room assignments and expense changes.

---

## 📁 Project Structure

```bash
roomUI/
│
├── api/               # API interactions with the backend system (e.g., roomXpenditure)
├── assets/            # Static files like images, icons, and other media
├── components/        # Reusable UI components (Buttons, Forms, etc.)
├── hooks/             # Custom React hooks for managing state and logic
├── pages/             # Pages of the app (Login, Dashboard, Room Details, etc.)
├── redux/             # Redux store, actions, and reducers for state management
│
├── App.css            # Global styling for the application
├── App.jsx            # Main component that defines the UI structure
├── index.css          # Basic styling and resets
└── main.jsx            # React entry point for the app

## 🛠️ Setup & Installation
1. Clone the Repository
``` bash
Copy
Edit
git clone https://github.com/iseT1enLoc/roomUI.git
cd roomUI
## 2. Install Dependencies
``` bash
npm install
## 3. Run the server
``` bash
npm run dev
