<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
</div>

<h1 align="center">🎙️ Voice-Activated Virtual Assistant</h1>

<p align="center">
  A futuristic, highly-interactive, voice-controlled AI Assistant built on the MERN stack. It listens to natural language commands, intelligently classifies user intent via the lightning-fast <strong>Groq API (Llama 3)</strong>, and responds natively using the browser's Speech Synthesis.
</p>

---

## ✨ Features

### 🗣️ Core Voice Capabilities
- **Continuous Speech Recognition**: Listens to commands in real-time natively using the Web Speech API.
- **Wake Word Activation**: Intelligent filtering—only responds when the user addresses the assistant by its custom name.
- **Text-to-Speech Responses**: Provides dynamic, spoken responses depending on the context of the user's request.

### 🧠 AI & Intent Classification
- **Powered by Groq API**: Utilizes `llama-3.3-70b-versatile` for blazing-fast intent detection.
- **Context-Aware Responses**: Can hold general conversations, answer factual questions, or execute direct browser commands.
- **Action Triggers**: Automatically opens external apps and sites based on voice intents:
  - *"Search YouTube for..."* ➔ Opens YouTube search results.
  - *"Play..."* ➔ Opens YouTube and searches the requested video/song.
  - *"Open Instagram/Facebook/Calculator"* ➔ Opens respective tabs.
  - *"What is the weather?"* ➔ Fetches weather via Google.
  - Local queries for **Time, Date, Day, and Month** handled flawlessly via `moment.js`.

### 🎨 Premium "Glassmorphism" UI/UX
- **Stunning Real-Time Animations**: Built with **GSAP**. Features ambient floating orbs, elegant UI transitions, and immersive profile hover effects.
- **Audio Wave Visualizer**: Reacts actively when the assistant is *Listening*, *Speaking*, or *Idle*. 
- **Dark & Cinematic Aesthetics**: A rich, dark mode UI with blurred backdrops and subtle noise textures for a premium, futuristic feel.

### 👤 User Customization & Authentication
- **Custom Identities**: Users can completely customize their Assistant's Name.
- **Cloudinary Avatar Uploads**: Upload custom profile pictures for your AI directly from your local device.
- **Secure Authentication**: Stateless, secure login utilizing JWTs stored inside HTTP-Only Cookies.
- **Command History**: Saves user-specific command histories securely to the MongoDB database.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (for layout & glassmorphism styling)
- **GSAP** (for complex, butter-smooth animations)
- **Web Speech API** (for Speech Recognition & Synthesis)
- **React Router** (Navigation)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** (with Mongoose ORM)
- **Groq API** (`llama-3.3-70b-versatile`)
- **JSON Web Tokens (JWT)** (for secure auth)
- **Cloudinary** & **Multer** (for avatar image processing and cloud storage)

---

## 🚀 Installation & Setup

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system. You will also need API keys from **Groq** and **Cloudinary**.

### 1. Clone the repository
```bash
git clone https://github.com/Pranshu-15/virtualAssistant.git
cd virtualAssistant
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GROK_API_KEY=your_groq_api_key
GROK_API_URL=https://api.groq.com/openai/v1/chat/completions
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The app will start running locally at `http://localhost:5173`.

---

## 📸 Usage Workflow
1. **Sign Up/Sign In**: Create a new account securely.
2. **Customize Assistant**: Upload an image for your AI and give it a unique name (e.g., "Jarvis" or "Friday").
3. **Engage**: Say *"Hey [Assistant Name], what is the time?"* and watch the audio waveform react in real-time as it answers!

---

<p align="center">
  <i>If you like this project, don't forget to leave a ⭐ on the repository!</i>
</p>
