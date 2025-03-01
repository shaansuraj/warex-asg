# Warex Backend & Frontend Project

Hello, I'm Suraj. This is the assignment I've got from Warex for the role of Warex Backend Developer. This project has the  backend and a small frontend application(to make the evaluator's work easier) for managing SKUs, customers, and orders using Node.js, Express, and MongoDB. The system includes role-based access control (RBAC) with two roles: **admin** and **salesman (user)**. It also features real-time notifications using Socket.io and scheduled cron jobs for generating hourly order summaries. For API testing, I have included a Postman collection named **"warex.postman_collection.json"**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Backend Setup & Usage](#backend-setup--usage)
- [Cron Job Details](#cron-job-details)
- [Frontend Setup & Usage](#frontend-setup--usage)
- [Testing with Postman](#testing-with-postman)
- [Additional Notes](#additional-notes)


---

## Project Overview

In this project, I have built:

1. **Authentication & RBAC:**  
   - User signup and login endpoints using JWT.
   - Salesmen (role: "user") can create SKUs, customers, and orders.
   - Admins can view all orders, receive real-time notifications, and view hourly summaries.

2. **SKU Management:**  
   - Create and fetch SKUs.
   - Each SKU is assigned a custom ID (e.g., `SKU-00001`) using a centralized counter model.

3. **Customer Management:**  
   - Create and fetch customers.
   - Customers receive a custom ID (e.g., `CUST-00001`).

4. **Order Management:**  
   - Create and fetch orders.
   - Orders use a custom ID (e.g., `OD-00001`) and reference the underlying Customer and SKU by their MongoDB ObjectIds.

5. **Real-Time Notifications:**  
   - Using Socket.io, admins receive live notifications whenever a new order is created.
   - These notifications are displayed in the notifications panel available on the admin dashboard (and also in the file `admin-notifications.html`).

6. **Hourly Order Summaries:**  
   - A cron job generates hourly summaries that record the number of orders and total order amount.  
   - I have commented out the 1-minute cron job schedule, which can be used for evaluation.

---

## Directory Structure

```
├── Backend
│   ├── config
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers
│   │   ├── auth.controller.js  #Controller for authentication(Login, Signup)
│   │   ├── sku.controller.js   #Controller for SKU relaetd features
│   │   ├── customer.controller.js   #Controller for Customer related features
│   │   ├── order.controller.js     #Controller for Order related features
│   │   └── admin.controller.js     #Controller for Admin only features
│   ├── middlewares 
│   │   ├── auth.middleware.js      #Middleware for authorisation
│   │   └── role.middleware.js      #Middleware role check
│   ├── models
│   │   ├── user.model.js      #Stores user details
│   │   ├── sku.model.js       #Stores SKU details
│   │   ├── customer.model.js   #Stores Customer details
│   │   ├── order.model.js       #StoresOrder details
│   │   ├── counter.model.js       #Used to generate sequential unique IDs 
│   │   └── hourlySummary.model.js   # Stores hourly order summaries
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── sku.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js
│   │   └── admin.routes.js
│   ├── services
│   │   ├── notification.service.js  # Manages Socket.io notifications
│   │   └── cron.service.js  # Cron job to generate hourly summaries
|   |   |__ idGenerator.js   #ideGenrator to generate the custom ids     
│   ├── .env   # Environment variables(I have kept it in the zip file for evaluation purpose)
│   ├── package.json
│   └── server.js                   # Entry point for the backend server
│   ├── admin-notifications.html      # Admin notifications test page using Socket.io
│
├── Frontend
│   ├── index.html                  # Login & Signup page
│   ├── user.html                   # Salesman dashboard (create customers, SKUs, orders)
│   ├── admin.html                   # Admin dashboard (order history, hourly updates)
│   ├── style.css                   # Shared CSS styles
│   └── app.js                      # Frontend JS for API calls and functionality
│
└── warex.postman_collection.json   # Postman collection for API testing
```

---

## Backend Setup & Usage

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/shaansuraj/warex-asg.git
   cd Backend
   ```

2. **Install Dependencies:**  
   ```bash
   npm install
   ```

4. **Create a MongoDb database named warexDb:**

   ```bash
   mongosh 
   use warexDb
   ```


5. **Environment Variables:**  
   The `.env` file in the Backend directory has the following:
   ```
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/warexDb
   JWT_SECRET=953d1cc13f144a81bd69f6d6fd07ef8c1d2bfa42c6b5aa16d63549c4dbff7c6a
   ```

6. **Start the Server:**  
   ```bash
   cd Backend
   npm run dev
   ```

7. **To upgrade any user to admin:**

   ```bash
   mongosh 
   use warexDb
   db.users.updateOne({ username: "john_doe" }, { $set: { role: "admin" } })

   ```

---

## Cron Job Details

- **Scheduled every 1 minute for evaluation(commented out):**  
  ```js
  cron.schedule('*/1 * * * *', async () => {
    await cronService.generateHourlyOrderSummary();
  });
  ```
- **One-Hour Cron Job**  
  ```js
  cron.schedule('0 * * * *', async () => {
    await cronService.generateHourlyOrderSummary();
  });
  ```

---

## Frontend Setup & Usage

1. Open `Frontend/index.html` in your browser to access the login page.
2. Admin Dashboard (`admin.html`) includes:
   - Note: You have to signup -> login first
   - Order history
   - Hourly order updates
   - **Admin notifications** (via `admin-notifications.html` using Socket.io)
3. User Dashboard (`user.html`) allows:
   - Note: You have to signup -> login first
   - Creating and viewing customers and SKUs
   - Placing and tracking orders

---

## Testing with Postman

- **Import Postman Collection:**  
  Open Postman → Import `warex.postman_collection.json`
- **Run API Tests:**  
  Test authentication, SKU management, customer management, order management, and admin reports.

---





