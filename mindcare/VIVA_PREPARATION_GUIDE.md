# MindCare – 2nd Semester Software Engineering Viva Guide
## විභාගයේදී (Viva) අහන ප්‍රශ්න සහ පිළිතුරු (Sinhala & English Explanation)

---

## 1. System Overview in 30 Seconds (Examiner ට කෙටියෙන් කියන්න)

> **English:**  
> "MindCare is a 3-tier, full-stack Mental Health Therapy Center Management System. The frontend is built using **React, Vite, and Material-UI**, the backend uses **Node.js with Express.js** following RESTful API principles, and the database persistence is managed via **Sequelize ORM** supporting MySQL and SQLite. It provides Role-Based Access Control for four user roles: **Admin, Therapist, Receptionist, and Patient**."

> **Sinhala සරල තේරුම:**  
> "MindCare කියන්නේ Mental Health Therapy Center එකක් manage කරන්න හදපු full-stack web application එකක්. Frontend එකට React + Material UI පාවිච්චි කළා. Backend එක Node.js + Express.js වලින් REST API එකක් විදියට හැදුවා. Database එකට Sequelize ORM පාවිච්චි කරලා තියෙනවා. මෙතන User Roles 4ක් තියෙනවා: Admin, Therapist, Receptionist, සහ Patient."

---

## 2. System Architecture (3-Tier Architecture)

Examiner ඇහුවොත්: *"Explain your application architecture"*

```
[ Tier 1: Presentation Layer (Frontend) ]
   React 18 + Vite + Material-UI (MUI) + React Router v6
   Location: mindcare/frontend
            │
            ▼ (HTTP / JSON via Axios with JWT Bearer Token)
[ Tier 2: Application / Business Logic Layer (Backend) ]
   Node.js + Express.js REST API
   - Routes (authRoutes, patientRoutes, appointmentRoutes, etc.)
   - Middlewares (authMiddleware, roleMiddleware, errorMiddleware)
   - Controllers (Business logic, validation, double-booking check)
   Location: mindcare/backend/src
            │
            ▼ (Object-Relational Mapping via Sequelize)
[ Tier 3: Data Layer (Database) ]
   Sequelize ORM -> MySQL / SQLite Database
   Tables: Users, Patients, Therapists, Services, Appointments,
           TherapySessions, TreatmentPlans, Payments, Notifications
```

---

## 3. Database Entities & Relationships (ER Diagram එක ගැන අහන දේවල්)

Examiner: *"Show me your database relationships in code."*  
👉 **File to open:** `backend/src/models/index.js` (Line 520 onwards)

| Relationship | Type | How it is defined in Sequelize | Explanation |
|---|---|---|---|
| **User ↔ Patient** | One-to-One (1:1) | `User.hasOne(Patient)`<br>`Patient.belongsTo(User)` | Each login user account can link to one patient profile. |
| **User ↔ Therapist** | One-to-One (1:1) | `User.hasOne(Therapist)`<br>`Therapist.belongsTo(User)` | A therapist login links to a clinician record. |
| **Patient ↔ Appointment** | One-to-Many (1:N) | `Patient.hasMany(Appointment)`<br>`Appointment.belongsTo(Patient)` | One patient can book multiple appointments over time. |
| **Therapist ↔ Appointment** | One-to-Many (1:N) | `Therapist.hasMany(Appointment)`<br>`Appointment.belongsTo(Therapist)` | One therapist can have multiple scheduled appointments. |
| **Appointment ↔ Session** | One-to-One (1:1) | `Appointment.hasOne(TherapySession)`<br>`TherapySession.belongsTo(Appointment)` | An appointment results in exactly one clinical therapy session record. |
| **Patient ↔ TreatmentPlan** | One-to-Many (1:N) | `Patient.hasMany(TreatmentPlan)`<br>`TreatmentPlan.belongsTo(Patient)` | A patient can have multi-week treatment plans. |
| **Patient ↔ Payment** | One-to-Many (1:N) | `Patient.hasMany(Payment)`<br>`Payment.belongsTo(Patient)` | A patient has multiple billing payment receipts. |

---

## 4. End-to-End Request Flow (Request එකක් වැඩ කරන්නේ කොහොමද?)

