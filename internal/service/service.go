package service

import (
	"net/http"

	"adminkaback/internal/middleware"
	"adminkaback/internal/usecase"
	"adminkaback/pkg/config"

	"github.com/gin-gonic/gin"
)

// Service содержит HTTP handlers и роутинг.
type Service struct {
	router  *gin.Engine
	useCase *usecase.UseCase
	cfg     *config.Config
}

// NewService создает новый экземпляр Service.
func NewService(useCase *usecase.UseCase, cfg *config.Config) *Service {
	router := gin.Default()

	service := &Service{
		router:  router,
		useCase: useCase,
		cfg:     cfg,
	}

	service.setupRoutes()

	return service
}

// setupRoutes настраивает маршруты приложения.
func (s *Service) setupRoutes() {
	// CORS middleware
	s.router.Use(middleware.CORSMiddleware(s.cfg))

	// Health check
	s.router.GET("/_hc", s.healthCheck)

	// API v1
	v1 := s.router.Group("/api/v1")
	{
		// Auth endpoints (публичные)
		auth := v1.Group("/auth")
		{
			auth.POST("/register", s.register)
			auth.POST("/login", s.login)
			auth.POST("/refresh", s.refreshToken)
			auth.POST("/logout", s.logout)
		}

		// Protected endpoints
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware(s.useCase, s.cfg))
		{
			protected.GET("/auth/me", s.getCurrentAdmin)

			// Users endpoints
			users := protected.Group("/users")
			{
				users.GET("", s.getUsers)
				users.GET("/:id", s.getUser)
				users.POST("", s.createUser)
				users.PUT("/:id", s.updateUser)
				users.DELETE("/:id", s.deleteUser)
			}
		}
	}
}

// Handler возвращает HTTP handler для использования в http.Server.
func (s *Service) Handler() http.Handler {
	return s.router
}
