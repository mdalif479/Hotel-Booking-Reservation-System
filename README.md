# Amour Hotel Booking & Reservation System

A full-stack hotel booking web application. Guests can browse rooms, search by date/price/amenity, book a stay, pay (demo/sandbox payment), and manage or cancel their reservations. Admins get a dashboard to manage rooms, bookings and users.

**Tech stack:** Node.js + Express (REST API) · MongoDB + Mongoose · JWT + bcrypt authentication · plain HTML/CSS/JavaScript frontend · EmailJS for email notifications.

---

## 1. How to access the app

This project is a **localhost application** (it is not deployed online). To use it you must run the backend and the frontend on your own computer by following the installation steps below.

Once running, open the site at: **http://127.0.0.1:5500/index.html**
The API runs at: **http://localhost:5002** (health check: http://localhost:5002/api/health)

---

## 2. Requirements (software and versions)

| Software | Version | Notes |
|---|---|---|
| Node.js | 18 or newer (LTS recommended) | Needed for the built-in `fetch` used by the email service. Check with `node -v` |
| npm | 9 or newer (comes with Node.js) | Check with `npm -v` |
| MongoDB Community Server | 6.0 or newer | Must be running on the default port 27017 |
| Visual Studio Code | Any recent version | Used to run the frontend |
| VS Code extension: **Live Server** (Ritwick Dey) | Any recent version | Serves the `frontend` folder on port 5500 |
| Web browser | Google Chrome, Microsoft Edge or Firefox, latest version | Any modern browser with JavaScript enabled |
| Git | Any recent version | Only needed to clone the repository |

