from dataclasses import dataclass

import jwt

from . import config


@dataclass
class Identity:
    uid: str
    role: str
    email: str | None


def get_identity(authorization_header: str | None) -> Identity | None:
    """Resolve the caller's identity from an `Authorization: Bearer <token>` header.

    Mirrors backend/src/middleware/auth.js: same JWT_SECRET, same HS256 algorithm,
    same {sub, role, email} payload shape. Returns None for anonymous/invalid/expired
    tokens rather than raising — the chatbot treats those callers as public visitors.
    """
    if not authorization_header:
        return None
    scheme, _, token = authorization_header.partition(" ")
    if scheme != "Bearer" or not token:
        return None
    try:
        payload = jwt.decode(token, config.JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None
    uid = payload.get("sub")
    role = payload.get("role")
    if not uid or role not in ("buyer", "admin"):
        return None
    return Identity(uid=uid, role=role, email=payload.get("email"))
