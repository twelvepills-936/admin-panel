package middleware

import (
	"fmt"
	"strings"

	"adminkaback/pkg/config"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware настраивает CORS для работы с фронтендом.
func CORSMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Проверяем, разрешен ли origin
		allowedOrigin := getAllowedOrigin(origin, cfg.Server.CORS.AllowedOrigins)
		if allowedOrigin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		}

		if cfg.Server.CORS.AllowCredentials {
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		if len(cfg.Server.CORS.AllowedMethods) > 0 {
			c.Writer.Header().Set("Access-Control-Allow-Methods", strings.Join(cfg.Server.CORS.AllowedMethods, ", "))
		}

		if len(cfg.Server.CORS.AllowedHeaders) > 0 {
			c.Writer.Header().Set("Access-Control-Allow-Headers", strings.Join(cfg.Server.CORS.AllowedHeaders, ", "))
		}

		if cfg.Server.CORS.MaxAge > 0 {
			c.Writer.Header().Set("Access-Control-Max-Age", fmt.Sprintf("%d", cfg.Server.CORS.MaxAge))
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)

			return
		}

		c.Next()
	}
}

// getAllowedOrigin проверяет, разрешен ли origin для CORS.
func getAllowedOrigin(origin string, allowedOrigins []string) string {
	if len(allowedOrigins) == 0 {
		return ""
	}

	// Если разрешен "*", возвращаем его (но только если credentials не требуются)
	if len(allowedOrigins) == 1 && allowedOrigins[0] == "*" {
		return "*"
	}

	// Проверяем точное совпадение
	for _, allowed := range allowedOrigins {
		if origin == allowed {
			return allowed
		}
	}

	return ""
}
