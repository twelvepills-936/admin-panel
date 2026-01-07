package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	repositorymodels "adminkaback/internal/repository/models"
	usecasemodels "adminkaback/internal/usecase/models"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
)

// CreateUser создает нового пользователя в БД.
func (r *Repository) CreateUser(ctx context.Context, user *repositorymodels.User) error {
	query, args, err := squirrel.
		Insert("users").
		Columns("id", "email", "name", "phone", "role", "status", "is_email_verified", "created_at", "updated_at").
		Values(user.ID, user.Email, user.Name, user.Phone, user.Role, user.Status, user.IsEmailVerified, user.CreatedAt, user.UpdatedAt).
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

// GetUserByID получает пользователя по ID.
func (r *Repository) GetUserByID(ctx context.Context, id string) (*repositorymodels.User, error) {
	query, args, err := squirrel.
		Select("id", "email", "name", "phone", "role", "status", "is_email_verified", "created_at", "updated_at", "deleted_at").
		From("users").
		Where(squirrel.Eq{"id": id}).
		Where(squirrel.Eq{"deleted_at": nil}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build select query: %w", err)
	}

	var user repositorymodels.User
	var deletedAt *time.Time
	err = r.pool.QueryRow(ctx, query, args...).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.Phone,
		&user.Role,
		&user.Status,
		&user.IsEmailVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
		&deletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("scan user: %w", err)
	}

	user.DeletedAt = deletedAt

	return &user, nil
}

// GetUserByEmail получает пользователя по email.
func (r *Repository) GetUserByEmail(ctx context.Context, email string) (*repositorymodels.User, error) {
	query, args, err := squirrel.
		Select("id", "email", "name", "phone", "role", "status", "is_email_verified", "created_at", "updated_at", "deleted_at").
		From("users").
		Where(squirrel.Eq{"email": email}).
		Where(squirrel.Eq{"deleted_at": nil}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build select query: %w", err)
	}

	var user repositorymodels.User
	var deletedAt *time.Time
	err = r.pool.QueryRow(ctx, query, args...).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.Phone,
		&user.Role,
		&user.Status,
		&user.IsEmailVerified,
		&user.CreatedAt,
		&user.UpdatedAt,
		&deletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}

		return nil, fmt.Errorf("scan user: %w", err)
	}

	user.DeletedAt = deletedAt

	return &user, nil
}

// GetUsers получает список пользователей с фильтрацией и пагинацией.
func (r *Repository) GetUsers(ctx context.Context, req *usecasemodels.GetUsersRequest) ([]repositorymodels.User, int, error) {
	// Подсчет общего количества
	countQuery := squirrel.Select("COUNT(*)").From("users").Where(squirrel.Eq{"deleted_at": nil})

	// Применяем фильтры для подсчета
	if len(req.Status) > 0 {
		countQuery = countQuery.Where(squirrel.Eq{"status": req.Status})
	}
	if len(req.Role) > 0 {
		countQuery = countQuery.Where(squirrel.Eq{"role": req.Role})
	}
	if req.Search != "" {
		countQuery = countQuery.Where(squirrel.Or{
			squirrel.ILike{"email": "%" + req.Search + "%"},
			squirrel.ILike{"name": "%" + req.Search + "%"},
		})
	}

	countSQL, countArgs, err := countQuery.PlaceholderFormat(squirrel.Dollar).ToSql()
	if err != nil {
		return nil, 0, fmt.Errorf("build count query: %w", err)
	}

	var total int
	err = r.pool.QueryRow(ctx, countSQL, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("execute count query: %w", err)
	}

	// Запрос данных
	query := squirrel.
		Select("id", "email", "name", "phone", "role", "status", "is_email_verified", "created_at", "updated_at", "deleted_at").
		From("users").
		Where(squirrel.Eq{"deleted_at": nil})

	// Применяем фильтры
	if len(req.Status) > 0 {
		query = query.Where(squirrel.Eq{"status": req.Status})
	}
	if len(req.Role) > 0 {
		query = query.Where(squirrel.Eq{"role": req.Role})
	}
	if req.Search != "" {
		query = query.Where(squirrel.Or{
			squirrel.ILike{"email": "%" + req.Search + "%"},
			squirrel.ILike{"name": "%" + req.Search + "%"},
		})
	}

	// Сортировка
	if req.Sort != "" {
		order := "ASC"
		if req.Order == "desc" {
			order = "DESC"
		}
		query = query.OrderBy(fmt.Sprintf("%s %s", req.Sort, order))
	} else {
		query = query.OrderBy("created_at DESC")
	}

	// Пагинация
	if req.Limit > 0 {
		query = query.Limit(uint64(req.Limit))
	}
	if req.Page > 0 && req.Limit > 0 {
		offset := (req.Page - 1) * req.Limit
		query = query.Offset(uint64(offset))
	}

	sql, args, err := query.PlaceholderFormat(squirrel.Dollar).ToSql()
	if err != nil {
		return nil, 0, fmt.Errorf("build select query: %w", err)
	}

	rows, err := r.pool.Query(ctx, sql, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("execute select query: %w", err)
	}
	defer rows.Close()

	var users []repositorymodels.User
	for rows.Next() {
		var user repositorymodels.User
		var deletedAt *time.Time
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.Name,
			&user.Phone,
			&user.Role,
			&user.Status,
			&user.IsEmailVerified,
			&user.CreatedAt,
			&user.UpdatedAt,
			&deletedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("scan user: %w", err)
		}

		user.DeletedAt = deletedAt
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("rows error: %w", err)
	}

	return users, total, nil
}

// UpdateUser обновляет данные пользователя.
func (r *Repository) UpdateUser(ctx context.Context, id string, user *repositorymodels.User) error {
	query := squirrel.Update("users").Where(squirrel.Eq{"id": id}).Where(squirrel.Eq{"deleted_at": nil})

	if user.Name != "" {
		query = query.Set("name", user.Name)
	}
	if user.Phone != nil {
		query = query.Set("phone", user.Phone)
	}
	if user.Role != "" {
		query = query.Set("role", user.Role)
	}
	if user.Status != "" {
		query = query.Set("status", user.Status)
	}
	query = query.Set("updated_at", time.Now())

	sql, args, err := query.PlaceholderFormat(squirrel.Dollar).ToSql()
	if err != nil {
		return fmt.Errorf("build update query: %w", err)
	}

	result, err := r.pool.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("execute update: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// DeleteUser выполняет soft delete пользователя.
func (r *Repository) DeleteUser(ctx context.Context, id string) error {
	query, args, err := squirrel.
		Update("users").
		Set("deleted_at", time.Now()).
		Where(squirrel.Eq{"id": id}).
		Where(squirrel.Eq{"deleted_at": nil}).
		PlaceholderFormat(squirrel.Dollar).
		ToSql()
	if err != nil {
		return fmt.Errorf("build delete query: %w", err)
	}

	result, err := r.pool.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("execute delete: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}
