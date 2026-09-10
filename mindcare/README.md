# MindCare – Mental Health Therapy Center Management System

> **Tagline:** *"Supporting Better Mental Wellness Through Connected Care"*

MindCare is a modern, full-stack mental health therapy center management system engineered from scratch for university software engineering capstone evaluations. It delivers role-based clinical practice automation, appointment scheduling, confidential psychotherapy session records, treatment milestone tracking, and transparent patient billing.

---

## 🌟 Key System Capabilities

- **Role-Based Access Control (RBAC):** Dedicated views and permissions for **Admin**, **Therapist**, **Receptionist**, and **Patient**.
- **Double-Booking Prevention:** Intelligent validation preventing scheduling overlaps across clinicians and time slots.
- **Confidential Clinical Privacy:** Dual-layer note protection—private clinical notes (MSE, diagnoses, CBT formulations) are visible exclusively to clinicians, while patients receive encouraging summaries, behavioral goals, and homework takeaways.
- **Treatment Milestone Tracking:** Dynamic milestone progress bars, session quotas, and customizable behavioral targets.
- **Billing & Invoicing:** Digital payment processing (Card, Cash, Bank Transfer), automated receipt generation, and gross clinic revenue summaries.
- **24/7 Crisis Intervention Banner:** Prominently placed national crisis hotline (`1926`) and emergency intake resources on all public and authenticated interfaces.
- **1-Click Demo Evaluation Switcher:** Evaluators can switch between **Admin**, **Therapist**, **Receptionist**, and **Patient** in a single click on the login screen or top navigation bar.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Material UI (MUI v5/v6), React Router v6, Axios, Recharts |
| **Backend** | Node.js, Express.js, REST API architecture |
| **Database & ORM** | Sequelize ORM with dual-engine support (**MySQL** & **SQLite**) |
| **Security & Auth** | JSON Web Tokens (JWT), BCrypt password hashing, Role Middleware |

---

## 👥 Demo Accounts (Credentials)

| Role | Username / Email | Password | Access Highlights |
|---|---|---|---|
| **Admin** | `admin@mindcare.com` | `Admin@123` | Full system control, financial revenue charts, user management |
| **Therapist** | `therapist@mindcare.com` | `Therapist@123` | Clinical session notes, assigned patient charts, treatment plans |
| **Receptionist** | `receptionist@mindcare.com` | `Reception@123` | Daily patient check-in, appointments scheduling, payment collection |
| **Patient** | `patient@mindcare.com` | `Patient@123` | Book consultations, view progress, homework tasks, billing receipts |

*(Note: 1-Click login buttons are also available on the Login screen for instant access!)*

---

## 📁 Project Structure

```
mindcare/
├── backend/
│   ├── src/
│   │   ├── config/          # Sequelize database connection & engine fallback
│   │   ├── controllers/     # Auth, Patient, Therapist, Appointment, Session, TreatmentPlan, Payment, Dashboard
│   │   ├── middleware/      # JWT verification, Role authorization, Centralized error handling
│   │   ├── models/          # Sequelize relational models & associations
│   │   ├── routes/          # RESTful Express route definitions
│   │   ├── seeders/         # Realistic clinical demo seeder script
│   │   └── app.js           # Server entry point
│   ├── .env                 # Environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & unified API service methods
│   │   ├── components/      # Navbar, Footer, Sidebar, DashboardHeader
│   │   ├── context/         # AuthContext (JWT & state management)
│   │   ├── layouts/         # PublicLayout & DashboardLayout
│   │   ├── pages/           # Public pages, Dashboards, and Management modules
│   │   ├── theme/           # MUI Custom Teal Healthcare Theme
│   │   ├── App.jsx          # Route hierarchy
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
└── README.md
```

---

## 🚀 Installation & Running Locally

### Prerequisites
- **Node.js** (v18+ or v20+)
- **npm** (v9+ or v10+)
- *(Optional)* **MySQL** (If using MySQL mode; SQLite works with zero setup)

