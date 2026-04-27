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
            {"name": "Accounts", "description": "Authenticated account profile endpoints"},
            {"name": "Profile", "description": "Profile views and likes endpoints"},
            {"name": "Notifications", "description": "Notification management endpoints"},
            {"name": "Chat", "description": "Real-time messaging endpoints"},
        ],
        "components": {
            "securitySchemes": {
                "bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"},
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
                        "age": {"type": "integer", "nullable": True},
                        "date_of_birth": {"type": "string", "format": "date"},
                        "city": {"type": "string"},
                        "country": {"type": "string"},
                        "ip_address": {"type": "string"},
                        "latitude": {"type": "number", "format": "float"},
                        "longitude": {"type": "number", "format": "float"},
                        "bio": {"type": "string"},
                        "rating": {
                            "type": "string",
                            "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                            "default": "Ghost",
                        },
                        "interests": {"type": "array", "items": {"type": "string"}},
                        "avatar": {"type": "string", "format": "uri"},
                        "pictures": {"type": "array", "items": {"type": "string", "format": "uri"}},
                    },
                },
                "UpdateProfileRequest": {
                    "type": "object",
                    "required": [
                        "gender",
                        "date_of_birth",
                        "city",
                        "country",
                        "ip_address",
                        "latitude",
                        "longitude",
                        "bio",
                        "interests",
                        "avatar",
                        "pictures",
                    ],
                    "properties": {
                        "gender": {"type": "string", "enum": ["male", "female"]},
                        "date_of_birth": {"type": "string", "format": "date"},
                        "city": {"type": "string", "minLength": 1, "maxLength": 255},
                        "country": {"type": "string", "minLength": 1, "maxLength": 255},
                        "ip_address": {"type": "string", "minLength": 1, "maxLength": 45},
                        "latitude": {"type": "number", "format": "float"},
                        "longitude": {"type": "number", "format": "float"},
                        "bio": {"type": "string", "maxLength": 500},
                        "interests": {"type": "array", "items": {"type": "string"}, "minItems": 1},
                        "avatar": {"type": "string", "format": "binary"},
                        "pictures": {"type": "array", "items": {"type": "string", "format": "binary"}},
                    },
                },
                "UpdateAccountProfileRequest": {
                    "type": "object",
                    "properties": {
                        "first_name": {"type": "string", "maxLength": 150},
                        "last_name": {"type": "string", "maxLength": 150},
                        "email": {"type": "string", "format": "email"},
                        "gender": {"type": "string", "enum": ["male", "female"]},
                        "bio": {"type": "string", "maxLength": 500},
                        "interests": {"type": "array", "items": {"type": "string"}},
                    },
                },
                "UpdateProfileMediaRequest": {
                    "type": "object",
                    "properties": {
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
                "Notification": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "user_id": {"type": "integer"},
                        "actor_id": {"type": "integer", "nullable": True},
                        "type": {"type": "string", "enum": ["LIKE", "VIEW", "MESSAGE", "MATCH", "UNLIKE"]},
                        "message": {"type": "string"},
                        "data": {"type": "object", "nullable": True},
                        "entity_id": {"type": "integer", "nullable": True},
                        "is_read": {"type": "boolean"},
                        "created_at": {"type": "string", "format": "date-time"},
                    },
                },
                "Conversation": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "user1_id": {"type": "integer"},
                        "user2_id": {"type": "integer"},
                        "created_at": {"type": "string", "format": "date-time"},
                        "user1_username": {"type": "string", "nullable": True},
                        "user2_username": {"type": "string", "nullable": True},
                        "user1_avatar": {"type": "string", "nullable": True, "format": "uri"},
                        "user2_avatar": {"type": "string", "nullable": True, "format": "uri"},
                        "last_message": {"type": "string", "nullable": True},
                        "last_message_at": {"type": "string", "nullable": True, "format": "date-time"},
                    },
                },
                "Message": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "conversation_id": {"type": "integer"},
                        "sender_id": {"type": "integer"},
                        "content": {"type": "string"},
                        "is_read": {"type": "boolean"},
                        "created_at": {"type": "string", "format": "date-time"},
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
                        "201": {
                            "description": "User registered",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "user": {"$ref": "#/components/schemas/User"},
                                                    "verification_email_sent": {"type": "boolean"},
                                                    "verification_token_expires_at": {
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "nullable": True,
                                                    },
                                                },
                                            },
                                        },
                                    }
                                }
                            },
                        },
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
                                            "data": {"type": "object"},
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
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "username": {"type": "string"},
                                                    "is_active": {"type": "boolean"},
                                                    "is_profile_complete": {"type": "boolean"},
                                                },
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Invalid credentials"},
                    },
                }
            },
            "/api/auth/logout": {
                "post": {
                    "tags": ["Auth"],
                    "summary": "Logout",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {
                            "description": "Logged out",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {"type": "object"},
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/auth/request-password-reset": {
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
                                            "data": {"type": "object"},
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
            "/api/auth/confirm-password-reset": {
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
                                            "data": {"type": "object"},
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
            "/api/auth/oauth2/42/login": {
                "get": {
                    "tags": ["Auth"],
                    "summary": "Initiate 42 Intra OAuth2 login",
                    "parameters": [
                        {
                            "name": "redirect_uri",
                            "in": "query",
                            "required": False,
                            "description": "Frontend redirect URI after successful login",
                            "schema": {"type": "string"}
                        }
                    ],
                    "responses": {
                        "302": {"description": "Redirect to 42 Intra authorization page"}
                    },
                }
            },
            "/api/auth/oauth2/42/callback": {
                "get": {
                    "tags": ["Auth"],
                    "summary": "Handle 42 Intra OAuth2 callback",
                    "responses": {
                        "302": {"description": "Redirect to frontend dashboard with cookies set"},
                        "400": {"description": "OAuth error or user creation failed"}
                    },
                }
            },
            "/api/v1/accounts/complete-profile": {
                "post": {
                    "tags": ["Accounts"],
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
                                            "data": {"type": "object"},
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
            },
            "/api/v1/accounts/profile": {
                "get": {
                    "tags": ["Accounts"],
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
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "profile": {"$ref": PROFILE_SCHEMA_REF},
                                                },
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                        "404": {"description": NOT_FOUND},
                    },
                },
                "patch": {
                    "tags": ["Accounts"],
                    "summary": "Update authenticated user profile",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {"schema": {"$ref": "#/components/schemas/UpdateAccountProfileRequest"}},
                            "multipart/form-data": {"schema": {"$ref": "#/components/schemas/UpdateAccountProfileRequest"}},
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
                                            "data": {"type": "object"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Validation error", "content": {APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}}},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                        "404": {"description": NOT_FOUND},
                        "409": {"description": "Conflict"},
                    },
                }
            },
            "/api/v1/accounts/profiles": {
                "get": {
                    "tags": ["Accounts"],
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
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "profiles": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "user_id": {"type": "integer", "nullable": True},
                                                                "username": {"type": "string"},
                                                                "age": {"type": "integer", "nullable": True},
                                                                "city": {"type": "string", "nullable": True},
                                                                "country": {"type": "string", "nullable": True},
                                                                "rating": {
                                                                    "type": "string",
                                                                    "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                                                                    "default": "Ghost",
                                                                },
                                                                "distance_km": {"type": "number", "format": "float", "nullable": True},
                                                                "is_liked": {"type": "boolean"},
                                                                "is_match": {"type": "boolean"},
                                                            },
                                                        },
                                                    },
                                                    "count": {"type": "integer"},
                                                },
                                            },
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
            "/api/v1/accounts/profiles/search": {
                "get": {
                    "tags": ["Accounts"],
                    "summary": "Search profiles",
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
                        {
                            "name": "first_name",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "string"},
                        },
                        {
                            "name": "last_name",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "string"},
                        },
                        {
                            "name": "city",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "string"},
                        },
                        {
                            "name": "min_age",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "minimum": 0},
                        },
                        {
                            "name": "max_age",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "minimum": 0},
                        },
                        {
                            "name": "rating",
                            "in": "query",
                            "required": False,
                            "schema": {
                                "type": "string",
                                "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                            },
                        },
                        {
                            "name": "interests",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "array", "items": {"type": "string"}},
                            "style": "form",
                            "explode": True,
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
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "profiles": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "user_id": {"type": "integer", "nullable": True},
                                                                "username": {"type": "string"},
                                                                "age": {"type": "integer", "nullable": True},
                                                                "city": {"type": "string", "nullable": True},
                                                                "country": {"type": "string", "nullable": True},
                                                                "rating": {
                                                                    "type": "string",
                                                                    "enum": ["Ghost", "Rising", "Popular", "Elite", "Iconic"],
                                                                    "default": "Ghost",
                                                                },
                                                                "distance_km": {"type": "number", "format": "float", "nullable": True},
                                                                "is_liked": {"type": "boolean"},
                                                                "is_match": {"type": "boolean"},
                                                            },
                                                        },
                                                    },
                                                    "count": {"type": "integer"},
                                                },
                                            },
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
            "/api/v1/accounts/profile/{username}": {
                "get": {
                    "tags": ["Accounts"],
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
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "profile": {"$ref": PROFILE_SCHEMA_REF},
                                                    "is_match": {"type": "boolean"},
                                                    "is_liked": {"type": "boolean"},
                                                },
                                            },
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
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "viewers": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "viewer_id": {"type": "integer"},
                                                                "viewer_first_name": {"type": "string", "nullable": True},
                                                                "viewer_last_name": {"type": "string", "nullable": True},
                                                                "viewer_age": {"type": "integer", "nullable": True},
                                                                "viewer_city": {"type": "string", "nullable": True},
                                                                "viewer_country": {"type": "string", "nullable": True},
                                                                "viewer_avatar": {"type": "string", "nullable": True},
                                                                "viewed_at": {"type": "string", "format": "date-time", "nullable": True},
                                                                "is_match": {"type": "boolean"},
                                                                "is_liked": {"type": "boolean"},
                                                            },
                                                        },
                                                    },
                                                    "count": {"type": "integer"},
                                                },
                                            },
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
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "is_match": {"type": "boolean"},
                                                },
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Bad request"},
                        "404": {"description": NOT_FOUND},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                    },
                }
            },
            "/api/v1/profile/{username}/unlike": {
                "post": {
                    "tags": ["Profile"],
                    "summary": "Remove a like from a user's profile",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "username", "in": "path", "required": True, "schema": {"type": "string"}}
                    ],
                    "responses": {
                        "200": {
                            "description": "Profile like removed successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {"type": "object"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Bad request"},
                        "404": {"description": NOT_FOUND},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
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
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "likers": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "liker_id": {"type": "integer"},
                                                                "liker_first_name": {"type": "string", "nullable": True},
                                                                "liker_last_name": {"type": "string", "nullable": True},
                                                                "liker_age": {"type": "integer", "nullable": True},
                                                                "liker_city": {"type": "string", "nullable": True},
                                                                "liker_country": {"type": "string", "nullable": True},
                                                                "liker_avatar": {"type": "string", "nullable": True},
                                                                "is_match": {"type": "boolean"},
                                                                "is_liked": {"type": "boolean"},
                                                            },
                                                        },
                                                    },
                                                    "count": {"type": "integer"},
                                                },
                                            },
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
            "/api/v1/profile/matches": {
                "get": {
                    "tags": ["Profile"],
                    "summary": "Get list of users you have matched with (mutual likes)",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "limit",
                            "in": "query",
                            "required": False,
                            "schema": {"type": "integer", "default": 10, "minimum": 1, "maximum": 100},
                            "description": "Maximum number of matches to return",
                        },
                    ],
                    "responses": {
                        "200": {
                            "description": "List of matches retrieved successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "matches": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "object",
                                                            "properties": {
                                                                "liker_id": {"type": "integer"},
                                                                "liker_username": {"type": "string", "nullable": True},
                                                                "liker_first_name": {"type": "string", "nullable": True},
                                                                "liker_last_name": {"type": "string", "nullable": True},
                                                                "liker_age": {"type": "integer", "nullable": True},
                                                                "liker_city": {"type": "string", "nullable": True},
                                                                "liker_country": {"type": "string", "nullable": True},
                                                                "liker_avatar": {"type": "string", "nullable": True},
                                                            },
                                                        },
                                                    },
                                                    "count": {"type": "integer"},
                                                },
                                            },
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
            "/api/v1/accounts/profile/media": {
                "patch": {
                    "tags": ["Accounts"],
                    "summary": "Update authenticated user profile media",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            "multipart/form-data": {
                                "schema": {"$ref": "#/components/schemas/UpdateProfileMediaRequest"}
                            }
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Profile media updated successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {"type": "object"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Validation error", "content": {APP_JSON: {"schema": {"$ref": ERROR_SCHEMA_REF}}}},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Profile completion required"},
                    },
                }
            },
            "/api/v1/notifications/": {
                "get": {
                    "tags": ["Notifications"],
                    "summary": "Get authenticated user notifications",
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
                            "description": "Notifications retrieved successfully",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "notifications": {
                                                        "type": "array",
                                                        "items": {"$ref": "#/components/schemas/Notification"},
                                                    },
                                                    "count": {"type": "integer"},
                                                },
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/notifications/{id}/read": {
                "patch": {
                    "tags": ["Notifications"],
                    "summary": "Mark a notification as read",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": True,
                            "schema": {"type": "integer"},
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Notification marked as read",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "object",
                                                "properties": {
                                                    "notification": {"$ref": "#/components/schemas/Notification"},
                                                },
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                        "404": {"description": "Notification not found"},
                    },
                }
            },
            "/api/v1/notifications/read-all": {
                "patch": {
                    "tags": ["Notifications"],
                    "summary": "Mark all notifications as read",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {
                            "description": "All notifications marked as read",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {"type": "object"},
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/chat/conversations": {
                "get": {
                    "tags": ["Chat"],
                    "summary": "Get list of user conversations",
                    "security": [{"bearerAuth": []}],
                    "responses": {
                        "200": {
                            "description": "Conversations retrieved",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "array",
                                                "items": {"$ref": "#/components/schemas/Conversation"},
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/chat/conversations/{id}/messages": {
                "get": {
                    "tags": ["Chat"],
                    "summary": "Get message history for a conversation",
                    "security": [{"bearerAuth": []}],
                    "parameters": [
                        {"name": "id", "in": "path", "required": True, "schema": {"type": "integer"}},
                        {"name": "limit", "in": "query", "required": False, "schema": {"type": "integer", "default": 20}},
                        {"name": "offset", "in": "query", "required": False, "schema": {"type": "integer", "default": 0}},
                    ],
                    "responses": {
                        "200": {
                            "description": "Messages retrieved",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {
                                                "type": "array",
                                                "items": {"$ref": "#/components/schemas/Message"},
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
            "/api/v1/chat/messages": {
                "post": {
                    "tags": ["Chat"],
                    "summary": "Send a message",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {
                                "schema": {
                                    "type": "object",
                                    "required": ["receiver_id", "content"],
                                    "properties": {
                                        "receiver_id": {"type": "integer"},
                                        "content": {"type": "string", "minLength": 1},
                                    },
                                }
                            }
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Message sent",
                            "content": {
                                APP_JSON: {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "success": {"type": "boolean"},
                                            "message": {"type": "string"},
                                            "data": {"$ref": "#/components/schemas/Message"},
                                        },
                                    }
                                }
                            },
                        },
                        "400": {"description": "Bad request"},
                        "401": {"description": "Unauthorized"},
                        "403": {"description": "Forbidden (no match)"},
                    },
                }
            },
            "/api/v1/chat/messages/read": {
                "patch": {
                    "tags": ["Chat"],
                    "summary": "Mark messages in a conversation as read",
                    "security": [{"bearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            APP_JSON: {
                                "schema": {
                                    "type": "object",
                                    "required": ["conversation_id"],
                                    "properties": {
                                        "conversation_id": {"type": "integer"},
                                    },
                                }
                            }
                        },
                    },
                    "responses": {
                        "200": {
                            "description": "Messages marked as read",
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
                        "401": {"description": "Unauthorized"},
                    },
                }
            },
        },
    }