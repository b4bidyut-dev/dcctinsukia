# District Computer Centre Tinsukia - Notes Portal

The **District Computer Centre Tinsukia Notes Portal** is a web-based educational platform for publishing, viewing, and distributing computer-related study notes in PDF format. Built strictly according to the specifications in [`DCC_Tinsukia_Notes_Portal_PRD.md`](./DCC_Tinsukia_Notes_Portal_PRD.md).

---

## 🏛️ Theme & Visual Identity

- **Official Educational Theme**: Deep Navy Blue (`#0f2842`), Crisp White (`#ffffff`), Slate Gray (`#64748b`), and Accent Gold/Amber (`#f59e0b`).
- **Target Audience**: Students, faculty, and administrative staff of District Computer Centre, Tinsukia, Assam.

---

## 🚀 Key Features Implemented

### 1. Authentication & Role-Based Access Control (RBAC)
- **Roles**:
  - `ADMIN`: Document upload, note management, user management, and audit log inspection.
  - `USER`: Registered students with permissions to search, view online, and download published PDF notes.
  - `VISITOR`: Can explore public pages (Home, About DCC) and access Login/Registration.
- **Server-Side Security**:
  - Direct endpoint protection (e.g. non-admins calling `/api/admin/*` receive HTTP `403 Forbidden`).
  - Passwords hashed using `bcryptjs` with salt rounds.
  - Authentication sessions encoded with `jose` JWT in HTTP-only, SameSite cookies.
  - Middleware guarding protected routes (`/admin/*`, `/library/*`, `/dashboard/*`, `/notes/*`).

### 2. PDF Storage & Security
- **Isolated Non-Public Storage**: Stored outside the public directory in `storage/notes/`. Direct file links are impossible.
- **Magic-Byte Header Validation**: Validates `%PDF-` (bytes `0x25 0x50 0x44 0x46 0x2D`) on the backend and client before writing to disk. Rejects spoofed extensions.
- **File Limits**: Enforces 25 MB configurable file size limit.
- **Anti-Traversal**: Sanitized filenames with random hexadecimal identifiers.

### 3. Student Notes Library & Online Viewer
- **Interactive Search & Filtering**:
  - Keyword search across Title, Topic, and Course.
  - Subject/Category filter dropdown.
  - Course filter (DCA, PGDCA, ADCA, CCC, Tally, Assam IT Exam).
  - Sorting: Newest, Most Downloaded, Alphabetical, Oldest.
- **Online PDF Reader**:
  - Embedded reader with page navigation, zoom in/out, fit-width reset, and Fullscreen API support.
  - Streaming through authenticated route `/api/notes/[id]/view` (increments view count).
  - One-click PDF download with automated download tracking.

### 4. Administrator Dashboard & Management
- **Dashboard Metrics**: Total notes, published vs draft count, registered users, total downloads, and storage usage in MB.
- **Upload Note Form**: Drag-and-drop PDF picker with instant client magic-byte pre-check, subject selection, course assignment, topic, academic session, language, and draft/published status toggle.
- **Notes Management**: Table with live search, publish/unpublish toggle, metadata editing modal, and archive/delete confirmation.
- **User Management**: View all registered students, search by roll ID/name/email, toggle active/deactivated status, and promote/demote administrator rights.
- **Audit & Download Logs**: Real-time logging of user logins, note uploads, updates, status changes, and student downloads.

---

## 🔑 Default Credentials

The database has been seeded with initial credentials:

| Role | Email | Password | Student / Roll ID |
|---|---|---|---|
| **Administrator** | `admin@dcctinsukia.in` | `AdminPassword@123` | `ADMIN-01` |
| **Student** | `student@dcctinsukia.in` | `Student@123` | `DCC-2026-001` |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Database & ORM**: SQLite with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Lucide Icons
- **Authentication**: JWT sessions with [jose](https://github.com/panva/jose) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Runtime**: Node.js v24+

---

## 💻 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Sync & Seeding
```bash
npx prisma db push
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
