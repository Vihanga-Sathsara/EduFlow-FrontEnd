# EduFlow Frontend

![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-FF0000?style=flat&logo=vercel)
![Node.js](https://img.shields.io/badge/Node.js-v18.17.1-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

EduFlow Frontend is built with **React + Vite + TypeScript**, providing a smooth interface for users and admins to interact with EduFlow LearnHub.

---

## Live Demo

Frontend deployed on **Vercel**:  
[https://edu-flow-front-end.vercel.app](https://edu-flow-front-end.vercel.app)

---

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000   # Replace with your backend URL
````

> On Vercel, add the same variable in Project Settings → Environment Variables.

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/Vihanga-Sathsara/EduFlow-FrontEnd.git
cd EduFlow-FrontEnd
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open browser:

```
http://localhost:5173
```

5. Build for production:

```bash
npm run build
```

---

## Features

* Responsive **dashboard** for Admin & Users
* **Ebook upload** (Admin) and download (Users)
* Display **recently uploaded ebooks**
* **User management** view with roles and registration info
* **Learning paths** overview
* Drag & Drop file upload
* SweetAlert2 notifications

---

## Folder Structure

```
EduFlow-FrontEnd/
├─ src/
│  ├─ components/   # Reusable UI components
│  ├─ pages/        # React pages
│  ├─ services/     # API calls
│  └─ context/      # Auth & state management
├─ public/
├─ package.json
├─ tsconfig.json
└─ .env             # Not committed
```

---

## Screenshots

> Replace with actual screenshots in `screenshots/` folder

![Dashboard](screenshots/dashboard.png)
![Ebook Upload](screenshots/ebook-upload.png)
![Learning Paths](screenshots/learning-paths.png)

---

## Notes

* Frontend interacts with backend via `VITE_API_URL`
* `.env` should **never** be committed
* Only Admins can upload ebooks
* Users can view/download ebooks
* Fully responsive UI

---

## License

MIT © 2026 EduFlow

