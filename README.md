# Amour Hotel Booking & Reservation System

Full-stack course project matching the supplied requirements: Node.js/Express backend, MongoDB/Mongoose data modelling, JWT + bcrypt authentication and roles, room CRUD, date/amenity/type/price filtering, real overlap prevention, booking history/cancellation, payment records, audit logs, admin dashboard and EmailJS confirmation hook.

## Run
1. Install MongoDB Community Server and start MongoDB.
2. `cd backend`
3. Copy `.env.example` to `.env` and change `JWT_SECRET`.
4. `npm install`
5. `npm run seed` (creates sample rooms and demo superuser)
6. `npm start`
7. Serve the `frontend` folder with VS Code Live Server (for example http://127.0.0.1:5500).

Demo superuser after seeding: `admin@amourhotel.com` / `Admin123!` (change it for any real deployment).

## EmailJS
Set `frontend/js/emailjs-config.js` with your EmailJS public key, service ID and template ID. Booking confirmations are sent after successful payment. The booking flow remains functional if these are blank.

## Payment
The included demo/sandbox payment endpoint completes the entire booking/payment state flow without charging money, which is suitable for classroom demonstration. Provider credentials are intentionally not bundled in the project. If your evaluator requires live SSLCommerz processing, put sandbox credentials in `.env` and replace/extend the demo endpoint with the provider call; never commit credentials.

## Important API routes
- POST `/api/users/register`, POST `/api/users/login`, GET `/api/users/me`
- GET `/api/rooms` with `checkIn`, `checkOut`, `type`, `minPrice`, `maxPrice`, `guests`, `amenity` filters
- Admin: POST/PUT/DELETE `/api/rooms/:id`
- POST `/api/bookings`, GET `/api/bookings/mine`, PATCH `/api/bookings/:id/cancel`
- POST `/api/payments/demo/:bookingId`
- Admin: GET `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/audit`

---

## EmailJS integration (database-connected)

Emails are sent from the **backend** using the EmailJS REST API, triggered by real
database events, and every attempt is stored in MongoDB.

**Files added**
- `backend/services/emailService.js` – EmailJS REST client + event helpers
- `backend/models/EmailLog.js` – `emaillogs` collection (one doc per send)
- `backend/controllers/emailController.js`, `backend/routes/emailRoutes.js`

**Triggers**

| Event | Controller | Email type |
|---|---|---|
| User registers | `userController.register` | `welcome` |
| Booking created | `bookingController.create` | `booking_created` |
| Demo payment succeeds | `paymentController.demoPay` | `payment_receipt` + `booking_confirmed` |
| Booking cancelled | `bookingController.cancel` | `booking_cancelled` |

**Endpoints**

| Method | Route | Access |
|---|---|---|
| GET | `/api/emails/status` | public |
| GET | `/api/emails/mine` | guest |
| GET | `/api/emails?status=failed&type=welcome&page=1` | admin |
| POST | `/api/emails/:id/resend` | admin |
| POST | `/api/emails/booking/:bookingId` body `{ "type": "booking_confirmed" }` | admin |

**Setup**
1. Create a service + template at https://dashboard.emailjs.com/
2. Account → Security → tick **Allow EmailJS API for non-browser applications**
   (without this the API returns 403 for requests from Node).
3. Copy `.env.example` to `.env` and fill in `EMAILJS_SERVICE_ID`,
   `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`, `EMAILJS_TEMPLATE_BOOKING`.
4. `npm start` (Node 18+ required — uses the built-in `fetch`).

**Template variables available:** `to_email`, `to_name`, `from_name`, `subject`,
`user_name`, `booking_reference`, `room_name`, `room_number`, `room_type`,
`check_in`, `check_out`, `nights`, `guests`, `total`, `status`, `payment_status`,
`special_request`, `transaction_id`, `amount_paid`, `payment_method`, `paid_on`,
`cancellation_reason`, `cancelled_at`.

If the credentials are missing, nothing breaks — the send is recorded with
status `skipped` and the booking flow continues normally.
