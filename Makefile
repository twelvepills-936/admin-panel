.PHONY: run build test lint migrate-up migrate-down migrate-create docker-up docker-down

# Run application
run:
	go run cmd/service/main.go

# Build application
build:
	go build -o bin/adminkaback ./cmd/service

# Run tests
test:
	go test -v ./...

# Lint code
lint:
	golangci-lint run ./...

# Run migrations up
migrate-up:
	goose -dir ./internal/migrations postgres "postgres://postgres:postgres@localhost:5432/adminkaback?sslmode=disable" up

# Run migrations down
migrate-down:
	goose -dir ./internal/migrations postgres "postgres://postgres:postgres@localhost:5432/adminkaback?sslmode=disable" down

# Create new migration
migrate-create:
	@read -p "Enter migration name: " name; \
	goose -dir ./internal/migrations create $$name sql

# Start docker containers
docker-up:
	docker-compose up -d

# Stop docker containers
docker-down:
	docker-compose down

# View logs
docker-logs:
	docker-compose logs -f

