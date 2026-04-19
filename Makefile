DOCKER_COMPOSE_NAME=docker-compose.dev.yml

all: up

up:
	docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env up

build:
	docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env up --build

down:
	docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env down

clean:
	docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env down --volumes

fclean:
	docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env down --volumes --rmi all

seed:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed

seed-clear:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-clear

seed-info:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-info