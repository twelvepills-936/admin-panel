package usecase

import (
	"context"
	"fmt"
	"math"
	"strings"
	"time"

	repositorymodels "adminkaback/internal/repository/models"
	usecasemodels "adminkaback/internal/usecase/models"

	"github.com/google/uuid"
)

// GetUsers получает список пользователей с фильтрацией и пагинацией.
func (uc *UseCase) GetUsers(ctx context.Context, req *usecasemodels.GetUsersRequest) (*usecasemodels.GetUsersResponse, error) {
	if req.Page < 1 {
		req.Page = 1
	}
	if req.Limit < 1 {
		req.Limit = 10
	}
	if req.Limit > 100 {
		req.Limit = 100
	}

	users, total, err := uc.userRepo.GetUsers(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("get users: %w", err)
	}

	userResponses := make([]usecasemodels.UserResponse, 0, len(users))
	for _, user := range users {
		userResponses = append(userResponses, uc.userToResponse(&user))
	}

	totalPages := int(math.Ceil(float64(total) / float64(req.Limit)))

	return &usecasemodels.GetUsersResponse{
		Data:       userResponses,
		Total:      total,
		Page:       req.Page,
		Limit:      req.Limit,
		TotalPages: totalPages,
	}, nil
}

// GetUser получает пользователя по ID.
func (uc *UseCase) GetUser(ctx context.Context, id string) (*usecasemodels.UserResponse, error) {
	user, err := uc.userRepo.GetUserByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	if user == nil {
		return nil, usecasemodels.ErrUserNotFound
	}

	response := uc.userToResponse(user)
	return &response, nil
}

// CreateUser создает нового пользователя.
func (uc *UseCase) CreateUser(ctx context.Context, req *usecasemodels.CreateUserRequest) (*usecasemodels.UserResponse, error) {
	if err := uc.validateCreateUserRequest(req); err != nil {
		return nil, err
	}

	existingUser, err := uc.userRepo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("get user by email: %w", err)
	}

	if existingUser != nil {
		return nil, usecasemodels.ErrUserAlreadyExists
	}

	now := time.Now()
	user := &repositorymodels.User{
		ID:              uuid.New().String(),
		Email:           req.Email,
		Name:            req.Name,
		Phone:           req.Phone,
		Role:            req.Role,
		Status:          req.Status,
		IsEmailVerified: false,
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	if err := uc.userRepo.CreateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}

	response := uc.userToResponse(user)
	return &response, nil
}

// UpdateUser обновляет данные пользователя.
func (uc *UseCase) UpdateUser(ctx context.Context, id string, req *usecasemodels.UpdateUserRequest) (*usecasemodels.UserResponse, error) {
	user, err := uc.userRepo.GetUserByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get user by id: %w", err)
	}

	if user == nil {
		return nil, usecasemodels.ErrUserNotFound
	}

	if err := uc.validateUpdateUserRequest(req); err != nil {
		return nil, err
	}

	updateUser := &repositorymodels.User{
		Name:   user.Name,
		Phone:  user.Phone,
		Role:   user.Role,
		Status: user.Status,
	}

	if req.Name != nil {
		updateUser.Name = *req.Name
	}
	if req.Phone != nil {
		updateUser.Phone = req.Phone
	}
	if req.Role != nil {
		updateUser.Role = *req.Role
	}
	if req.Status != nil {
		updateUser.Status = *req.Status
	}

	if err := uc.userRepo.UpdateUser(ctx, id, updateUser); err != nil {
		return nil, fmt.Errorf("update user: %w", err)
	}

	updatedUser, err := uc.userRepo.GetUserByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get updated user: %w", err)
	}

	response := uc.userToResponse(updatedUser)
	return &response, nil
}

// DeleteUser удаляет пользователя (soft delete).
func (uc *UseCase) DeleteUser(ctx context.Context, id string) error {
	user, err := uc.userRepo.GetUserByID(ctx, id)
	if err != nil {
		return fmt.Errorf("get user by id: %w", err)
	}

	if user == nil {
		return usecasemodels.ErrUserNotFound
	}

	if err := uc.userRepo.DeleteUser(ctx, id); err != nil {
		return fmt.Errorf("delete user: %w", err)
	}

	return nil
}

// userToResponse преобразует модель пользователя в ответ.
func (uc *UseCase) userToResponse(user *repositorymodels.User) usecasemodels.UserResponse {
	return usecasemodels.UserResponse{
		ID:              user.ID,
		Email:           user.Email,
		Name:            user.Name,
		Phone:           user.Phone,
		Role:            user.Role,
		Status:          user.Status,
		IsEmailVerified: user.IsEmailVerified,
		CreatedAt:       user.CreatedAt.Format(time.RFC3339),
		UpdatedAt:       user.UpdatedAt.Format(time.RFC3339),
	}
}

// validateCreateUserRequest валидирует запрос на создание пользователя.
func (uc *UseCase) validateCreateUserRequest(req *usecasemodels.CreateUserRequest) error {
	if req.Email == "" {
		return usecasemodels.ErrorInvalidParameterEmail
	}

	if !strings.Contains(req.Email, "@") {
		return usecasemodels.ErrorInvalidParameterEmail
	}

	if req.Name == "" {
		return usecasemodels.ErrorInvalidParameterName
	}

	if req.Role != "" {
		validRoles := []string{"user", "admin", "moderator"}
		valid := false
		for _, role := range validRoles {
			if req.Role == role {
				valid = true
				break
			}
		}
		if !valid {
			return usecasemodels.ErrorInvalidParameterRole
		}
	}

	if req.Status != "" {
		validStatuses := []string{"active", "inactive", "banned"}
		valid := false
		for _, status := range validStatuses {
			if req.Status == status {
				valid = true
				break
			}
		}
		if !valid {
			return usecasemodels.ErrorInvalidParameterStatus
		}
	}

	return nil
}

// validateUpdateUserRequest валидирует запрос на обновление пользователя.
func (uc *UseCase) validateUpdateUserRequest(req *usecasemodels.UpdateUserRequest) error {
	if req.Name != nil && *req.Name == "" {
		return usecasemodels.ErrorInvalidParameterName
	}

	if req.Role != nil {
		validRoles := []string{"user", "admin", "moderator"}
		valid := false
		for _, role := range validRoles {
			if *req.Role == role {
				valid = true
				break
			}
		}
		if !valid {
			return usecasemodels.ErrorInvalidParameterRole
		}
	}

	if req.Status != nil {
		validStatuses := []string{"active", "inactive", "banned"}
		valid := false
		for _, status := range validStatuses {
			if *req.Status == status {
				valid = true
				break
			}
		}
		if !valid {
			return usecasemodels.ErrorInvalidParameterStatus
		}
	}

	return nil
}
