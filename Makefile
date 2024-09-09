CONTAINER_NAME=postgres
POSTGRES_USER=shlee
POSTGRES_PORT=5432
POSTGRES_VOLUME=/Users/leeseunghwan/dev/postgres:/var/lib/postgresql/data
POSTGRES_IMAGE=postgres

ask_password:
	@read -s -p "Enter PostgreSQL password: " POSTGRES_PASSWORD; \
	if [ -z "$$POSTGRES_PASSWORD" ]; then \
		echo "Password cannot be empty!"; exit 1; \
	fi; \
	echo $$POSTGRES_PASSWORD > .postgres_pass

run-postgres: ask_password
	@POSTGRES_PASSWORD=$$(cat .postgres_pass); \
	if docker ps -a --format '{{.Names}}' | grep -Eq "^$(CONTAINER_NAME)$$"; then \
		echo "Container $(CONTAINER_NAME) already exists. Use 'make restart-postgres' to restart."; \
	else \
		docker run --name $(CONTAINER_NAME) \
			-e POSTGRES_USER=$(POSTGRES_USER) \
			-e POSTGRES_PASSWORD=$$POSTGRES_PASSWORD \
			-v $(POSTGRES_VOLUME) \
			-p $(POSTGRES_PORT):5432 \
			-d $(POSTGRES_IMAGE); \
	fi

restart-postgres:
	@docker restart $(CONTAINER_NAME)

stop-postgres:
	@docker stop $(CONTAINER_NAME) || true
	@docker rm $(CONTAINER_NAME) || true
	@rm -f .postgres_pass
