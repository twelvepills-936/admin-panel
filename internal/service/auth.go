package service

import (
	"errors"
	"log"
	"net/http"

	usecasemodels "adminkaback/internal/usecase/models"

	"github.com/gin-gonic/gin"
)

// register обрабатывает регистрацию администратора.
func (s *Service) register(c *gin.Context) {
	var req usecasemodels.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "Invalid request body",
			},
		})

		return
	}

	resp, err := s.useCase.Register(c.Request.Context(), &req)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    resp,
	})
}

// login обрабатывает вход администратора.
func (s *Service) login(c *gin.Context) {
	var req usecasemodels.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "Invalid request body",
			},
		})

		return
	}

	resp, err := s.useCase.Login(c.Request.Context(), &req)
	if err != nil {
		// Логируем ошибку для отладки
		c.Error(err)
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

// refreshToken обрабатывает обновление токена.
func (s *Service) refreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "refresh_token is required",
			},
		})

		return
	}

	resp, err := s.useCase.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

// logout обрабатывает выход администратора.
func (s *Service) logout(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "refresh_token is required",
			},
		})

		return
	}

	if err := s.useCase.Logout(c.Request.Context(), req.RefreshToken); err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logged out successfully",
	})
}

// getCurrentAdmin возвращает данные текущего администратора.
func (s *Service) getCurrentAdmin(c *gin.Context) {
	adminID, exists := c.Get("admin_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Unauthorized",
			},
		})

		return
	}

	adminIDStr, ok := adminID.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Invalid admin ID type",
			},
		})

		return
	}

	admin, err := s.useCase.GetCurrentAdmin(c.Request.Context(), adminIDStr)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    admin,
	})
}

// healthCheck обрабатывает health check запрос.
func (s *Service) healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

// handleError обрабатывает ошибки и возвращает соответствующий HTTP ответ.
func (s *Service) handleError(c *gin.Context, err error) {
	// Логируем все ошибки для отладки
	if err != nil {
		// Используем стандартный логгер Go
		log.Printf("Error in handler: %v", err)
	}
	if errors.Is(err, usecasemodels.ErrorInvalidParameterEmail) ||
		errors.Is(err, usecasemodels.ErrorInvalidParameterPassword) ||
		errors.Is(err, usecasemodels.ErrorInvalidParameterName) {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrInvalidCredentials) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INVALID_CREDENTIALS",
				"message": "Invalid email or password",
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrUnauthorized) ||
		errors.Is(err, usecasemodels.ErrInvalidToken) ||
		errors.Is(err, usecasemodels.ErrExpiredToken) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": err.Error(),
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrAdminNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": err.Error(),
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrAdminAlreadyExists) {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "CONFLICT",
				"message": err.Error(),
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrUserNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": err.Error(),
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrUserAlreadyExists) {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "CONFLICT",
				"message": err.Error(),
			},
		})

		return
	}

	if errors.Is(err, usecasemodels.ErrorInvalidParameterRole) ||
		errors.Is(err, usecasemodels.ErrorInvalidParameterStatus) {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})

		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{
		"success": false,
		"error": gin.H{
			"code":    "INTERNAL_ERROR",
			"message": "Internal server error",
		},
	})
}
