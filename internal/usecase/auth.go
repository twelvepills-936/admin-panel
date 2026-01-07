package usecase

import (
	"context"
	"fmt"
	"time"

	repositorymodels "adminkaback/internal/repository/models"
	usecasemodels "adminkaback/internal/usecase/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Register регистрирует нового администратора.
func (uc *UseCase) Register(ctx context.Context, req *usecasemodels.RegisterRequest) (*usecasemodels.AuthResponse, error) {
	if err := uc.validateRegisterRequest(req); err != nil {
		return nil, err
	}

	existingAdmin, err := uc.authRepo.GetAdminByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("get admin by email: %w", err)
	}

	if existingAdmin != nil {
		return nil, usecasemodels.ErrAdminAlreadyExists
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	now := time.Now()
	admin := &repositorymodels.Admin{
		ID:           uuid.New().String(),
		Email:        req.Email,
		PasswordHash: string(passwordHash),
		Name:         req.Name,
		Role:         "admin",
		IsActive:     true,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	if err := uc.authRepo.CreateAdmin(ctx, admin); err != nil {
		return nil, fmt.Errorf("create admin: %w", err)
	}

	accessToken, err := uc.jwtMgr.GenerateAccessToken(admin.ID, admin.Email, admin.Role)
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}

	refreshToken, err := uc.jwtMgr.GenerateRefreshToken(admin.ID)
	if err != nil {
		return nil, fmt.Errorf("generate refresh token: %w", err)
	}

	refreshTokenModel := &repositorymodels.RefreshToken{
		ID:        uuid.New().String(),
		AdminID:   admin.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(uc.cfg.JWT.RefreshTTL),
		CreatedAt: time.Now(),
	}

	if err := uc.authRepo.CreateRefreshToken(ctx, refreshTokenModel); err != nil {
		return nil, fmt.Errorf("create refresh token: %w", err)
	}

	return &usecasemodels.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Admin: usecasemodels.AdminResponse{
			ID:    admin.ID,
			Email: admin.Email,
			Name:  admin.Name,
			Role:  admin.Role,
		},
	}, nil
}

// Login выполняет вход администратора.
func (uc *UseCase) Login(ctx context.Context, req *usecasemodels.LoginRequest) (*usecasemodels.AuthResponse, error) {
	if err := uc.validateLoginRequest(req); err != nil {
		return nil, err
	}

	admin, err := uc.authRepo.GetAdminByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("get admin by email: %w", err)
	}

	if admin == nil {
		return nil, usecasemodels.ErrInvalidCredentials
	}

	if !admin.IsActive {
		return nil, usecasemodels.ErrUnauthorized
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, usecasemodels.ErrInvalidCredentials
	}

	accessToken, err := uc.jwtMgr.GenerateAccessToken(admin.ID, admin.Email, admin.Role)
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}

	refreshToken, err := uc.jwtMgr.GenerateRefreshToken(admin.ID)
	if err != nil {
		return nil, fmt.Errorf("generate refresh token: %w", err)
	}

	refreshTokenModel := &repositorymodels.RefreshToken{
		ID:        uuid.New().String(),
		AdminID:   admin.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(uc.cfg.JWT.RefreshTTL),
		CreatedAt: time.Now(),
	}

	if err := uc.authRepo.CreateRefreshToken(ctx, refreshTokenModel); err != nil {
		return nil, fmt.Errorf("create refresh token: %w", err)
	}

	return &usecasemodels.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Admin: usecasemodels.AdminResponse{
			ID:    admin.ID,
			Email: admin.Email,
			Name:  admin.Name,
			Role:  admin.Role,
		},
	}, nil
}

// RefreshToken обновляет access токен по refresh токену.
func (uc *UseCase) RefreshToken(ctx context.Context, refreshToken string) (*usecasemodels.RefreshTokenResponse, error) {
	tokenModel, err := uc.authRepo.GetRefreshToken(ctx, refreshToken)
	if err != nil {
		return nil, fmt.Errorf("get refresh token: %w", err)
	}

	if tokenModel == nil {
		return nil, usecasemodels.ErrInvalidToken
	}

	if time.Now().After(tokenModel.ExpiresAt) {
		return nil, usecasemodels.ErrExpiredToken
	}

	admin, err := uc.authRepo.GetAdminByID(ctx, tokenModel.AdminID)
	if err != nil {
		return nil, fmt.Errorf("get admin by id: %w", err)
	}

	if admin == nil || !admin.IsActive {
		return nil, usecasemodels.ErrUnauthorized
	}

	accessToken, err := uc.jwtMgr.GenerateAccessToken(admin.ID, admin.Email, admin.Role)
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}

	return &usecasemodels.RefreshTokenResponse{
		AccessToken: accessToken,
	}, nil
}

// Logout выполняет выход администратора.
func (uc *UseCase) Logout(ctx context.Context, refreshToken string) error {
	if err := uc.authRepo.DeleteRefreshToken(ctx, refreshToken); err != nil {
		return fmt.Errorf("delete refresh token: %w", err)
	}

	return nil
}

// GetCurrentAdmin получает данные текущего администратора.
func (uc *UseCase) GetCurrentAdmin(ctx context.Context, adminID string) (*usecasemodels.AdminResponse, error) {
	admin, err := uc.authRepo.GetAdminByID(ctx, adminID)
	if err != nil {
		return nil, fmt.Errorf("get admin by id: %w", err)
	}

	if admin == nil {
		return nil, usecasemodels.ErrAdminNotFound
	}

	return &usecasemodels.AdminResponse{
		ID:    admin.ID,
		Email: admin.Email,
		Name:  admin.Name,
		Role:  admin.Role,
	}, nil
}

func (uc *UseCase) validateRegisterRequest(req *usecasemodels.RegisterRequest) error {
	if req.Email == "" {
		return usecasemodels.ErrorInvalidParameterEmail
	}

	if req.Password == "" || len(req.Password) < 8 {
		return usecasemodels.ErrorInvalidParameterPassword
	}

	if req.Name == "" {
		return usecasemodels.ErrorInvalidParameterName
	}

	return nil
}

func (uc *UseCase) validateLoginRequest(req *usecasemodels.LoginRequest) error {
	if req.Email == "" {
		return usecasemodels.ErrorInvalidParameterEmail
	}

	if req.Password == "" {
		return usecasemodels.ErrorInvalidParameterPassword
	}

	return nil
}
