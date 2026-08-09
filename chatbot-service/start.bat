@echo off
cd /d "%~dp0"

if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Installing requirements...
.venv\Scripts\python -m pip install -r requirements.txt

if not exist .env (
    echo No .env found - copy .env.example to .env and fill in your Groq/Firebase credentials first.
    exit /b 1
)

echo Starting chatbot service on http://localhost:8000 ...
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
