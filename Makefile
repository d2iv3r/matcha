DOCKER_COMPOSE_DEV=docker-compose.yml
DOCKER_COMPOSE_PROD=docker-compose.prod.yml

# ── Dev targets ───────────────────────────────────────────────────────────────
all: up

up:
	docker compose -f $(DOCKER_COMPOSE_DEV) --env-file .env up

build:
	docker compose -f $(DOCKER_COMPOSE_DEV) --env-file .env up --build

down:
	docker compose -f $(DOCKER_COMPOSE_DEV) --env-file .env down

clean:
	docker compose -f $(DOCKER_COMPOSE_DEV) --env-file .env down --volumes

fclean:
	docker compose -f $(DOCKER_COMPOSE_DEV) --env-file .env down --volumes --rmi all

seed:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed

seed-clear:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-clear

seed-info:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-info

# ── Prod targets ──────────────────────────────────────────────────────────────
prod-up:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod up -d

prod-build:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod up -d --build

prod-down:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod down

prod-clean:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod down --volumes

prod-fclean:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod down --volumes --rmi all

prod-logs:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod logs -f

prod-ps:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file .env.prod ps

.PHONY: all up build down clean fclean seed seed-clear seed-info \
        prod-up prod-build prod-down prod-clean prod-fclean prod-logs prod-ps