Examiner: *"Trace a request. When a patient clicks 'Book Appointment', what happens behind the scenes?"*

1. **Frontend Trigger:** Patient selects Therapist, Date, and Time Slot in `AppointmentsPage.jsx` and clicks "Confirm Schedule".
2. **Axios Call:** Frontend calls `appointmentService.create(formData)` in `api/index.js`, sending a `POST /api/appointments` HTTP request.
3. **JWT Attached:** Axios interceptor in `api/axios.js` automatically attaches `Authorization: Bearer <token>` in the request header.
4. **Route Dispatch:** Express router `backend/src/routes/appointmentRoutes.js` intercepts the request.
5. **Auth Middleware:** `authMiddleware.js` verifies the JWT token with `jwt.verify()` and checks if the user's account is Active.
6. **Role Middleware:** `roleMiddleware.js` checks if the role (`Patient`, `Admin`, `Receptionist`) is allowed.
7. **Controller Logic:** `appointmentController.js -> createAppointment()` executes:
   - Validates that date is not in the past (`date >= today`).
   - **Double-Booking Check:** Queries database to ensure the therapist does NOT already have an active appointment on that date and time slot.
   - Saves record using Sequelize: `Appointment.create({...})`.
8. **Response:** Backend returns HTTP `201 Created` with the newly created appointment JSON.
9. **UI Update:** React updates its state (`setAppointments`), closes the modal, and renders the new appointment on screen.

---

## 5. Top 15 Viva Questions & Simple Answers (විභාගයේදී අහන ප්‍රධාන ප්‍රශ්න)

### Q1. Why did you use Sequelize ORM instead of writing raw SQL queries?
- **English Answer:**  
  "Sequelize is an Object-Relational Mapper (ORM). Instead of writing hardcoded raw SQL strings like `SELECT * FROM patients`, we interact with database tables as JavaScript objects (`Patient.findAll()`). This prevents SQL Injection vulnerabilities, simplifies relationships (`hasMany`, `belongsTo`), and makes the code database-agnostic—we can easily switch between MySQL and SQLite without rewriting queries."
- **Sinhala සරල අදහස:**  
  Raw SQL ලියනකොට SQL Injection errors එන්න පුළුවන්. ORM එකෙන් database tables JavaScript classes/objects විදියට map කරනවා. ඒ නිසා `Patient.create()` වගේ clean methods වලින් වැඩ කරන්න පුළුවන්.

---

### Q2. How does Authentication work in your system?
- **English Answer:**  
  "We use stateless JWT (JSON Web Token) authentication:
  1. When the user enters their credentials, `authController.login` verifies the email and compares the hashed password using `bcrypt.compare()`.
  2. If valid, the server signs a JWT containing the user ID and role using a secret key (`jwt.sign()`).
  3. The frontend stores this token in `localStorage`.
  4. For every subsequent API request, an Axios request interceptor attaches the token as a `Bearer` header.
  5. The backend `authMiddleware` validates the token before executing protected routes."
- **Sinhala සරල අදහස:**  
  User login වෙද්දි password එක bcrypt වලින් check කරලා JWT token එකක් හදලා දෙනවා. Frontend එකෙන් හැම request එකකටම ඒ token එක `Bearer` header එක විදියට යවනවා. Backend එකෙන් ඒක verify කරලා තමයි access දෙන්නේ.

---

### Q3. How do you store passwords securely in the database?
- **English Answer:**  
  "We never store plain text passwords. We use **bcryptjs** with 10 salt rounds. Before saving a user to the database, a Sequelize `beforeCreate` lifecycle hook automatically hashes the password using `bcrypt.hash()`."
- **Sinhala සරල අදහස:**  
  Plain text passwords save කරන්නේ නෑ. Bcrypt library එකෙන් salt rounds 10ක් දාලා hash කරලා තමයි database එකේ save කරන්නේ.

---

### Q4. What is Role-Based Access Control (RBAC) and how did you implement it?
- **English Answer:**  
  "RBAC restricts resource access based on user roles: Admin, Therapist, Receptionist, and Patient. We implemented a reusable Express middleware `authorize(['Admin', 'Therapist'])`. If a logged-in user's role does not match the allowed roles for that route, the server immediately rejects the request with HTTP `403 Forbidden`."
