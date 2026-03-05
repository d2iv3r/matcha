# Dockerfile Comparison & Best Practices

## 📦 Available Dockerfiles

### 1. **Dockerfile.dev** - Development
**Location**: `backend/docker/Dockerfile.dev`

**Features**:
- Hot reload enabled
- Dev dependencies included
- Debugging tools
- Volume mounting for live code changes

**Use when**: Local development

```bash
docker-compose -f docker-compose.dev.yml up
```

### 2. **Dockerfile.prod** - Production (Simple)
**Location**: `backend/docker/Dockerfile.prod`

**Features**:
- Gunicorn WSGI server
- Non-root user for security
- Health checks
- Production dependencies only
- Minimal image size

**Use when**: Simple production deployment

```bash
docker-compose -f docker-compose.prod.yml up
```

### 3. **Dockerfile.multistage** - Production (Optimized)
**Location**: `backend/docker/Dockerfile.multistage`

**Features**:
- Multi-stage build (smaller image)
- Build dependencies separated
- Optimized layer caching
- Security best practices

**Use when**: Optimized production deployment

## 🎯 Why Use a Dockerfile?

### Benefits:
1. **Consistency** - Same environment everywhere
2. **Isolation** - No dependency conflicts
3. **Portability** - Works on any system
4. **Scalability** - Easy to replicate
5. **CI/CD Ready** - Automated deployments

## 📊 Dockerfile Comparison

| Feature | Development | Production | Multi-stage |
|---------|------------|------------|-------------|
| Image Size | ~500MB | ~200MB | ~150MB |
| Build Time | Fast | Medium | Slower |
| Security | Low | High | High |
| Hot Reload | ✅ | ❌ | ❌ |
| Non-root User | ❌ | ✅ | ✅ |
| Health Check | ❌ | ✅ | ✅ |
| Gunicorn | ❌ | ✅ | ✅ |

## 🔧 Dockerfile Structure

### Development Dockerfile
```dockerfile
FROM python:3.11-slim                    # Base image
ENV PYTHONDONTWRITEBYTECODE=1           # Don't create .pyc files
WORKDIR /app                            # Set working directory
RUN apt-get install -y ...              # System dependencies
COPY requirements-dev.txt .             # Copy dependencies
RUN pip install -r requirements-dev.txt # Install Python packages
COPY . .                                # Copy application code
CMD ["flask", "run", "--reload"]        # Start with hot reload
```

### Production Dockerfile
```dockerfile
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
RUN apt-get install -y postgresql-client # Runtime deps only
RUN useradd -m appuser                   # Non-root user
COPY requirements.txt .
RUN pip install -r requirements.txt      # Production deps only
COPY --chown=appuser:appuser . .        # Copy as appuser
USER appuser                             # Switch to non-root
HEALTHCHECK CMD curl /api/health         # Health check
CMD ["gunicorn", "wsgi:app"]            # Production server
```

## 🚀 Usage Examples

### Development
```bash
# Build and run
docker-compose -f docker-compose.dev.yml up --build

# Run specific service
docker-compose -f docker-compose.dev.yml up app

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Execute commands
docker-compose -f docker-compose.dev.yml exec app bash
docker-compose -f docker-compose.dev.yml exec app python
```

### Production
```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Monitor
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔒 Security Best Practices

### 1. Use Non-Root User
```dockerfile
RUN useradd -m -u 1000 appuser
USER appuser
```

### 2. Multi-Stage Builds
```dockerfile
FROM python:3.11-slim as builder
# Build stage

FROM python:3.11-slim
COPY --from=builder /app/wheels /wheels
# Runtime stage
```

### 3. Minimal Base Image
```dockerfile
FROM python:3.11-slim  # ✅ Good (~150MB)
FROM python:3.11       # ❌ Large (~1GB)
```

### 4. .dockerignore
```
__pycache__/
*.pyc
.venv/
.git/
.env
*.log
```

## 📈 Optimization Tips

### 1. Layer Caching
```dockerfile
# ✅ Good - Dependencies cached
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# ❌ Bad - Rebuild everything on code change
COPY . .
RUN pip install -r requirements.txt
```

### 2. Combine RUN Commands
```dockerfile
# ✅ Good - Single layer
RUN apt-get update && \
    apt-get install -y package && \
    rm -rf /var/lib/apt/lists/*

# ❌ Bad - Multiple layers
RUN apt-get update
RUN apt-get install -y package
RUN rm -rf /var/lib/apt/lists/*
```

### 3. Use Wheels
```dockerfile
# Builder stage
RUN pip wheel --wheel-dir /wheels -r requirements.txt

# Runtime stage
RUN pip install --no-index --find-links=/wheels -r requirements.txt
```

## 🧪 Testing

### Build Image
```bash
docker build -f docker/Dockerfile.dev -t matcha-backend:dev .
```

### Run Container
```bash
docker run -p 5000:5000 --env-file .env matcha-backend:dev
```

### Check Size
```bash
docker images | grep matcha-backend
```

### Inspect Layers
```bash
docker history matcha-backend:dev
```

## 🎯 Recommendation

**For Your Project** (Matcha):

1. **Development**: Use `Dockerfile.dev`
   - Hot reload for fast iteration
   - Full dev tools

2. **Production**: Use `Dockerfile.multistage`
   - Smaller image size
   - Better security
   - Faster deployments

3. **Current Setup**: Keep using docker-compose
   - Manages multiple services
   - Environment variables
   - Networking

## 📝 Next Steps

1. ✅ Dockerfiles created
2. ✅ docker-compose.dev.yml configured
3. ✅ docker-compose.prod.yml created
4. Add nginx configuration
5. Add SSL certificates
6. Setup CI/CD pipeline

Your backend is now **Docker-ready** with both development and production configurations! 🐳
