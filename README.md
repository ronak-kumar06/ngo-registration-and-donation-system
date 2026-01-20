# NGO Dashboard Project

## Overview
A web application for managing NGO donations and user registrations. The project consists of a Next.js frontend and an Express/Node.js backend.

## Recent Updates (Jan 2026)

### 1. Payment Integration
- **Razorpay Only**: Removed all references to "PayHere" to streamline the payment flow.
- Updated `client/.env.local` to set `NEXT_PUBLIC_PAYMENT_PROVIDER=razorpay`.
- Cleaned up unused variables in `client/app/dashboard/user/page.tsx` and `client/app/dashboard/user/transactions/page.tsx`.

### 2. Admin Dashboard (`/dashboard/admin`)
- **Layout**: Adopted "Layout A" (Sidebar navigation) and removed "Layout B" options.
- **New Features**:
  - **Overview**: Added a dedicated "Dashboard" tab in the sidebar showing key metrics:
    - Total Registrations
    - Total Donations
    - Recent activity stats
  - **User Management**:
    - View all registered users.
    - Filter by Role (Admin/User) and Registration Date.
    - Export user data to CSV.
  - **Donation Management**:
    - View all donation records.
    - Filter by Status (Completed/Pending/Failed) and Date.
    - Export donation data to CSV.
  - **Logout**: Added a functional Logout button at the bottom of the sidebar.

### 3. Backend Enhancements
- Created `adminController.js` to handle admin-specific data fetching (`/admin/users`, `/admin/donations`).
- Implemented `Promise.all` in the frontend to efficiently fetch dashboard data.
- Secured admin routes with role-based checks.

## Project Structure

### Client (`/client`)
- **Framework**: Next.js 15 (App Router)
- **Key Files**:
  - `app/dashboard/admin/page.tsx`: Main Admin Dashboard logic (Metrics, Tables, Export).
  - `context/AuthContext.tsx`: Authentication state and Logout logic.
  - `utils/api.ts`: Axios instance for backend communication.

### Server (`/server`)
- **Framework**: Express.js
- **Key Files**:
  - `controllers/adminController.js`: Logic for fetching users and donations.
  - `routes/admin.js`: Routes for admin endpoints.
  - `index.js`: Server entry point.

## Getting Started

1. **Server**:
   ```bash
   cd server
   npm install
   npm start
   # Runs on http://localhost:5000
   ```

2. **Client**:
   ```bash
   cd client
   npm install
   npm run dev
   # Runs on http://localhost:3000
   ```
### Demo Credentials (For Testing Only)

- **Admin**
  - Email: admin@ngo.com
  - Password: admin123

- **User**
  - Email: ronak@gmail.com
  - Password: ronak123

- Important
  - These accounts are for local/dev testing only; do not use in production.
  - If they do not exist in your database, register them via the app.
  - Change these passwords immediately when deploying publicly.
  - Do not commit real credentials or API keys to the repository.

## Tech Stack
- Frontend: Next.js 15 (App Router)
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Payments: Razorpay (Sandbox)

---
## Features
- Admin Overview: Total registrations; total donations; status counts
- User Management: View users; filter by role/date; CSV export
- Donation Management: View records; filter by status/date; CSV export
- Authentication: JWT-based login/logout; role-based access control
- Payments: Razorpay integration for creating and verifying orders
- Responsive UI: Sidebar navigation with Dashboard, Donors, Donations

## Folder Structure
```
ngo_dashboard/
├─ client/               # Next.js frontend
│  ├─ app/               # App Router pages
│  ├─ context/           # Auth context
│  ├─ utils/             # API client
│  └─ public/            # Static assets
├─ server/               # Express backend
│  ├─ controllers/       # Route controllers
│  ├─ routes/            # Express routes
│  ├─ models/            # Mongoose schemas
│  └─ middleware/        # Auth middleware
└─ docs/                 # Project documentation
```

## Report
- A detailed architecture report is available at docs/report.md.
- Export to PDF using your browser’s “Print to PDF”.
