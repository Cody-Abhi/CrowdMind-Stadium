# CrowdMind Stadium OS — AI Operating System for Stadium Operations

An advanced, production-grade AI-first operating system designed to manage and optimize mass crowd flows, safety protocols, volunteer stewardship, and multilingual communication dynamically inside stadium environments. Built for the FIFA World Cup 2026 Lusail Stadium operations.

---

## Key Features

### 1. C-Suite Strategic AI Briefings
* **Perspective Synthesis:** Request on-demand strategic analyses covering General Operations, Sustainability, Volunteer Efficacy, or Yield optimization.
* **Context-Aware Parameters:** Computes real-time reports via Gemini based on attendance, ambient desert temperature, and steward deployment densities.

### 2. Live Telemetry & Ingress Simulation
* **Dynamic Analytics:** Telemetry metrics and Recharts spatial density graphs update instantly in response to simulation parameter adjustments.
* **Predictive Metrics:** Real-time mathematical and AI modeling forecasts total yields, gate queue bottleneck risks, required steward resources, and HVAC energy loads.

### 3. Real-Time Operations Dispatch
* **Volunteer Stewardship Board:** Connects to a live Firestore collection to manage steward assignments. Operators can add tasks, dispatch volunteer squads, and complete tasks with real-time sync.
* **AI Signage Translator:** Simulates OCR and translation services. Users can select scanned stadium signs (e.g., Arabic emergency notices), run a laser-scan animation sweep, and translate them to English and Spanish using Gemini.
* **Safety Beacon Broadcast Center:** A secure safety alert console that dispatches warnings to targeted spectator audiences, storing them instantly in Firebase.
* **Monospace Audit Terminal:** A retro green terminal ledger streaming authentication, database write events, and configuration overrides in real-time.

### 4. Accessibility & Styling
* **WCAG AA Compliance:** Features custom toggles in the status bar for high contrast mode, text scaling, and reduced motion states.
* **Tailwind v4 Integration:** Built on Tailwind v4 theme engines with modern, glassmorphic dark-mode aesthetics.
* **Optimal Bundling:** Configured with manual chunk-splitting for React, Firebase, Motion, and Google GenAI to minimize loading latency.

---

## Tech Stack
* **Frontend:** React 19, TypeScript, Recharts, Lucide Icons, Framer Motion
* **Styling:** CSS variables, Tailwind CSS v4
* **Database:** Firebase Firestore (with offline caching & persistence)
* **Auth:** Firebase Authentication (Email/Password, Google OAuth)
* **AI Engine:** Google Gemini Developer SDK (`gemini-2.5-flash` model)
* **Server:** Node.js, Express (integrating Vite dev server middleware)

---

## Run Locally

### Prerequisites
* Node.js (v18+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cody-Abhi/CrowdMind-Stadium.git
   cd crowdmind-stadium
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment file:
   Create a `.env` file in the root directory:
   ```env
   # Obtain an API key from Google AI Studio: https://aistudio.google.com/
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   ```

4. Launch the application:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
