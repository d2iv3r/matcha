"""Application middleware."""

from flask import Flask, jsonify, g, request


def _store_request_payload() -> None:
    g.json_payload = request.get_json(silent=True) if request.method in {"POST", "PUT", "PATCH", "DELETE"} else None


def register_middleware(app: Flask) -> None:
    """Register request lifecycle middleware and error handlers."""

    @app.before_request
    def before_request():
        _store_request_payload()

    @app.after_request
    def after_request(response):
        origin = request.headers.get("Origin")
        frontend_origin = app.config.get("FRONTEND_URL")

        if origin and origin == frontend_origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Vary"] = "Origin"

        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-CSRF-TOKEN"
        response.headers["Access-Control-Max-Age"] = "3600"
        return response

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request", "message": str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden", "message": "Access denied"}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(415)
    def unsupported_media_type(error):
        return jsonify(
            {
                "error": "Unsupported media type",
                "message": "Send JSON with Content-Type: application/json",
            }
        ), 415

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    @app.route("/", defaults={"path": ""}, methods=["OPTIONS"])
    @app.route("/<path:path>", methods=["OPTIONS"])
    def options_handler(path):
        return "", 204