# 🚀 Workflow Management System

A complete workflow automation platform that simulates a real corporate environment — including employee requests, approval chains, background processing, notifications, and dynamic role-based dashboards.

---

## ✨ Features

### 👤 Role-Based System
- **Employee**: Submit various requests (Leave, Salary Raise, WFH, Laptop Request…)
- **Manager**: Review & approve/decline employee requests
- **Admin / HR**: Final approval + full system monitoring
- **Workflows change dynamically** depending on request type

### 🔔 Notifications System
- Real-time notifications for each user
- Mark-as-read, store in DB
- Background job processing (non-blocking)

### 📊 Dashboards
Each role sees a different organized dashboard showing only related data

### ⚙️ Workflow Processing
Multi-step request routing + verification before each status change

---

## 🧠 Tech Stack

### 🖥️ Backend — Node.js / Express / MongoDB
- JWT Authentication + RBAC
- RESTful API structure
- MongoDB + Mongoose
- BullMQ + Redis for Background Jobs
- Email queue (async)
- Validation middleware & secure routes

- Swagger API documentation

### 💻 Frontend — React.js
- Protected Routes + Role-based UI
- Reusable components
- Dynamic pages for requests & workflows
- Notifications UI integrated with backend
- Clean & Modern UX

---

## 🌐 Demo

🎥 Watch Demo Video:  
🔗 https://drive.google.com/file/d/1yvRAS3odhQb6M2v7RWwZKTQTbK6rOv8f/view?usp=sharing

---

## 📸 Screenshots

>ع

| Admin Dashboard | Requests List | Workflow View |
|----------------|---------------|---------------|

![landingpage](https://github.com/user-attachments/assets/c4a3f469-b7a8-476d-a982-cb8e180cb81d)
![users](https://github.com/user-attachments/assets/2226bfea-2ef6-4fa9-b00d-aacac5c6be21)
![requests](https://github.com/user-attachments/assets/ed63e16a-94cb-43a3-ae02-812e503cd5b6)
![details](https://github.com/user-attachments/assets/25f46ac3-cb15-4508-81e6-dc2333a325f0)
![employerDashboard](https://github.com/user-attachments/assets/e0dd921f-ee85-44ce-bd7e-fe92c4f98be8)
![notofilcation](https://github.com/user-attachments/assets/20ab3608-dedb-4976-8bb9-28fec9120c9e)
![mangerdashboard](https://github.com/user-attachments/assets/16d238ef-9f62-4510-86ac-61e87269e08b)
![hrmangerdashboard](https://github.com/user-attachments/assets/585185f0-4437-4f59-809f-73d3fcf55671)


---

## 📂 Project Structure

```bash
backend/
 ├─ src/
 │  ├─ controllers/
 │  ├─ models/
 │  ├─ routes/
 │  ├─ middlewares/
 │  ├─ jobs/ (BullMQ)
 │  └─ utils/
frontend/
 ├─ src/
 │  ├─ components/
 │  ├─ pages/
 📌 Future Improvements

Workflow Designer UI (drag & drop)

Email Templates Dashboard

Mobile Version for Employees

Push WebSocket Notifications

🏁 Lessons Learned

✔ Enterprise-grade Node.js architecture
✔ Dynamic multi-step approval logic
✔ Scalable queue processing with Redis
✔ Secure role-based UI separation in React
✔ Clean reusable component-based frontend

📞 Contact

If you'd like access to the source code or a live demo — feel free to reach out! ✨
 │  ├─ services/
 │  └─ context/
