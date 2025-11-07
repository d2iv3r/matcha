DOCKER_COMPOSE_NAME=docker-compose.dev.yml

all: up

up:
	sudo docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env up

build:
	sudo docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env build

down:
	sudo docker compose -f $(DOCKER_COMPOSE_NAME) --env-file .env down