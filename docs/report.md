# NGO Dashboard – Architecture Report

## System Architecture
- Client: Next.js frontend (App Router). Handles authentication, dashboard UI, filters, CSV export.
- Server: Express.js REST API. Handles auth, donations, admin endpoints, and Razorpay integration.
- Database: MongoDB via Mongoose. Persists users and donations.
- Auth: JWT tokens; role-based access control (admin vs user).
- Data Flow:
  - Registration/Login: Client -> Auth API -> JWT issued -> Client stores and uses for subsequent requests.
  - Donation: Client requests order -> Server creates Razorpay order -> Client completes payment -> Server verifies signature and records donation.
  - Admin: Client fetches users and donations -> Server aggregates and returns data.

## Database Schema (ER)
```
User
- _id (ObjectId)
- name (String)
- email (String, unique)
- password (String, hashed)
- phone (String)
- role (Enum: user|admin, default user)
- createdAt (Date)

Donation
- _id (ObjectId)
- user (ObjectId -> User, required)
- provider (Enum: razorpay|payhere, default razorpay)
- amount (Number, required)
- currency (String, default INR)
- paymentStatus (Enum: pending|success|failed, default pending)
- razorpayOrderId (String)
- razorpayPaymentId (String)
- transactionDate (Date, default now)
- campaign (String, default "General Fund")

Relationship:
User 1 --- * Donation
```

## Flow Diagrams (Textual)
- Registration/Login
  - User enters details -> Client POST /auth/register
  - Server creates user, returns JWT -> Client stores token
  - Login uses POST /auth/login -> Server returns JWT + role

- Donation Flow (Razorpay)
  - Client POST /donations/create-order (auth required)
  - Server creates order with Razorpay SDK, returns orderId
  - Client completes payment (Razorpay Checkout)
  - Client POST /donations/verify-payment with ids + signature
  - Server verifies HMAC, records donation, sets status=success

- Admin Dashboard Data
  - Client GET /admin/users and /admin/donations (auth admin)
  - Server returns arrays; client computes metrics and filters

## Key Design Decisions
- Next.js App Router for modern React features and routing.
- Express.js for straightforward REST APIs with middleware.
- MongoDB for schema flexibility; Mongoose for validation and relations.
- JWT-based auth for stateless scalability; role checks enforced on server.
- Razorpay chosen for reliability and India-focused payments.
- Client-side filters for flexibility and responsiveness; CSV export built client-side.

## Assumptions
- Razorpay runs in sandbox/test mode for local development.
- Environment variables configured in server/.env and client/.env.local.
- Passwords salted/hashed (bcryptjs).
- Admin role assigned via registration or seed; non-admins redirected away from admin routes.
- Network: Client at localhost:3000; Server at localhost:5000.

## Export to PDF
- Open this file in the IDE preview or any Markdown viewer.
- Use “Print” and select “Save as PDF” to generate a 2–3 page report.

---

## Environments & Configuration
- Development: Client on http://localhost:3000, Server on http://localhost:5000
- Environment Variables (server):
  - MONGO_URI: MongoDB connection string
  - PORT: API port (default 5000)
  - JWT_SECRET: Strong secret for signing tokens
  - RAZORPAY_KEY_ID: Razorpay test/live key
  - RAZORPAY_KEY_SECRET: Razorpay secret
  - Note: PayHere variables exist in .env.example but are not used in the current Razorpay-only flow.
- Environment Variables (client):
  - NEXT_PUBLIC_PAYMENT_PROVIDER=razorpay

## API Reference (Summary)
- Base: /api

- Auth
  - POST /auth/register
    - Body: { name, email, password, phone, role? }
    - Response: { token, role, name, email }
  - POST /auth/login
    - Body: { email, password }
    - Response: { token, role, name, email }
  - GET /auth/me
    - Auth: Bearer JWT
    - Response: { _id, name, email, phone, role }

