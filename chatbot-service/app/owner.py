from .auth import Identity


def resolve_owner(identity: Identity | None, device_id: str | None) -> tuple[str, str] | None:
    """Determine who a conversation belongs to.

    Logged-in buyers/admins are scoped by their JWT uid (history follows the account
    across devices). Anonymous visitors are scoped by a client-generated device ID sent
    via the X-Chat-Device-Id header (history is local to that browser only).
    """
    if identity is not None:
        return identity.role, identity.uid
    if device_id:
        return "anonymous", device_id
    return None
