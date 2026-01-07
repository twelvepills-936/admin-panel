package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	repositorymodels "adminkaback/internal/repository/models"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
)

// CreateAdmin создает нового администратора в БД.
func (r *Repository) CreateAdmin(ctx context.Context, admin *repositorymodels.Admin) error {
	query, args, err := squirrel.
		Insert("admins").
		Columns("id", "email", "password_hash", "name", "role", "is_active", "created_at", "updated_at").
		Values(admin.ID, admin.Email, admin.PasswordHash, admin.Name, admin.Role, admin.IsActive, admin.CreatedAt, admin.UpdatedAt).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return fmt.Errorf("build insert query: %w", err)
	}

	_, err = r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute insert: %w", err)
	}

	return nil
}

// GetAdminByEmail получает администратора по email.
func (r *Repository) GetAdminByEmail(ctx context.Context, email string) (*repositorymodels.Admin, error) {
	query, args, err := squirrel.
		Select("id", "email", "password_hash", "name", "role", "is_active", "created_at", "updated_at").
		From("admins").
		Where(squirrel.Eq{"email": email}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build select query: %w", err)
	}

	var admin repositorymodels.Admin
	err = r.pool.QueryRow(ctx, query, args...).Scan(
		&admin.ID,
		&admin.Email,
		&admin.PasswordHash,
		&admin.Name,
		&admin.Role,
		&admin.IsActive,
		&admin.CreatedAt,
		&admin.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("scan admin: %w", err)
	}

	return &admin, nil
}

// GetAdminByID получает администратора по ID.
func (r *Repository) GetAdminByID(ctx context.Context, id string) (*repositorymodels.Admin, error) {
	query, args, err := squirrel.
		Select("id", "email", "password_hash", "name", "role", "is_active", "created_at", "updated_at").
		From("admins").
		Where(squirrel.Eq{"id": id}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build select query: %w", err)
	}

	var admin repositorymodels.Admin
	err = r.pool.QueryRow(ctx, query, args...).Scan(
		&admin.ID,
		&admin.Email,
		&admin.PasswordHash,
		&admin.Name,
		&admin.Role,
		&admin.IsActive,
		&admin.CreatedAt,
		&admin.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("scan admin: %w", err)
	}

	return &admin, nil
}

// CreateRefreshToken создает новый refresh токен.
func (r *Repository) CreateRefreshToken(ctx context.Context, token *repositorymodels.RefreshToken) error {
	query, args, err := squirrel.
		Insert("refresh_tokens").
		Columns("id", "admin_id", "token", "expires_at", "created_at").
		Values(token.ID, token.AdminID, token.Token, token.ExpiresAt, token.CreatedAt).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return fmt.Errorf("build insert query: %w", err)
	}

	_, err = r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute insert: %w", err)
	}

	return nil
}

// GetRefreshToken получает refresh токен по значению.
func (r *Repository) GetRefreshToken(ctx context.Context, token string) (*repositorymodels.RefreshToken, error) {
	query, args, err := squirrel.
		Select("id", "admin_id", "token", "expires_at", "created_at").
		From("refresh_tokens").
		Where(squirrel.Eq{"token": token}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build select query: %w", err)
	}

	var refreshToken repositorymodels.RefreshToken
	err = r.pool.QueryRow(ctx, query, args...).Scan(
		&refreshToken.ID,
		&refreshToken.AdminID,
		&refreshToken.Token,
		&refreshToken.ExpiresAt,
		&refreshToken.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("scan refresh token: %w", err)
	}

	return &refreshToken, nil
}

// DeleteRefreshToken удаляет refresh токен.
func (r *Repository) DeleteRefreshToken(ctx context.Context, token string) error {
	query, args, err := squirrel.
		Delete("refresh_tokens").
		Where(squirrel.Eq{"token": token}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return fmt.Errorf("build delete query: %w", err)
	}

	_, err = r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute delete: %w", err)
	}

	return nil
}

// DeleteRefreshTokensByAdminID удаляет все refresh токены администратора.
func (r *Repository) DeleteRefreshTokensByAdminID(ctx context.Context, adminID string) error {
	query, args, err := squirrel.
		Delete("refresh_tokens").
		Where(squirrel.Eq{"admin_id": adminID}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return fmt.Errorf("build delete query: %w", err)
	}

	_, err = r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute delete: %w", err)
	}

	return nil
}

// CleanExpiredRefreshTokens удаляет истекшие refresh токены.
func (r *Repository) CleanExpiredRefreshTokens(ctx context.Context) error {
	query, args, err := squirrel.
		Delete("refresh_tokens").
		Where(squirrel.Lt{"expires_at": time.Now()}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return fmt.Errorf("build delete query: %w", err)
	}

	_, err = r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute delete: %w", err)
	}

	return nil
}
