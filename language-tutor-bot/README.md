# AI-Powered Language Tutor Bot (Web) - Prototype

**Author:** Sagar Dhakal (project scaffold)

This is a compact, attractive web prototype for an **AI-Powered Language Tutor Bot**.  
It contains a simple frontend (HTML/JS/CSS) and a Flask backend. The backend can be wired to OpenAI (or another LLM provider) — or used locally with a mock response for testing.

## Features included in this scaffold
- Chat interface supporting text chat.
- Voice input (Web Speech API) and optional text-to-speech replies (browser TTS).
- Real-time grammar correction display (backend demonstrates how to return corrections).
- Light/Dark theme toggle.
- Ready-to-edit integration point for OpenAI (see backend/app.py).
- Simple "scenario" selector (Travel / Interview / Ordering Food).
- Instructions to run locally and deploy.

## Quick start (local)
1. Clone or unzip this project.
2. Create a Python virtual environment and install backend requirements:
   ```bash
   cd language-tutor-bot/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Create `.env` from `.env.example` and set `OPENAI_API_KEY` if you want real AI replies.
   ```bash
   cp .env.example .env
   # edit .env to add your API key
   ```
4. Run the backend:
   ```bash
   flask run --port=5000
   ```
   Or use the included run_local.sh script from the project root:
   ```bash
   bash run_local.sh
   ```
5. Open the frontend in your browser:
   - Open `frontend/index.html` directly (for dev) OR serve it with a static server.
   - The frontend will call the backend at `http://localhost:5000/api/chat`.

## How to enable OpenAI (or other LLM)
- In `backend/app.py` the function `call_llm(prompt)` has a mock implementation.
- Replace the mock with a real OpenAI call (example using `openai` Python package).
- The scaffold reads `OPENAI_API_KEY` from environment variables.

## Files
- `frontend/` — static UI (index.html, app.js, style.css)
- `backend/` — Flask API and instructions
- `run_local.sh` — helper to run backend quickly
- `.env.example` — example env file

## Notes & next steps (ideas to extend)
- Add user accounts (Google Sign-In) and store progress (Firebase or MongoDB).
- Add per-user mistake tracking & dashboard.
- Use Whisper (or browser STT) and advanced TTS for richer voice interaction.
- Add gamification: XP, badges, streaks.
- Improve UI with React + Tailwind; this scaffold uses minimal JS for simplicity.

Happy building! 🚀
