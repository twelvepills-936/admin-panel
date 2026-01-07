package internal

import (
	"context"

	repositorymodels "adminkaback/internal/repository/models"
	usecasemodels "adminkaback/internal/usecase/models"
)

// AuthRepository определяет интерфейс для работы с аутентификацией в БД.
type AuthRepository interface {
	CreateAdmin(ctx context.Context, admin *repositorymodels.Admin) error
	GetAdminByEmail(ctx context.Context, email string) (*repositorymodels.Admin, error)
	GetAdminByID(ctx context.Context, id string) (*repositorymodels.Admin, error)
	CreateRefreshToken(ctx context.Context, token *repositorymodels.RefreshToken) error
	GetRefreshToken(ctx context.Context, token string) (*repositorymodels.RefreshToken, error)
	DeleteRefreshToken(ctx context.Context, token string) error
	DeleteRefreshTokensByAdminID(ctx context.Context, adminID string) error
}

// AuthUseCase определяет интерфейс для бизнес-логики аутентификации.
type AuthUseCase interface {
	Register(ctx context.Context, req *usecasemodels.RegisterRequest) (*usecasemodels.AuthResponse, error)
	Login(ctx context.Context, req *usecasemodels.LoginRequest) (*usecasemodels.AuthResponse, error)
	RefreshToken(ctx context.Context, refreshToken string) (*usecasemodels.RefreshTokenResponse, error)
	Logout(ctx context.Context, refreshToken string) error
	GetCurrentAdmin(ctx context.Context, adminID string) (*usecasemodels.AdminResponse, error)
}

// UserRepository определяет интерфейс для работы с пользователями в БД.
type UserRepository interface {
	CreateUser(ctx context.Context, user *repositorymodels.User) error
	GetUserByID(ctx context.Context, id string) (*repositorymodels.User, error)
	GetUserByEmail(ctx context.Context, email string) (*repositorymodels.User, error)
	GetUsers(ctx context.Context, req *usecasemodels.GetUsersRequest) ([]repositorymodels.User, int, error)
	UpdateUser(ctx context.Context, id string, user *repositorymodels.User) error
	DeleteUser(ctx context.Context, id string) error
}

// UserUseCase определяет интерфейс для бизнес-логики пользователей.
type UserUseCase interface {
	GetUsers(ctx context.Context, req *usecasemodels.GetUsersRequest) (*usecasemodels.GetUsersResponse, error)
	GetUser(ctx context.Context, id string) (*usecasemodels.UserResponse, error)
	CreateUser(ctx context.Context, req *usecasemodels.CreateUserRequest) (*usecasemodels.UserResponse, error)
	UpdateUser(ctx context.Context, id string, req *usecasemodels.UpdateUserRequest) (*usecasemodels.UserResponse, error)
	DeleteUser(ctx context.Context, id string) error
}
