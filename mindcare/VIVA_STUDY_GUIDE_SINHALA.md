# 🎓 MindCare – 2nd Semester Software Engineering & ORM Viva Guide
## විභාගයේදී (Viva) අහන ප්‍රශ්න සහ සම්පූර්ණ පිළිතුරු (Sinhala & English Study Guide)

> **💡 ශිෂ්‍යයාට උපදෙසක් (Student Tip):**  
> බය වෙන්න කිසිම දෙයක් නෑ! මේ project එක සම්පූර්ණයෙන්ම 2nd semester module එකකට ගැලපෙන standard MVC architecture එකෙන් හදලා තියෙන්නේ.  
> අනවශ්‍ය සංකීර්ණ (complex) libraries කිසිවක් නෑ. හැම file එකකම ඉතාම පැහැදිලි step-by-step comments දාලා තියෙනවා.  
> Examiner ප්‍රශ්නයක් අහපු ගමන් මේ guide එකේ තියෙන කරුණු සරලව කියන්න.

---

## 1. විනාඩි 1න් Project එක Examiner ට හඳුන්වා දෙන හැටි (Elevator Pitch)

Examiner: *"Can you briefly introduce your project?"*

### 🗣️ English වලින් කියන්න:
> "Sir/Madam, my project is **MindCare – Mental Health Therapy Center Management System**.  
> It is a 3-tier full-stack web application designed to digitalize mental wellness clinic operations.  
> - **Frontend:** Built with **React and Material-UI (MUI)**.  
> - **Backend:** Built using **Node.js and Express.js** as a RESTful API following MVC architecture.  
> - **Database:** Managed using **Sequelize ORM** connecting to MySQL and SQLite.  
> - **Security:** Implements **JWT (JSON Web Token)** authentication and **Role-Based Access Control (RBAC)** across 4 roles: **Admin, Therapist, Receptionist, and Patient**."

### 🇱🇰 Sinhala සරල අදහස (මතක තියාගන්න):
> MindCare කියන්නේ mental health clinic එකක් manage කරන්න හදපු full-stack web app එකක්.  
> Frontend එකට React + Material UI, Backend එකට Node.js + Express.js REST API, Database එකට Sequelize ORM, සහ Authentication වලට JWT tokens පාවිච්චි කළා.  
> මෙතන Roles 4ක් තියෙනවා: Admin, Therapist, Receptionist, සහ Patient.

---

## 2. System Architecture (Examiner ඇහුවොත් අඳින්න / කියන්න ඕන එක)

Examiner: *"Explain the architecture of your application."*

MindCare හැදුවේ **3-Tier Client-Server Architecture** එකක් විදියට:

```
┌────────────────────────────────────────────────────────┐
│  Tier 1: Presentation Layer (Frontend)                 │
│  - React 18, Vite, Material UI (MUI), Axios, Recharts  │
│  - Location: mindcare/frontend                         │
└──────────────────────────┬─────────────────────────────┘
                           │  HTTP / REST API (JSON)
                           │  Header: Authorization: Bearer <JWT>
                           ▼
┌────────────────────────────────────────────────────────┐
│  Tier 2: Business Logic / Application Layer (Backend)   │
│  - Node.js & Express.js                                │
│  - Routes (URL routing)                                │
│  - Middlewares (authMiddleware, roleMiddleware)        │
│  - Controllers (CRUD, Double-booking check, Logic)     │
│  - Location: mindcare/backend/src                      │
└──────────────────────────┬─────────────────────────────┘
                           │  Sequelize ORM Queries
                           │  (e.g., Appointment.create, User.findOne)
                           ▼
┌────────────────────────────────────────────────────────┐
│  Tier 3: Data Layer (Database)                         │
│  - Relational Database (MySQL / SQLite)                │
│  - 10 Relational Tables (Users, Patients, etc.)        │
└────────────────────────────────────────────────────────┘
```

---

## 3. MVC (Model - View - Controller) Architecture එක තියෙන්නේ කොහොමද?

