package password

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

const (
	// DefaultCost используется по умолчанию для хеширования пароля.
	DefaultCost = 10
)

// Hash хеширует пароль с использованием bcrypt.
func Hash(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), DefaultCost)
	if err != nil {
		return "", fmt.Errorf("generate hash: %w", err)
	}

	return string(hash), nil
}

// Compare сравнивает пароль с хешем.
func Compare(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	return err == nil
}
