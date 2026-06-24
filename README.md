# 🛡️ PhishGuard Pro

**AI-Powered Phishing URL Detection & Cybersecurity Dashboard**

A full-stack cybersecurity web application that uses machine learning to detect phishing URLs in real-time. Built with React, Flask, and Firebase.

> Architect: **Devicyt** © 2026 | All rights reserved.

---

## ✨ Features

- 🔍 **AI URL Scanner** — ML-powered phishing detection with 18+ URL features
- 📊 **Analytics Dashboard** — Charts, trends, and risk distribution
- 📋 **Scan History** — Search, filter, and manage past scans
- 📄 **PDF Reports** — Downloadable security analysis reports
- 🔐 **Firebase Auth** — Register, login, logout with session persistence
- 🌙 **Dark Mode** — Dark by default with optional light mode
- 📱 **Responsive** — Mobile, tablet, and desktop support
- 🎨 **Premium UI** — Glassmorphism, neon glows, particle animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 3, Framer Motion, Chart.js |
| Backend | Flask, Flask-CORS, Scikit-Learn, ReportLab |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Icons | Lucide React |
| HTTP | Axios |

---

## 📁 Project Structure

```
phishguardpro/
├── frontend/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── api/api.js              # Centralized Axios service
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ParticleBackground.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── RiskGauge.jsx
│   │   │   ├── ScanResultPanel.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── firebase/config.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Scanner.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── About.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Flask app factory
│   │   ├── routes/
│   │   │   ├── scan.py              # POST /api/scan, POST /api/predict
│   │   │   ├── history.py           # GET /api/history, DELETE /api/history/:id
│   │   │   ├── stats.py             # GET /api/stats
│   │   │   └── report.py            # POST /api/export-report
│   │   ├── services/
│   │   │   ├── ml_model.py          # Random Forest classifier
│   │   │   ├── url_analyzer.py      # URL feature extraction
│   │   │   ├── firebase_service.py  # Firestore CRUD
│   │   │   └── report_generator.py  # PDF generation
│   │   ├── middleware/
│   │   │   ├── auth.py              # Firebase token verification
│   │   │   ├── rate_limiter.py      # Rate limiting
│   │   │   └── validators.py        # Input validation
│   │   └── utils/logger.py          # Logging
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** ≥ 18.x and **npm**
- **Python** ≥ 3.9
- **Firebase Project** (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/thedeviprasadcyt/phishguardpro.git
cd phishguardpro
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env
# Edit .env and update values
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Firebase Configuration

#### 4a. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project `phishguard-pro-a3295`
3. **Enable Authentication**:
   - Go to **Authentication → Sign-in method**
   - Enable **Email/Password** provider
4. **Create Firestore Database**:
   - Go to **Firestore Database → Create Database**
   - Select **Start in test mode** (for development)
   - Choose your preferred region

#### 4b. Firebase Admin SDK Key (for Backend)

1. Go to **Project Settings → Service Accounts**
2. Click **Generate New Private Key**
3. Save the downloaded JSON file as `firebase-admin-key.json` in the `backend/` folder
4. **⚠️ Never commit this file to Git** (it's already in `.gitignore`)

#### 4c. Firestore Security Rules (Production)

Go to **Firestore Database → Rules** and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scans/{scanId} {
      allow read, delete: if request.auth != null && resource.data.user_uid == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

### 5. Environment Variables

#### Backend (`backend/.env`)

```env
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_PORT=5000
SECRET_KEY=your-random-secret-key-here
FIREBASE_PROJECT_ID=phishguard-pro-a3295
FIREBASE_ADMIN_KEY_PATH=firebase-admin-key.json
RATE_LIMIT_PER_MINUTE=100
FRONTEND_URL=http://localhost:5173
```

#### Frontend

The Firebase config is pre-configured in `src/firebase/config.js`. Optionally, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
venv\Scripts\activate   # Windows
python run.py
```

Backend runs at: **http://localhost:5000**

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

Open **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/scan` | Optional | Scan a URL for phishing |
| `POST` | `/api/predict` | Optional | Detailed prediction with features |
| `GET` | `/api/history` | Required | Get user's scan history |
| `DELETE` | `/api/history/:id` | Required | Delete a scan record |
| `GET` | `/api/stats` | Required | Get dashboard statistics |
| `POST` | `/api/export-report` | Optional | Generate PDF report |
| `GET` | `/api/health` | None | Health check |

### Example: Scan a URL

```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

Response:
```json
{
  "url": "https://google.com",
  "category": "Safe",
  "risk_score": 5,
  "confidence": 94.2,
  "probabilities": {
    "safe": 94.2,
    "suspicious": 4.1,
    "phishing": 1.7
  },
  "indicators": [
    {"type": "safe", "message": "No immediate phishing indicators detected"}
  ]
}
```

---

## 🚀 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
6. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`
4. Add environment variables:
   - `FLASK_ENV` = `production`
   - `SECRET_KEY` = `your-production-secret`
   - `FIREBASE_PROJECT_ID` = `phishguard-pro-a3295`
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
5. Upload `firebase-admin-key.json` content as a secret file or use Google Cloud default credentials
6. Deploy

### Post-Deployment

- Update `FRONTEND_URL` in backend env to your Vercel domain
- Update `VITE_API_URL` in frontend env to your Render domain
- Update CORS settings if needed
- Set Firestore rules to production mode

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|---------|
| **CORS errors** | Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL |
| **Firebase Admin key not found** | Download from Firebase Console → Project Settings → Service Accounts |
| **Firestore permission denied** | Enable Firestore in Firebase Console; check security rules |
| **`npm run dev` fails** | Run `npm install` first; ensure Node.js ≥ 18 |
| **`python run.py` fails** | Activate venv; run `pip install -r requirements.txt` |
| **Auth not working** | Enable Email/Password provider in Firebase Console |
| **Scan works but history doesn't** | Login first — history requires authentication |
| **PDF download fails** | Check that the backend is running on port 5000 |
| **Blank page after login** | Clear browser cache; check browser console for errors |

---

## 🔒 Security Features

- ✅ Input validation and URL sanitization
- ✅ Rate limiting (100 req/min per IP)
- ✅ XSS protection via bleach
- ✅ Firebase token verification
- ✅ CORS restricted to frontend origin
- ✅ Secure error handling (no stack traces in production)
- ✅ Request size limits (1 MB)
- ✅ Rotating log files

---

## 📜 License

© 2026 Devicyt. All rights reserved.

---

## 🔗 Links

- **Portfolio**: [thedeviprasadcyt.vercel.app](https://thedeviprasadcyt.vercel.app/)
- **LinkedIn**: [Deviprasad Muduli](https://www.linkedin.com/in/deviprasad-muduli-13b2b1387/)
- **GitHub**: [thedeviprasadcyt](https://github.com/thedeviprasadcyt)
"# phishguardpro" 
