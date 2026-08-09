import os

from dotenv import load_dotenv

load_dotenv()

REQUIRED = ["GROQ_API_KEY", "JWT_SECRET", "FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"]
missing = [key for key in REQUIRED if not os.environ.get(key)]
if missing:
    raise RuntimeError(
        f"Missing required environment variables: {', '.join(missing)}. "
        "Copy .env.example to .env and fill in your Groq and Firebase credentials."
    )

PORT = int(os.environ.get("PORT", 8000))
CORS_ORIGINS = [origin.strip() for origin in os.environ.get("CORS_ORIGIN", "http://localhost:5173").split(",") if origin.strip()]

GROQ_API_KEY = os.environ["GROQ_API_KEY"]
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

JWT_SECRET = os.environ["JWT_SECRET"]

FIREBASE_PROJECT_ID = os.environ["FIREBASE_PROJECT_ID"]
FIREBASE_CLIENT_EMAIL = os.environ["FIREBASE_CLIENT_EMAIL"]
# .env stores the key with literal "\n" sequences; Firebase needs real newlines.
FIREBASE_PRIVATE_KEY = os.environ["FIREBASE_PRIVATE_KEY"].replace("\\n", "\n")