Optional: an [EmailJS](https://dashboard.emailjs.com/) account for sending emails. The app works without it.

> Replace the versions above with the exact versions you developed and tested on if they differ (run `node -v`, `npm -v` and `mongod --version`).

---

## 3. Installation (step by step)

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Hotel_Booking_&_Reservation_System
   ```
2. **Install and start MongoDB** Community Server. Make sure the MongoDB service is running (on Windows: Services → MongoDB → Running).
3. **Go to the backend folder**
   ```bash
   cd backend
   ```
4. **Create your environment file.** Copy `.env.example` to `.env`:
   ```bash
   # Windows (Command Prompt)
   copy .env.example .env
   # macOS / Linux
   cp .env.example .env
   ```
   Open `.env` and change `JWT_SECRET` to a long random string. The other defaults work for a normal local setup:
   ```
   PORT=5002
   MONGODB_URI=mongodb://127.0.0.1:27017/amour_hotel
   FRONTEND_URL=http://127.0.0.1:5500
   ```
5. **Install dependencies**
   ```bash
   npm install
   ```
6. **Load the sample data** (6 demo rooms and the admin account):
   ```bash
   npm run seed
   ```
7. **Start the backend server**
   ```bash
   npm start
   ```
   You should see `MongoDB Connected` and `Server running on http://localhost:5002`. Leave this terminal open. (For auto-restart while developing, use `npm run dev`.)
8. **Start the frontend.** Open the project in VS Code, right-click `frontend/index.html` and choose **Open with Live Server**. The site opens at `http://127.0.0.1:5500/frontend/index.html` (or `http://127.0.0.1:5500` if you opened the `frontend` folder itself).

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin (superuser) | `admin@amourhotel.com` | `Admin123!` |
| Guest | Create your own on the Register page | – |

> Change the admin password before any real deployment.

### Troubleshooting

- **"Could not load rooms"** → the backend or MongoDB is not running. Start MongoDB, then `npm start` in `backend`.
- **`MongoDB connection failed`** → check `MONGODB_URI` in `.env` and that the MongoDB service is running.
- **Port already in use** → change `PORT` in `.env` and update `API_BASE` in `frontend/js/api.js` to match.
- **No rooms appear** → run `npm run seed` again.

---

## 4. User manual

### 4.1 Create an account and log in
1. Open the site and click **Register** in the top menu.
2. Enter your full name, email and password, confirm the password, and submit.
3. Go to **Login**, enter your email and password. Guests are taken to the home page; admins are taken to the Admin Dashboard.
4. Use **Logout** to sign out.

### 4.2 Browse and search rooms
1. Click **Rooms** in the menu.
2. Use the type drop-down (All / Standard / Deluxe / Suite) to filter by room type.
3. To search availability, fill in any of: check-in date, check-out date, number of guests, minimum price, maximum price, or an amenity (for example `WiFi`), then click **Search availability**. Rooms that are already booked for those dates are not shown.
4. Click **Book Now** on a room to start a reservation.

### 4.3 Book a room (you must be logged in)
1. On the **Booking** page, check that your name, email and phone are correct.
2. Choose your **check-in** and **check-out** dates and select a **room**. The nightly price and **total price** update automatically.
3. Enter the number of guests and any special request.
4. Tick the terms checkbox and submit.
5. A message shows your **booking reference** and total. Choose **OK** to pay now with the demo/sandbox payment (no real money is charged) and the booking becomes **confirmed**. Choose **Cancel** to keep the booking as **pending** and pay later.

Rules: check-in cannot be in the past, check-out must be after check-in, the guest count cannot exceed the room capacity, and a room cannot be booked twice for overlapping dates.

### 4.4 Manage your bookings
1. Click **My Bookings** in the menu.
2. Each booking shows its reference, room, dates, nights, total, payment status and booking status.
3. For a pending, unpaid booking click **Pay demo/sandbox** to pay and confirm it.
4. Click **Cancel** and enter a reason to cancel a booking. Bookings that have already started cannot be cancelled. A paid booking is marked **refunded** when cancelled.

### 4.5 Restaurant menu
Click **Explore Menu** on the home page (or go to `menu.html`) to view the Amour Restaurant menu.

### 4.6 Emails
If EmailJS is configured (see section 6), the system emails you when you register, create a booking, pay, and cancel a booking. Without EmailJS everything still works and the emails are simply skipped.

### 4.7 Admin manual
Log in with an admin account (for example the demo admin above). You are taken to the **Admin Dashboard**:
1. **Statistics** – total bookings, registered users and total revenue.
2. **Bookings** – view every guest booking and click **Cancel** to cancel one (you will be asked for a reason).
3. **Users** – view all registered users with their role and join date.
4. **Room Management** – add a new room (room number, name, type, price, capacity, amenities separated by commas), **Edit price** for an existing room, or **Delete** a room.

---

## 5. Main API routes

| Purpose | Routes |
|---|---|
| Users | `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/me` |
| Rooms | `GET /api/rooms` (filters: `checkIn`, `checkOut`, `type`, `minPrice`, `maxPrice`, `guests`, `amenity`); admin: `POST/PUT/DELETE /api/rooms/:id` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/mine`, `PATCH /api/bookings/:id/cancel` |
| Payments | `POST /api/payments/demo/:bookingId` |
| Admin | `GET /api/admin/dashboard`, `/api/admin/users`, `/api/admin/audit` |
| Emails | `GET /api/emails/status`, `/api/emails/mine`; admin: `GET /api/emails`, `POST /api/emails/:id/resend` |

---

## 6. EmailJS setup (optional)

Emails are sent from the **backend** using the EmailJS REST API when database events happen, and every attempt is stored in MongoDB (`emaillogs` collection).

1. Create a service and template at https://dashboard.emailjs.com/
2. Go to Account → Security and tick **Allow EmailJS API for non-browser applications** (otherwise Node requests get a 403).
3. In `backend/.env` fill in `EMAILJS_SERVICE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY` and `EMAILJS_TEMPLATE_BOOKING` (the other template IDs are optional and fall back to the booking template).
4. Restart the backend.

| Event | Email type |
|---|---|
| User registers | `welcome` |
| Booking created | `booking_created` |
| Payment succeeds | `payment_receipt` + `booking_confirmed` |
| Booking cancelled | `booking_cancelled` |

Template variables: `to_email`, `to_name`, `from_name`, `subject`, `user_name`, `booking_reference`, `room_name`, `room_number`, `room_type`, `check_in`, `check_out`, `nights`, `guests`, `total`, `status`, `payment_status`, `special_request`, `transaction_id`, `amount_paid`, `payment_method`, `paid_on`, `cancellation_reason`, `cancelled_at`.

If credentials are missing, nothing breaks: the email is logged with status `skipped`.

---

## 7. Payment

The included demo/sandbox payment completes the full booking/payment flow **without charging any money**, which is suitable for demonstration. No real payment-provider credentials are bundled. Never commit real credentials to the repository.

---

## 8. Project structure

```
Hotel_Booking_&_Reservation_System/
├── backend/        Express API (controllers, models, routes, middleware, services, seed.js, server.js)
├── frontend/       HTML pages, css/style.css and js/ scripts
├── database/       Database-related files
└── README.md
```
