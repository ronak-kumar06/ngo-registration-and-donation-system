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

## Notes
- **Connection Issues**: If `net::ERR_CONNECTION_REFUSED` occurs on localhost:3000, try restarting the client development server.
- **Environment**: Ensure `.env` files are correctly set up in both client and server directories.

---