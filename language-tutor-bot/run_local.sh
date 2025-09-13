#!/usr/bin/env bash
# Simple helper to run the backend quickly (Linux/Mac)
cd "$(dirname "$0")/backend"
if [ -f "venv/bin/activate" ]; then
  source venv/bin/activate
fi
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port=5000
