package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Repository содержит подключение к БД и реализует работу с данными.
type Repository struct {
	pool *pgxpool.Pool
}

// NewRepository создает новый экземпляр Repository.
func NewRepository(pool *pgxpool.Pool) *Repository {
	return &Repository{
		pool: pool,
	}
}

// BeginTx начинает транзакцию.
func (r *Repository) BeginTx(ctx context.Context) (pgx.Tx, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin transaction: %w", err)
	}

	return tx, nil
}

// Close закрывает соединение с БД.
func (r *Repository) Close() {
	r.pool.Close()
}
