# 🚍 Elikem Transport — Bus Booking App

A full-stack **bus reservation and management application** called **Elikem Transport**, built with Node.js, Express, MongoDB and a modern frontend.  
This project provides both an **Admin Dashboard** and a **User Booking System** (in-progress), including authentication, bus management, and seat booking functionality.

## 🧠 Project Overview

Elikem Transport is a web-based application designed to let users search for buses, book seats, and manage trips — with a powerful admin interface that allows staff to add drivers, buses, and control boarding schedules.

This app is currently **partially complete**, with the **Admin section fully implemented**, and the **User side and payment integration (Paystack)** in development.

---

## 🚀 Features — Admin

Admins can:

### 🛠️ Authentication
- Login via email & password
- Secure token-based authentication

### 🧑‍✈️ Driver & Staff Management
- Create new **drivers**
- Create new **staff**
- Display driver details (ID, name, email)

### 🚌 Bus Management
- Create buses with:
  - Bus name
  - Bus number
  - Routes (from / to)
  - Image upload
  - Section (morning/afternoon/evening)
  - Capacity
  - Type (luxury / standard / economy)
  - Terminal
  - Driver assignment

- View, search, edit, and delete buses

### 📊 Boarding Control
- View list of buses
- Search by bus number or driver name  
- Update boarding status, terminal, section & boarding time  

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT Token Authentication |
| Frontend | HTML, CSS, JS |
| Styling | Custom CSS |

---

## 📁 Project Structure

Assuming your repo structure:

bookBus/
├── bookme_frontend/ # Frontend design
├── boome_backend/ # Backend API
├── send_email.js
├── .env.example
├── README.md

yaml

---

## 🧩 Installation

> Clone the repository

```bash
git clone https://github.com/Jganyo-dotcom/bookBus.git
cd bookBus
Install backend dependencies

bash
Copy code
cd boome_backend
npm install
Create a .env file in boome_backend/ with your secrets:

ini
Copy code
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<secret_key>
Start backend:

bash
Copy code
npm run dev
Open frontend

bash
Copy code
cd ../bookme_frontend
# Open index.html in browser or serve it
🧪 Usage
Admin
Navigate to the admin login page

Login with credentials

Query buses or search by driver or bus number

Update boarding information or delete buses

Driver/Staff
Driver and staff accounts are created via the Admin interface

📌 Endpoints (examples)
Purpose	Method	URL
Admin Login	POST	/admin/login
Get all buses	GET	/admin/Admin/buses
Search by bus	GET	/bus/bus-number?number=...
Search by driver	GET	/admin/driver?name=...
Update boarding	PATCH	/bus/boarding/:id
Delete bus	DELETE	/bus/delete/:id

(Adjust based on final backend API routes)

📊 Future Work
🔹 Finish User Side — search & booking UI

🔹 Integrate Paystack payments

🔹 Seat selection interface

🔹 Email confirmation & notifications

🔹 Better validation and error handling

🔹 Deployment (Heroku / Railway / Vercel / Fly.io)

❤️ Credits
Made by Esthe Ganyo (Jganyo-dotcom) — A passionate dev learning and building in public 🚀.

📝 Notes
This project is a work in progress; features will be updated.

Contributions welcome — open a PR or issue!

⭐ If you like this project, give it a star!

yaml
Copy code

---
