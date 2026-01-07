package usecase

import (
	"adminkaback/internal"
	"adminkaback/pkg/config"
	"adminkaback/pkg/jwt"
)

// UseCase содержит все use cases приложения.
type UseCase struct {
	authRepo internal.AuthRepository
	userRepo internal.UserRepository
	jwtMgr   *jwt.Manager
	cfg      *config.Config
}

// NewUseCase создает новый экземпляр UseCase.
func NewUseCase(
	authRepo internal.AuthRepository,
	userRepo internal.UserRepository,
	jwtMgr *jwt.Manager,
	cfg *config.Config,
) *UseCase {
	return &UseCase{
		authRepo: authRepo,
		userRepo: userRepo,
		jwtMgr:   jwtMgr,
		cfg:      cfg,
	}
}
