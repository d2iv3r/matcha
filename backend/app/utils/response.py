# utils/response.py
from flask import jsonify, Response

def success(data: dict | list | None = None, message: str = "Success", status: int = 200) -> tuple[Response, int]:
    return jsonify({
        "success": True,
        "message": message,
        "data": data
    }), status

def created(data: dict, message: str = "Created") -> tuple[Response, int]:
    return jsonify({
        "success": True,
        "message": message,
        "data": data
    }), 201

def no_content() -> tuple[Response, int]:
    return "", 204

def paginated(
    data: list,
    total: int,
    page: int,
    per_page: int
) -> tuple[Response, int]:
    return jsonify({
        "success": True,
        "data": data,
        "meta": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": -(-total // per_page)  # ceiling division
        }
    }), 200


def error(message: str, status: int = 400, errors: list | dict | None = None) -> tuple[Response, int]:
    payload = {
        "success": False,
        "error": message,
    }
    if errors is not None:
        payload["errors"] = errors
    return jsonify(payload), status