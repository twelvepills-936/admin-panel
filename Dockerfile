# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod ./
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Build application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/service

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata postgresql-client
WORKDIR /root/

# Copy binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/internal/migrations ./migrations

# Expose port
EXPOSE 8090

# Run migrations and start application
CMD ["./main"]