Examiner: *"Did you use MVC architecture? Show me your Models, Views, and Controllers."*

| MVC Component | අපේ Project එකේ තියෙන තැන | කාර්යය (Purpose) |
|---|---|---|
| **Model** | `mindcare/backend/src/models/` | Database tables වල structure එක සහ relationships (`hasOne`, `belongsTo`, `hasMany`) define කිරීම. |
| **View** | `mindcare/frontend/src/pages/` | User ට පේන React components සහ UI screens (Material UI tables, forms, charts). |
| **Controller** | `mindcare/backend/src/controllers/` | Request එකක් ආවම business logic run කරලා, Database එකෙන් data අරන් JSON response එකක් යැවීම. |

👉 **Examiner ට පෙන්වන්න:**
- Model: `backend/src/models/index.js`
- Controller: `backend/src/controllers/appointmentController.js`
- View: `frontend/src/pages/management/AppointmentsPage.jsx`

---

## 4. Sequelize ORM එක ගැන අහන ප්‍රශ්න සහ උත්තර

### Q1. What is an ORM (Object-Relational Mapping)? Why did you use Sequelize?
- **English Answer:**  
  "An ORM maps relational database tables into object-oriented classes in JavaScript. We used Sequelize because:
  1. We don't have to write raw SQL strings like `SELECT * FROM Patients`. Instead, we write clean object methods like `Patient.findAll()`.
  2. It automatically prevents **SQL Injection** attacks by escaping query inputs.
  3. It allows us to define relationships easily (`hasMany`, `belongsTo`).
  4. It is database-agnostic—we can run on SQLite for testing and MySQL in production without changing application code."
- **Sinhala සරල අදහස:**  
  ORM එකෙන් කරන්නේ Database tables, JavaScript objects විදියට හැසිරවීමට ඉඩ දීම. Raw SQL ලියද්දි වෙන SQL injection වගේ bugs වළකිනවා. Code එක clean වෙනවා.

### Q2. How do you perform CRUD operations using Sequelize?
- **Create:** `const newPatient = await Patient.create({ fullName, phone, ... });`
- **Read (All):** `const patients = await Patient.findAll();`
- **Read (One by ID):** `const patient = await Patient.findByPk(id);`
- **Update:** `await patient.update({ phone: '0771234567' });`
- **Delete:** `await patient.destroy();`

### Q3. Explain your Database Relationships (Associations):
Examiner: *"Open your models file and explain your entity relationships."*  
👉 **File:** `backend/src/models/index.js` (Line 510)

1. **One-to-One (1:1):**
   - `User.hasOne(Patient)` & `Patient.belongsTo(User)`: එක් User account එකකට ඇත්තේ එක් Patient profile එකක් පමණි.
   - `User.hasOne(Therapist)` & `Therapist.belongsTo(User)`: එක් User account එකකට ඇත්තේ එක් Therapist profile එකක් පමණි.
   - `Appointment.hasOne(TherapySession)`: එක් Appointment එකකට අදාළ වන්නේ එක් Therapy Session record එකක් පමණි.
2. **One-to-Many (1:N):**
   - `Patient.hasMany(Appointment)` & `Appointment.belongsTo(Patient)`: එක් Patient කෙනෙකුට Appointments කිහිපයක් තිබිය හැක.
   - `Therapist.hasMany(Appointment)`: එක් Therapist කෙනෙකුට විවිධ රෝගීන්ගේ Appointments කිහිපයක් තිබිය හැක.
   - `Patient.hasMany(Payment)`: එක් රෝගියෙකුට Payment receipts කිහිපයක් තිබිය හැක.

---

## 5. Authentication & Security (JWT & Password Hashing)

Examiner: *"Explain step-by-step how authentication works from login to accessing a protected route."*

👉 **පියවර 5න් කියන්න (5 Steps to explain):**