### 1. Backend Setup

```bash
cd mindcare/backend

# Install dependencies
npm install

# Seed the database with demo clinical data
npm run seed

# Start backend server
npm start
```
*The backend API will start on **http://localhost:5000** (Health Check: `http://localhost:5000/api/health`).*

### 2. Frontend Setup

```bash
cd mindcare/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*The web application will open on **http://localhost:5173**.*

---

## 🗄️ Database Configuration (MySQL vs SQLite)

MindCare is configured by default with **SQLite** for **instant, zero-friction execution** with pre-seeded demo records.

To switch to **MySQL**:
1. Open `mindcare/backend/.env`.
2. Change:
   ```env
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=mindcare_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   ```
3. Run `npm run seed` in `backend` to automatically create the `mindcare_db` database and sync tables.

---

## 📡 REST API Documentation

### Authentication
- `POST /api/auth/register` — Register a new patient account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve authenticated user profile
- `PUT /api/auth/profile` — Update user credentials or avatar

### Patients (`/api/patients`)
- `GET /api/patients` — List patients with search & pagination (Staff only)
- `GET /api/patients/:id` — Get comprehensive 360-degree patient chart profile
- `POST /api/patients` — Register patient record
- `PUT /api/patients/:id` — Update patient medical history or personal info
- `DELETE /api/patients/:id` — Deactivate patient record

### Therapists (`/api/therapists`)
- `GET /api/therapists` — List licensed clinicians
- `GET /api/therapists/:id` — Get single therapist profile & availability
- `POST /api/therapists` — Add new clinician (Admin only)
- `PUT /api/therapists/:id` — Update clinician rates/specializations
- `DELETE /api/therapists/:id` — Deactivate therapist

### Appointments (`/api/appointments`)
- `GET /api/appointments` — List appointments filtered by role/date
- `GET /api/appointments/:id` — Get appointment details
- `POST /api/appointments` — Book appointment (Double-booking protected)
- `PUT /api/appointments/:id` — Reschedule or update status
- `DELETE /api/appointments/:id` — Cancel appointment

### Clinical Sessions (`/api/sessions`)
- `GET /api/sessions` — List sessions (Clinical notes sanitized for patients)
- `POST /api/sessions` — Record therapy notes & mark appointment completed
- `PUT /api/sessions/:id` — Update clinical notes

### Treatment Plans (`/api/treatment-plans`)
- `GET /api/treatment-plans` — List treatment plans
- `POST /api/treatment-plans` — Formulate treatment plan with milestones
- `PUT /api/treatment-plans/:id` — Update progress percentage & goals

### Payments & Invoicing (`/api/payments`)
- `GET /api/payments` — List payments & receipts
- `GET /api/payments/summary` — Get clinic revenue analytics
- `POST /api/payments` — Record consultation payment
- `PUT /api/payments/:id` — Update invoice status

### Dashboard (`/api/dashboard/statistics`)
- `GET /api/dashboard/statistics` — Real-time metrics tailored to authenticated role

---

## 🔒 Security & Medical Ethics Measures
- Passwords salted and hashed with **bcryptjs** (10 salt rounds).
- Protected API routes verified via standard **Bearer JWT authorization**.
- Role authorization middleware prevents unauthorized access across tiers.
- Front-desk receptionists can access logistics without accessing confidential clinical psychotherapy notes.
- Double-booking prevention algorithm validates against non-cancelled records.

---

## 👩‍💻 Author & Developer Information
- **Developer:** Himadi Yenushka De Silva
- **GitHub Profile:** [@syenushka-wq](https://github.com/syenushka-wq)
- **Contact Email:** syenushka@gmail.com
- **Institution:** Institute of Java and Software Engineering (IJSE)

---

## 🎓 Academic Software Engineering Project Notice
*MindCare was designed, architected, and implemented by Himadi Yenushka De Silva as an academic capstone web application demonstrating clean tiered architecture, robust RESTful APIs, relational ORM modeling, and modern responsive healthcare UX design.*

