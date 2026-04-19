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
            "description": "API documentation for authentication, accounts, and profile interaction endpoints.",
        },
        "servers": [{"url": "/", "description": "Current server"}],
        "tags": [
            {"name": "System", "description": "Health and root endpoints"},
            {"name": "Auth", "description": "Authentication endpoints"},
            {"name": "Account", "description": "Authenticated account profile endpoints"},
            {"name": "Profile", "description": "Profile views and likes endpoints"},
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
                    "required": ["username", "password"],
                    "properties": {
                        "username": {"type": "string", "minLength": 3, "maxLength": 50},
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
                        "date_of_birth": {"type": "string", "format": "date"},
                        "location": {"type": "string"},
                        "bio": {"type": "string"},
                        "rating": {
                            "type": "string",
                            "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                            "default": "Ghost",
                        },
                        "interests": {"type": "array", "items": {"type": "string"}},
                        "avatar": {"type": "string"},
                        "pictures": {"type": "array", "items": {"type": "string"}},
                    },
                },
                "UpdateProfileRequest": {
                    "type": "object",
                    "required": ["gender", "date_of_birth", "location", "interests", "avatar"],
                    "properties": {
                        "gender": {"type": "string", "enum": ["male", "female"]},
                        "date_of_birth": {"type": "string", "format": "date"},
                        "location": {"type": "string", "minLength": 1, "maxLength": 255},
                        "bio": {"type": "string", "maxLength": 500},
                        "interests": {"type": "array", "items": {"type": "string"}, "minItems": 1},
                        "avatar": {"type": "string", "format": "binary"},
                        "pictures": {"type": "array", "items": {"type": "string", "format": "binary"}},
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
                "PasswordResetRequest": {
                    "type": "object",
                    "required": ["email"],
                    "properties": {
                        "email": {"type": "string", "format": "email"},
                    },
                },
                "PasswordResetConfirm": {
                    "type": "object",
                    "required": ["token", "new_password"],
                    "properties": {
                        "token": {"type": "string"},
                        "new_password": {"type": "string", "minLength": 8},
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
            "/api/auth/verify-email": {
                "get": {
                    "tags": ["Auth"],
                    "summary": "Verify email address",
                    "parameters": [
                        {
                            "name": "token",
                            "in": "query",
                            "required": True,
                            "description": "Email verification token",
                            "schema": {"type": "string"}
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Email verified successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "user": {"$ref": "#/components/schemas/User"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {
                            "description": "Invalid or expired token",
                            "content": {
                                APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}
                            },
                        },
                    },
                }
            },
            "/api/auth/login": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Login with HTTP-only cookies",
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/LoginRequest"}}
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Logged in successfully with HTTP-only cookie tokens",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
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
            "/api/auth/reset-password/request": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Request password reset",
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/PasswordResetRequest"}}
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Password reset email sent",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {
                            "description": "Bad request",
                            "content": {
                                APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}
                            },
                        },
                    },
                }
            },
            "/api/auth/reset-password/confirm": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Confirm password reset",
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/PasswordResetConfirm"}}
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Password reset successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "user": {"$ref": "#/components/schemas/User"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {
                            "description": "Invalid or expired token",
                            "content": {
                                APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}
                            },
                        },
                    },
                }
            },
            "/api/v1/accounts/complete-profile": {
                "post": {
                    "tags": ["Account"],
                    "summary": "Complete or update authenticated user profile",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/UpdateProfileRequest"}},
                            "multipart/form-data": {"schema": {"$ref": "#/components/schemas/UpdateProfileRequest"}},
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
                },
                "put": {
                    "tags": ["Account"],
                    "summary": "Update authenticated user profile",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/UpdateProfileRequest"}},
                            "multipart/form-data": {"schema": {"$ref": "#/components/schemas/UpdateProfileRequest"}},
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
            "/api/v1/accounts/profile": {
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
                                            "profile_views": {"type": "object"},
                                            "profile_likes": {"type": "object"},
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
            "/api/v1/accounts/profiles": {
                "get": {
                    "tags": ["Account"],
                    "summary": "Get profiles list",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "limit",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "minimum": 1, "default": 20},
                        },
                        {
                            "name": "offset",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "minimum": 0, "default": 0},
                        },
                    ],
                    "responses": {
                        "200": {
                            "description": "Profiles retrieved successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "profiles": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "username": {"type": "string"},
                                                        "age": {"type": "integer", "nullable": True},
                                                        "location": {"type": "string", "nullable": True},
                                                        "rating": {
                                                            "type": "string",
                                                            "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                                                            "default": "Ghost",
                                                        },
                                                    },
                                                },
                                            },
                                            "count": {"type": "integer"},
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                    },
                }
            },
            "/api/v1/account/profiles": {
                "get": {
                    "tags": ["Account"],
                    "summary": "Get profiles list (legacy path)",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {"description": "Profiles retrieved successfully"},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                    },
                }
            },
            "/api/v1/accounts/profile/{username}": {
                "get": {
                    "tags": ["Account"],
                    "summary": "Get a specific user's profile and record view",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "username",
                            "in": "path",
                            "required": True,
                            "schema": {"type": "string"},
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Profile retrieved successfully and view recorded",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "username": {"type": "string"},
                                            "first_name": {"type": "string", "nullable": True},
                                            "last_name": {"type": "string", "nullable": True},
                                            "age": {"type": "integer", "nullable": True},
                                            "location": {"type": "string", "nullable": True},
                                            "rating": {
                                                "type": "string",
                                                "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                                                "default": "Ghost",
                                            },
                                            "bio": {"type": "string", "nullable": True},
                                            "interests": {"type": "array", "items": {"type": "string"}},
                                            "avatar": {"type": "string", "nullable": True},
                                            "pictures": {"type": "array", "items": {"type": "string"}},
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
            "/api/v1/profile/{username}/view": {
                "post": {
                    "tags": ["Profile"],
                    "summary": "Record a view of a user's profile",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "username", "in": "path", "required": True, "schema": {"type": "string"}}
                    ],
                    "responses": {
                        "200": {
                            "description": "Profile view recorded successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Bad request"},
                        "404": {"description": NOT_FOUND},
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/profile/viewers": {
                "get": {
                    "tags": ["Profile"],
                    "summary": "Get list of users who viewed your profile",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "limit",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "default": 10, "minimum": 1, "maximum": 100},
                            "description": "Maximum number of viewers to return",
                        },
                    ],
                    "responses": {
                        "200": {
                            "description": "List of viewers retrieved successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "viewers": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "username": {"type": "string"},
                                                        "avatar": {"type": "string"},
                                                        "viewed_at": {"type": "string", "format": "date-time"},
                                                    },
                                                },
                                            },
                                            "count": {"type": "integer"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Bad request"},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                    },
                }
            },
            "/api/v1/profile/views-count": {
                "get": {
                    "tags": ["Profile"],
                    "summary": "Get total view count for your profile",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {
                            "description": "View count retrieved successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "view_count": {"type": "integer"},
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/profile/{username}/like": {
                "post": {
                    "tags": ["Profile"],
                    "summary": "Record a like for a user's profile",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "username", "in": "path", "required": True, "schema": {"type": "string"}}
                    ],
                    "responses": {
                        "200": {
                            "description": "Profile like recorded successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Bad request"},
                        "404": {"description": NOT_FOUND},
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/profile/likes": {
                "get": {
                    "tags": ["Profile"],
                    "summary": "Get list of users who liked your profile",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "limit",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "default": 10, "minimum": 1, "maximum": 100},
                            "description": "Maximum number of likers to return",
                        },
                    ],
                    "responses": {
                        "200": {
                            "description": "List of likers retrieved successfully",
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/profile/likes-count": {
                "get": {
                    "tags": ["Profile"],
                    "summary": "Get total like count for your profile",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {
                            "description": "Like count retrieved successfully",
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
        },
    }