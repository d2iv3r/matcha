"""Documentation routes exposing OpenAPI and Swagger UI."""

from flask import Blueprint, jsonify, redirect, Response, url_for

from app.utils.openapi import get_openapi_spec


docs_bp = Blueprint("docs", __name__, url_prefix="/api")


@docs_bp.get("/openapi.json")
def openapi_spec():
    return jsonify(get_openapi_spec())


@docs_bp.get("/docs")
def docs_redirect():
    return redirect(url_for("docs.swagger_ui"))


@docs_bp.get("/docs/")
def swagger_ui():
    html = """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Matcha API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
      });
    </script>
  </body>
</html>
"""
    return Response(html, mimetype="text/html")