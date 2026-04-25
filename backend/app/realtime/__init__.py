"""Realtime (websocket) package setup."""

from .events import register_event_handlers


def register_realtime(socketio_instance) -> None:
    """Attach realtime event handlers to the Socket.IO instance."""
    register_event_handlers(socketio_instance)
