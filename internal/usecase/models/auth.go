package models

import "errors"

var (
	// ErrorInvalidParameterEmail возвращается при невалидном email.
	ErrorInvalidParameterEmail = errors.New("ErrorInvalidParameterEmail")
	// ErrorInvalidParameterPassword возвращается при невалидном пароле.
	ErrorInvalidParameterPassword = errors.New("ErrorInvalidParameterPassword")
	// ErrorInvalidParameterName возвращается при невалидном имени.
	ErrorInvalidParameterName = errors.New("ErrorInvalidParameterName")
	// ErrUnauthorized возвращается при отсутствии авторизации.
	ErrUnauthorized = errors.New("unauthorized")
	// ErrInvalidCredentials возвращается при неверных учетных данных.
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrAdminAlreadyExists возвращается при попытке создать существующего администратора.
	ErrAdminAlreadyExists = errors.New("admin already exists")
	// ErrAdminNotFound возвращается когда администратор не найден.
	ErrAdminNotFound = errors.New("admin not found")
	// ErrInvalidToken возвращается при невалидном токене.
	ErrInvalidToken = errors.New("invalid token")
	// ErrExpiredToken возвращается при истекшем токене.
	ErrExpiredToken = errors.New("expired token")
)

// RegisterRequest представляет запрос на регистрацию.
type RegisterRequest struct {
	Email    string
	Password string
	Name     string
}

// LoginRequest представляет запрос на вход.
type LoginRequest struct {
	Email    string
	Password string
}

// AuthResponse представляет ответ с токенами и данными администратора.
type AuthResponse struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	Admin        AdminResponse `json:"admin"`
}

// RefreshTokenResponse представляет ответ с новым access токеном.
type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

// AdminResponse представляет данные администратора.
type AdminResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
}
