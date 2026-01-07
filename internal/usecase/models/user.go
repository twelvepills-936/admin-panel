package models

import "errors"

var (
	// ErrorInvalidParameterRole возвращается при невалидной роли.
	ErrorInvalidParameterRole = errors.New("ErrorInvalidParameterRole")
	// ErrorInvalidParameterStatus возвращается при невалидном статусе.
	ErrorInvalidParameterStatus = errors.New("ErrorInvalidParameterStatus")
	// ErrUserNotFound возвращается когда пользователь не найден.
	ErrUserNotFound = errors.New("user not found")
	// ErrUserAlreadyExists возвращается при попытке создать существующего пользователя.
	ErrUserAlreadyExists = errors.New("user already exists")
)

// UserResponse представляет данные пользователя в ответе.
type UserResponse struct {
	ID              string  `json:"id"`
	Email           string  `json:"email"`
	Name            string  `json:"name"`
	Phone           *string `json:"phone"`
	Role            string  `json:"role"`
	Status          string  `json:"status"`
	IsEmailVerified bool    `json:"is_email_verified"`
	CreatedAt       string  `json:"created_at"`
	UpdatedAt       string  `json:"updated_at"`
}

// GetUsersRequest представляет запрос на получение списка пользователей.
type GetUsersRequest struct {
	Page   int
	Limit  int
	Search string
	Status []string
	Role   []string
	Sort   string
	Order  string
}

// GetUsersResponse представляет ответ со списком пользователей.
type GetUsersResponse struct {
	Data       []UserResponse `json:"data"`
	Total      int            `json:"total"`
	Page       int            `json:"page"`
	Limit      int            `json:"limit"`
	TotalPages int            `json:"total_pages"`
}

// CreateUserRequest представляет запрос на создание пользователя.
type CreateUserRequest struct {
	Email  string
	Name   string
	Phone  *string
	Role   string
	Status string
}

// UpdateUserRequest представляет запрос на обновление пользователя.
type UpdateUserRequest struct {
	Name   *string
	Phone  *string
	Role   *string
	Status *string
}