- **Sinhala සරල අදහස:**  
  Roles 4ක් තියෙනවා. `roleMiddleware` එකෙන් check කරනවා request එක එවන user ට ඒ route එකට access තියෙනවද කියලා. නැත්නම් 403 Forbidden error එකක් දෙනවා.

---

### Q5. How do you prevent double-booking for appointments?
- **English Answer:**  
  "In `appointmentController.js`, before creating or rescheduling an appointment, we query the `Appointment` table for any existing record with the same `therapistId`, `date`, and `timeSlot` whose status is not 'Cancelled'. If a conflict is found, we abort and return an HTTP `409 Conflict` error with a clear message to the user."
- **Code to show:** `backend/src/controllers/appointmentController.js` (inside `createAppointment`)

---

### Q6. How is clinical patient privacy preserved?
- **English Answer:**  
  "In a mental health system, raw therapist clinical notes (MSE, private behavioral notes) must not be exposed to patients directly. In `sessionController.js` and `patientController.js`, when a patient requests session records, we sanitize the object and omit `therapyNotes`, while preserving encouraging `patientSummary` and `homeworkAssigned`."

---

### Q7. What HTTP status codes did you use and why?
- `200 OK`: Successful read or update (`GET`, `PUT`).
- `201 Created`: Successful creation of a new entity (`POST /patients`, `POST /appointments`).
- `400 Bad Request`: Validation failure (e.g., missing required fields, date in the past).
- `401 Unauthorized`: Missing or invalid JWT token.
- `403 Forbidden`: User authenticated, but role not permitted (e.g., Patient trying to delete another patient).
- `404 Not Found`: Resource ID does not exist in database.
- `409 Conflict`: Double-booking detected for clinician slot.
- `500 Internal Server Error`: Unexpected server exception (handled by centralized error handler).

---

### Q8. What is the difference between State and Props in React?
- **State:** Local data maintained inside a component that changes over time (e.g., `const [appointments, setAppointments] = useState([])`).
- **Props:** Input parameters passed from a parent component down to a child component (e.g., `<Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />`).

---

### Q9. What are React Hooks and which ones did you use?
- `useState`: Manages component-level state (forms, loading indicators, table rows).
- `useEffect`: Handles side effects like fetching data from the backend API on page load.
- `useContext`: Accesses global authentication state (`useAuth()`) across any component without prop drilling.
- `useNavigate`: Programmatically redirects routes (e.g., redirecting to dashboard after login).
- `useParams`: Extracts URL route parameters (e.g., `patientId` in `/patients/:id`).

---

### Q10. What is CORS and why is it needed?
- **English Answer:**  
  "CORS stands for Cross-Origin Resource Sharing. Because our React frontend runs on port `5173` and our backend API runs on port `5000`, the browser's Same-Origin Policy blocks requests by default. We used the `cors` npm package in Express to permit requests from the frontend."

---

## 6. Examiner's "Show Me" Quick Reference (Monitor එකේ පෙන්වන්න ඕන තැන්)

| Examiner says: | File to open & show: |
|---|---|
| *"Show me your database connection"* | `backend/src/config/database.js` |
| *"Show me your models & relationships"* | `backend/src/models/index.js` |
| *"Show me your authentication logic"* | `backend/src/controllers/authController.js` |
| *"Show me where you prevent double booking"* | `backend/src/controllers/appointmentController.js` (search for `conflictingAppointment`) |
| *"Show me your JWT middleware"* | `backend/src/middleware/authMiddleware.js` |
| *"Show me how frontend calls backend"* | `frontend/src/api/axios.js` and `frontend/src/api/index.js` |
| *"Show me your routing"* | `frontend/src/App.jsx` |
| *"Show me the 1-click demo login"* | Open browser at `http://localhost:5173/login` |

---

## 7. How to Run the Project for the Examiner

```bash
# Terminal 1 - Backend:
cd "d:\ORM-Repeat Exam\mindcare\backend"
npm start

# Terminal 2 - Frontend:
cd "d:\ORM-Repeat Exam\mindcare\frontend"
npm run dev
```
Open **http://localhost:5173** in Google Chrome.
Click **"Sign In"** -> click **"Admin"** to show the full dashboard immediately!