- Donations
  - POST /donations/create-order
    - Auth: Bearer JWT
    - Body: { amount, campaign }
    - Response: { id, amount, currency, ... } (Razorpay order)
  - POST /donations/verify-payment
    - Auth: Bearer JWT
    - Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, campaign }
    - Response: { message: "Payment verified", donationId }
  - POST /donations/mark-failed
    - Auth: Bearer JWT
    - Body: { orderId }
    - Response: { message }
  - GET /donations/my
    - Auth: Bearer JWT
    - Response: Donation[]
  - GET /donations/all
    - Auth: Bearer JWT (admin)
    - Response: Donation[]
  - GET /donations/export
    - Auth: Bearer JWT
    - Response: CSV stream or data for export

- Admin
  - GET /admin/users
    - Auth: Bearer JWT (admin)
    - Response: User[]
  - GET /admin/donations
    - Auth: Bearer JWT (admin)
    - Response: Donation[]

## Sequence Details
- Auth Register/Login
  1. Client posts credentials to /auth endpoints
  2. Server validates, hashes/stores password (register), compares hash (login)
  3. Server issues JWT containing user id and role
  4. Client stores JWT; subsequent requests include Authorization header

- Donation Verify
  1. Client requests order from server (create-order)
  2. Server calls Razorpay, returns orderId
  3. Client completes payment via Razorpay Checkout
  4. Client posts payment ids + signature to /verify-payment
  5. Server validates HMAC(body=orderId|paymentId, secret=RAZORPAY_KEY_SECRET)
  6. On success, server writes Donation with status=success

- Admin Data Fetch
  1. Client calls /admin/users and /admin/donations in parallel
  2. Server returns arrays; client computes totals, status counts, filters
  3. Client renders metrics and tables, supports CSV export

## Security
- Passwords hashed using bcryptjs; JWT signed with strong secret
- Role-based middleware:
  - protect: validates token, attaches user to req
  - admin: checks user.role === 'admin'
- CORS: Enabled for client origin during development
- Input Validation: Basic server-side validation via Mongoose and controllers
- Secrets: Never commit real keys; use .env files

## Error Handling & Logging
- HTTP status codes:
  - 200 OK for successful operations
  - 400/401/403 for validation/auth failures
  - 500 for unhandled server errors
- Error payloads typically shaped as { message, details? }
- Logging: Console logs during development; can integrate winston for structured logging

## Performance & Scalability
- Client uses Promise.all to fetch admin datasets concurrently
- Consider MongoDB indexes:
  - User: email (unique), createdAt
  - Donation: user, paymentStatus, transactionDate
- Pagination:
  - Client-side pagination implemented; for large datasets, move to server-side pagination with query params (page, pageSize)
- Exports:
  - CSV built on client; for very large exports, implement streaming CSV on server
- Horizontal scaling:
  - Stateless JWT supports scaling API behind a load balancer

## Testing Strategy
- Manual API test: server/test_script.js exercises register/login, create-order, verify-payment, admin fetch
- Suggested automated tests:
  - Unit tests for controllers/middleware
  - Integration tests for auth and donation flows (mock Razorpay SDK)
  - UI tests for admin dashboard filters and exports

## Deployment
- Server:
  - Run node index.js or pm2 start index.js
  - Configure environment variables and MONGO_URI pointing to managed MongoDB (Atlas)
  - Enable HTTPS and secure CORS
- Client:
  - Build with next build; serve with next start or deploy to Vercel
  - Configure NEXT_PUBLIC_PAYMENT_PROVIDER and API base URL

## Future Enhancements
- Server-side pagination and sorting for users/donations
- Role management UI for promoting/demoting users
+- Dashboard charts for donations over time
+- Webhooks for Razorpay to confirm payments asynchronously
+- Email notifications for donation receipts
+- Audit logging and admin activity tracking

## Glossary
- JWT: JSON Web Token, stateless auth mechanism
- HMAC: Hash-based message authentication code used for signature verification
- CORS: Cross-Origin Resource Sharing, browser security feature
- CSV: Comma-Separated Values, simple tabular export format
- SDK: Software Development Kit (e.g., Razorpay)

## Constraints & Assumptions
- Database consistency depends on successful signature verification from Razorpay
- Users must be authenticated to create orders; only admins can access admin endpoints
- In development, test credentials and keys are used; production must use secure secrets and HTTPS
