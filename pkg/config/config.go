package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config содержит всю конфигурацию приложения.
type Config struct {
	App      AppConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Server   ServerConfig
}

// AppConfig содержит конфигурацию приложения.
type AppConfig struct {
	Namespace   string
	Name        string
	Environment string
	LogLevel    string
}

// DatabaseConfig содержит конфигурацию базы данных.
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
	MaxConns int64
	MinConns int64
}

// JWTConfig содержит конфигурацию JWT.
type JWTConfig struct {
	Secret     string
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

// ServerConfig содержит конфигурацию сервера.
type ServerConfig struct {
	HTTPPort string
	Host     string
	CORS     CORSConfig
}

// CORSConfig содержит настройки CORS для фронтенда.
type CORSConfig struct {
	AllowedOrigins   []string
	AllowedMethods   []string
	AllowedHeaders   []string
	AllowCredentials bool
	MaxAge           int
}

// Load загружает конфигурацию из переменных окружения.
func Load() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		// .env файл не обязателен, продолжаем работу
	}

	cfg := &Config{
		App: AppConfig{
			Namespace:   getEnv("APP_NAMESPACE", "ecom"),
			Name:        getEnv("APP_NAME", "adminkaback"),
			Environment: getEnv("APP_ENVIRONMENT", "dev"),
			LogLevel:    getEnv("APP_LOG_LEVEL", "debug"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("PG_HOST", "localhost"),
			Port:     getEnv("PG_PORT", "5432"),
			User:     getEnv("PG_USER", "postgres"),
			Password: getEnvWithFallback("PG_PASS", "PG_PASSWORD", "postgres"),
			DBName:   getEnvWithFallback("PG_DBNAME", "PG_NAME", "adminkaback"),
			SSLMode:  getEnv("PG_SSLMODE", "disable"),
			MaxConns: getEnvAsInt64("PG_POOL_MAX_CONNS", 10),
			MinConns: getEnvAsInt64("PG_POOL_MIN_CONNS", 0),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
			AccessTTL:  getEnvAsDuration("JWT_ACCESS_TTL", 15*time.Minute),
			RefreshTTL: getEnvAsDuration("JWT_REFRESH_TTL", 7*24*time.Hour),
		},
		Server: ServerConfig{
			HTTPPort: getEnv("APP_HTTP_PORT", "8090"),
			Host:     getEnv("APP_HOST", "0.0.0.0"),
			CORS: CORSConfig{
				AllowedOrigins:   getEnvAsStringSlice("CORS_ALLOWED_ORIGINS", []string{"*"}),
				AllowedMethods:   getEnvAsStringSlice("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"}),
				AllowedHeaders:   getEnvAsStringSlice("CORS_ALLOWED_HEADERS", []string{"Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"}),
				AllowCredentials: getEnvAsBool("CORS_ALLOW_CREDENTIALS", true),
				MaxAge:           getEnvAsInt("CORS_MAX_AGE", 3600),
			},
		},
	}

	if err := cfg.validate(); err != nil {
		return nil, fmt.Errorf("validate config: %w", err)
	}

	return cfg, nil
}

// validate проверяет корректность конфигурации.
func (c *Config) validate() error {
	if c.Database.Host == "" {
		return fmt.Errorf("PG_HOST is required")
	}

	if c.Database.User == "" {
		return fmt.Errorf("PG_USER is required")
	}

	if c.Database.DBName == "" {
		return fmt.Errorf("PG_DBNAME is required")
	}

	if c.JWT.Secret == "" || c.JWT.Secret == "your-secret-key-change-in-production" {
		return fmt.Errorf("JWT_SECRET must be set and changed from default")
	}

	return nil
}

// DSN возвращает строку подключения к PostgreSQL.
func (c *DatabaseConfig) DSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return defaultValue
}

func getEnvWithFallback(key1, key2, defaultValue string) string {
	if value := os.Getenv(key1); value != "" {
		return value
	}

	if value := os.Getenv(key2); value != "" {
		return value
	}

	return defaultValue
}

func getEnvAsInt64(key string, defaultValue int64) int64 {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	value, err := strconv.ParseInt(valueStr, 10, 64)
	if err != nil {
		return defaultValue
	}

	return value
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	duration, err := time.ParseDuration(valueStr)
	if err != nil {
		return defaultValue
	}

	return duration
}

func getEnvAsStringSlice(key string, defaultValue []string) []string {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	values := []string{}
	for _, v := range splitString(valueStr, ",") {
		trimmed := trimString(v)
		if trimmed != "" {
			values = append(values, trimmed)
		}
	}

	if len(values) == 0 {
		return defaultValue
	}

	return values
}

func getEnvAsBool(key string, defaultValue bool) bool {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	value, err := strconv.ParseBool(valueStr)
	if err != nil {
		return defaultValue
	}

	return value
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}

	return value
}

func splitString(s, sep string) []string {
	if s == "" {
		return []string{}
	}

	return strings.Split(s, sep)
}

func trimString(s string) string {
	return strings.TrimSpace(s)
}
