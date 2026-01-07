package service

import (
	"net/http"
	"strconv"

	usecasemodels "adminkaback/internal/usecase/models"

	"github.com/gin-gonic/gin"
)

// getUsers обрабатывает получение списка пользователей.
func (s *Service) getUsers(c *gin.Context) {
	req := &usecasemodels.GetUsersRequest{
		Page:   1,
		Limit:  10,
		Search: "",
		Sort:   "created_at",
		Order:  "desc",
	}

	if pageStr := c.Query("page"); pageStr != "" {
		if page, err := strconv.Atoi(pageStr); err == nil && page > 0 {
			req.Page = page
		}
	}

	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			req.Limit = limit
		}
	}

	if search := c.Query("search"); search != "" {
		req.Search = search
	}

	if sort := c.Query("sort"); sort != "" {
		req.Sort = sort
	}

	if order := c.Query("order"); order != "" {
		req.Order = order
	}

	req.Status = c.QueryArray("status")
	req.Role = c.QueryArray("role")

	resp, err := s.useCase.GetUsers(c.Request.Context(), req)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

// getUser обрабатывает получение пользователя по ID.
func (s *Service) getUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "User ID is required",
			},
		})

		return
	}

	user, err := s.useCase.GetUser(c.Request.Context(), id)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    user,
	})
}

// createUser обрабатывает создание пользователя.
func (s *Service) createUser(c *gin.Context) {
	var req usecasemodels.CreateUserRequest
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

	user, err := s.useCase.CreateUser(c.Request.Context(), &req)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    user,
	})
}

// updateUser обрабатывает обновление пользователя.
func (s *Service) updateUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "User ID is required",
			},
		})

		return
	}

	var req usecasemodels.UpdateUserRequest
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

	user, err := s.useCase.UpdateUser(c.Request.Context(), id, &req)
	if err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    user,
	})
}

// deleteUser обрабатывает удаление пользователя.
func (s *Service) deleteUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "User ID is required",
			},
		})

		return
	}

	if err := s.useCase.DeleteUser(c.Request.Context(), id); err != nil {
		s.handleError(c, err)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User deleted successfully",
	})
}
