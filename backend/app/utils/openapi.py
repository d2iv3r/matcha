"""OpenAPI specification for Matcha API."""

APP_JSON = "application/json"
NOT_FOUND = "Not found"
ERROR_SCHEMA_REF = "#/components/schemas/ErrorResponse"
PROFILE_SCHEMA_REF = "#/components/schemas/Profile"


def get_openapi_spec() -> dict:
    """Return OpenAPI 3 specification used by Swagger UI."""
    return {
        "openapi": "3.0.3",
        "info": {
            "title": "Matcha API",
            "version": "1.0.0",
            "description": "API documentation for authentication and user management endpoints.",
        },
        "servers": [{"url": "/", "description": "Current server"}],
        "tags": [
            {"name": "System", "description": "Health and root endpoints"},
            {"name": "Auth", "description": "Authentication endpoints"},
            {"name": "Users", "description": "User management endpoints"},
            {"name": "Account", "description": "Authenticated account profile endpoints"},
        ],
        "components": {
            "securitySchemes": {
                "bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"},
                "refreshCookie": {"type": "apiKey", "in": "cookie", "name": "refresh_token_cookie"},
                "csrfHeader": {"type": "apiKey", "in": "header", "name": "X-CSRF-TOKEN"},
            },
            "schemas": {
                "RegistrationRequest": {
                    "type": "object",
                    "required": ["username", "email", "password"],
                    "properties": {
                        "username": {"type": "string", "minLength": 3, "maxLength": 50},
                        "first_name": {"type": "string", "maxLength": 150, "nullable": True},
                        "last_name": {"type": "string", "maxLength": 150, "nullable": True},
                        "email": {"type": "string", "format": "email"},
                        "password": {"type": "string", "minLength": 8},
                    },
                },
                "LoginRequest": {
                    "type": "object",
                    "required": ["email", "password"],
                    "properties": {
                        "email": {"type": "string", "format": "email"},
                        "password": {"type": "string", "minLength": 8},
                    },
                },
                "User": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "username": {"type": "string"},
                        "email": {"type": "string", "format": "email"},
                        "is_active": {"type": "boolean"},
                        "is_profile_complete": {"type": "boolean"},
                    },
                },
                "Profile": {
                    "type": "object",
                    "properties": {
                        "user_id": {"type": "integer"},
                        "gender": {"type": "string", "enum": ["male", "female"]},
                        "age": {"type": "integer"},
                        "date_of_birth": {"type": "string", "format": "date"},
                        "location": {"type": "string"},
                        "bio": {"type": "string"},
                        "interests": {"type": "array", "items": {"type": "string"}},
                        "avatar_url": {"type": "string"},
                    },
                },
                "UpdateProfileRequest": {
                    "type": "object",
                    "required": ["gender", "age", "date_of_birth", "location", "interests", "avatar_url"],
                    "properties": {
                        "gender": {"type": "string", "enum": ["male", "female"]},
                        "age": {"type": "integer", "minimum": 0, "maximum": 120},
                        "date_of_birth": {"type": "string", "format": "date"},
                        "location": {"type": "string", "minLength": 1, "maxLength": 255},
                        "bio": {"type": "string", "maxLength": 500},
                        "interests": {"type": "array", "items": {"type": "string"}, "minItems": 1},
                        "avatar_url": {"type": "string", "minLength": 1, "maxLength": 255},
                    },
                },
                "ErrorResponse": {
                    "type": "object",
                    "properties": {
                        "success": {"type": "boolean"},
                        "error": {"type": "string"},
                        "errors": {"type": "array", "items": {"type": "string"}},
                    },
                },
            },
        },
        "paths": {
            "/api/health": {
                "get": {
                    "tags": ["System"],
                    "summary": "Health check",
                    "responses": {
                        "200": {
                            "description": "Service is healthy",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "status": {"type": "string"},
                                            "message": {"type": "string"},
                                            "version": {"type": "string"},
                                        },
                                    }
                                }
                            },
                        }
                    },
                }
            },
            "/api/": {
                "get": {
                    "tags": ["System"],
                    "summary": "API root",
                    "responses": {"200": {"description": "API metadata"}},
                }
            },
            "/api/auth/signup": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Register user",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/RegistrationRequest"}
                            }
                        },
                    },
                    "responses": {
                        "201": {"description": "User registered"},
                        "400": {
                            "description": "Validation or bad request",
                            "content": {
                                APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}
                            },
                        },
                        "409": {"description": "User already exists"},
                    },
                }
            },
            "/api/auth/register": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Register user (alias)",
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {
                                "schema": {"$ref": "#/components/schemas/RegistrationRequest"}
                            }
                        },
                    },
                    "responses": {"201": {"description": "User registered"}, "400": {"description": "Bad request"}},
                }
            },
            "/api/auth/login": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Login",
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/LoginRequest"}}
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Logged in successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "access_token": {"type": "string"},
                                            "token_type": {"type": "string"},
                                            "user": {"$ref": "#/components/schemas/User"},
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Invalid credentials"},
                    },
                }
            },
            "/api/auth/refresh": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Refresh access token",
                    "security": [{"refreshCookie": [], "csrfHeader": []}],
                    "responses": {
                        "200": {"description": "Token refreshed"},
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/auth/logout": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Logout",
                    "security": [{"refreshCookie": [], "csrfHeader": []}],
                    "responses": {"200": {"description": "Logged out"}, "401": {"description": "Unauthorized"}},
                }
            },
            "/api/auth/me": {
                "get": {
                    "tags": ["Auth"],
                    "summary": "Get current user",
                    "security": [{"bearerAuth": []}],
                    "responses": {"200": {"description": "Current user"}, "401": {"description": "Unauthorized"}},
                }
            },
            "/api/v1/users/": {
                "get": {
                    "tags": ["Users"],
                    "summary": "List users",
                    "security": [{"bearerAuth": []}],
                    "responses": {"200": {"description": "User list"}, "401": {"description": "Unauthorized"}},
                }
            },
            "/api/v1/users/{user_id}": {
                "get": {
                    "tags": ["Users"],
                    "summary": "Get user by id",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "user_id", "in": "path", "required": True, "schema": {"type": "integer"}}
                    ],
                    "responses": {"200": {"description": "User found"}, "404": {"description": NOT_FOUND}},
                },
                "put": {
                    "tags": ["Users"],
                    "summary": "Update user",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "user_id", "in": "path", "required": True, "schema": {"type": "integer"}}
                    ],
                    "responses": {"200": {"description": "User updated"}, "400": {"description": "Bad request"}},
                },
                "delete": {
                    "tags": ["Users"],
                    "summary": "Delete user (soft)",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "user_id", "in": "path", "required": True, "schema": {"type": "integer"}}
                    ],
                    "responses": {"200": {"description": "User deleted"}, "404": {"description": "Not found"}},
                },
            },
            "/api/v1/account/complete-profile": {
                "post": {
                    "tags": ["Account"],
                    "summary": "Complete or update authenticated user profile",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/UpdateProfileRequest"}}
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Profile updated successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "profile": {"$ref": PROFILE_SCHEMA_REF},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Validation error", "content": {APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}}},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Forbidden"},
                    },
                }
            },
            "/api/v1/account/profile": {
                "get": {
                    "tags": ["Account"],
                    "summary": "Get authenticated user profile",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {
                            "description": "Profile retrieved successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "user": {"$ref": "#/components/schemas/User"},
                                            "profile": {"anyOf": [{"$ref": "#/components/schemas/Profile"}, {"type": "null"}]},
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                        "404": {"description": NOT_FOUND},
                    },
                }
            },
        },
    }