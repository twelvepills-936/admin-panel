package middleware

import (
	"net/http"
	"strings"

	"adminkaback/internal/usecase"
	"adminkaback/pkg/config"
	"adminkaback/pkg/jwt"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware проверяет JWT токен и добавляет данные администратора в контекст.
func AuthMiddleware(useCase *usecase.UseCase, cfg *config.Config) gin.HandlerFunc {
	jwtMgr := jwt.NewManager(cfg.JWT.Secret, cfg.JWT.AccessTTL, cfg.JWT.RefreshTTL)

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Authorization header is required",
				},
			})
			c.Abort()

			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Invalid authorization header format",
				},
			})
			c.Abort()

			return
		}

		token := parts[1]
		claims, err := jwtMgr.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Invalid or expired token",
				},
			})
			c.Abort()

			return
		}

		c.Set("admin_id", claims.AdminID)
		c.Set("admin_email", claims.Email)
		c.Set("admin_role", claims.Role)

		c.Next()
	}
}