1. **Password Hashing (Bcrypt):**  
   - Register වෙද්දි සහ User create වෙද්දි plain text password database එකේ save කරන්නේ නෑ.  
   - `bcryptjs` මගින් salt rounds 10ක් යොදා hash කරලයි save කරන්නේ (`backend/src/models/index.js` hooks).
2. **Login & Verification:**  
   - User `email/username` සහ `password` submit කරාම `authController.login` එකෙන් `User.findOne` මගින් user ව හොයනවා.  
   - `bcrypt.compare()` මගින් enter කල password එක hash එක සමග match වෙනවද බලනවා.
3. **Token Generation:**  
   - Password හරි නම්, server එකෙන් `jwt.sign()` මගින් JSON Web Token (JWT) එකක් generate කරලා client ට දෙනවා. Token එක ඇතුළේ `{ id, username, role }` තියෙනවා.
4. **Client Storage & Axios Interceptor:**  
   - React frontend එක මේ token එක `localStorage` එකේ save කරගන්නවා (`mindcare_token`).  
   - `frontend/src/api/axios.js` එකේ තියෙන Axios Request Interceptor එකෙන්, frontend එකෙන් backend එකට යන හැම request එකකම Header එකට `Authorization: Bearer <token>` auto attach කරනවා.
5. **Route Protection (authMiddleware.js):**  
   - Request එකක් ආවම backend එකේ `authMiddleware.js` මගින් `jwt.verify()` කරලා token එක valid ද බලලා, valid නම් user object එක `req.user` එකට දාලා controller එකට යවනවා. Valid නැත්නම් `401 Unauthorized` දෙනවා.

---

## 6. Business Logic: Double-Booking Prevention (විශේෂයෙන් අහන ප්‍රශ්නයක්!)

Examiner: *"How did you prevent two patients from booking the same therapist at the same time?"*

👉 **File to show:** `backend/src/controllers/appointmentController.js` (inside `createAppointment`)

```javascript
// Check if therapist already has an appointment on that date and time slot
const conflictingAppointment = await Appointment.findOne({
  where: {
    therapistId,
    date,
    timeSlot,
    status: { [Op.notIn]: ['Cancelled'] }, // Ignore cancelled appointments
  },
});

if (conflictingAppointment) {
  return res.status(409).json({
    success: false,
    message: 'This therapist already has an appointment scheduled for this date and time slot.',
  });
}
```

- **English Answer:**  
  "Before creating any appointment record, we run a query against the `Appointment` table with the requested `therapistId`, `date`, and `timeSlot`. We exclude 'Cancelled' appointments. If a record is found, we return an HTTP `409 Conflict` status code and stop execution."
- **Sinhala සරල අදහස:**  
  Appointment එකක් save කරන්න කලින් database එකෙන් check කරනවා ඒ therapist ට ඒ දවසේ ඒ time slot එකේ cancel නොවූ appointment එකක් තියෙනවද කියලා. තිබුණොත් `409 Conflict` error එකක් දෙනවා.

---

## 7. Frontend Architecture (React, State, Props & Hooks)

Examiner: *"Explain how React works in your frontend."*

### Q1. What React Hooks did you use?
1. **`useState`**: Component එකක local data (state) store කරගන්න (e.g., `const [patients, setPatients] = useState([])`).
2. **`useEffect`**: Page එක load වෙද්දි backend REST API එකෙන් data fetch කරගන්න (Side-effects).
3. **`useContext`**: App එක පුරාම login user ගේ විස්තර prop drilling නැතුව share කරගන්න (`useAuth()`).
4. **`useNavigate`**: Code එකෙන් page redirect කරන්න (e.g., Login උනාට පස්සේ Dashboard එකට redirect වීම).
5. **`useParams`**: URL එකේ තියෙන ID එක ගන්න (e.g., `/patients/:id` එකේ `id` එක).

### Q2. What is the difference between State and Props?
- **State:** Component එක ඇතුළේ වෙනස් වෙන local data (උදා: user form එකේ type කරන data).
- **Props (Properties):** Parent component එකකින් Child component එකකට pass කරන data/functions (උදා: `<Navbar user={user} onLogout={handleLogout} />`).

