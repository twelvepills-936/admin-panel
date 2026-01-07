package models

import "time"

// Admin представляет модель администратора в БД.
type Admin struct {
	ID           string
	Email        string
	PasswordHash string
	Name         string
	Role         string
	IsActive     bool
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// RefreshToken представляет модель refresh токена в БД.
type RefreshToken struct {
	ID        string
	AdminID   string
	Token     string
	ExpiresAt time.Time
	CreatedAt time.Time
}
