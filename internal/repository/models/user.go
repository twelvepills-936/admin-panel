package models

import "time"

// User представляет модель пользователя в БД.
type User struct {
	ID              string
	Email           string
	Name            string
	Phone           *string
	Role            string
	Status          string
	IsEmailVerified bool
	CreatedAt       time.Time
	UpdatedAt       time.Time
	DeletedAt       *time.Time
}