---

## 8. HTTP Status Codes (Examiner අහන කෙටි ප්‍රශ්න)

| Code | Name | අපේ Project එකේ පාවිච්චි වන තැන |
|---|---|---|
| **200** | OK | Data සාර්ථකව ලබාගැනීම හෝ update කිරීම (`GET`, `PUT`). |
| **201** | Created | අලුත් record එකක් database එකේ create වීම (`POST /patients`, `POST /appointments`). |
| **400** | Bad Request | Form එකේ required fields නොමැති වීම, past dates තේරීම. |
| **401** | Unauthorized | Login වී නැති වීම, JWT token එක missing හෝ expired වීම. |
| **403** | Forbidden | Token එක valid නමුත් එම role එකට අදාළ page එකට access නොමැති වීම. |
| **404** | Not Found | සොයන ID එකට අදාළ patient/appointment record එක නොමැති වීම. |
| **409** | Conflict | Therapist ට එම වේලාවේ වෙනත් appointment එකක් තිබීම (Double-booking). |
| **500** | Internal Server Error | Server එකේ unexpected error එකක් ඇතිවීම. |

---

## 9. Examiner ඉස්සරහා Demo එක Run කරලා පෙන්වන පිළිවෙළ

1. **System එක Start කරන්න:**
   - Backend එක run වෙනවා: `http://localhost:5000` (Terminal 1)
   - Frontend එක run වෙනවා: `http://localhost:5173` (Terminal 2)
2. **Browser එකේ `http://localhost:5173` Open කරන්න.**
   - ලස්සන Healthcare Landing Page එක පෙන්වන්න.
   - උඩින් තියෙන **"24/7 Mental Health Crisis Lifeline: 1926"** banner එක සහ Modern UI එක පෙන්වන්න.
3. **"Sign In" Click කරන්න (`/login`):**
   - මෙතන තියෙන **"1-Click Fast Login"** buttons 4 පෙන්වන්න:
     - **Admin** click කරලා සම්පූර්ණ Clinic Overview, Statistics Charts (Recharts), Revenue Summary පෙන්වන්න.
     - **Appointments** page එකට ගිහින් අලුත් appointment එකක් book කරලා පෙන්වන්න.
     - **Patients** page එකට ගිහින් රෝගියෙක්ගේ Comprehensive 360° Profile එක (Medical history, Clinical notes, Sessions) පෙන්වන්න.
     - **Therapist** විදියට switch වෙලා clinical notes ලියන හැටි පෙන්වන්න.

---

## 10. Examiner කියන Files Screen එකේ Open කරන්නේ කොහොමද? (Cheatsheet)

| Examiner ඉල්ලන දේ: | Open කළ යුතු File එක: |
|---|---|
| **Database Connection & Configuration** | `backend/src/config/database.js` |
| **Database Tables, Schemas & Associations** | `backend/src/models/index.js` |
| **JWT Token Protection Middleware** | `backend/src/middleware/authMiddleware.js` |
| **Role-based Access Guard** | `backend/src/middleware/roleMiddleware.js` |
| **Double-booking Prevention & Appointment Logic** | `backend/src/controllers/appointmentController.js` |
| **Login & Register Controller** | `backend/src/controllers/authController.js` |
| **REST API Routes** | `backend/src/routes/appointmentRoutes.js` |
| **Frontend API Call (Axios interceptor)** | `frontend/src/api/axios.js` සහ `frontend/src/api/index.js` |
| **Global Auth State (React Context)** | `frontend/src/context/AuthContext.jsx` |
| **Main App Routes** | `frontend/src/App.jsx` |

---
**Good Luck for your Viva! විශ්වාසයෙන් උත්තර දෙන්න, ඔබ අනිවාර්යයෙන්ම A+ එකක් ගන්නවා!** 🚀
