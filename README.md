# Admin Panel Backend

Бэкэнд сервис для админ-панели на Go с PostgreSQL, реализованный согласно Code Style Guide проекта.

## Технологический стек

- Go 1.24.2
- Gin framework для HTTP API
- PostgreSQL 15+ (pgx/v5)
- Squirrel для построения SQL запросов
- JWT для аутентификации
- Goose для миграций БД

## Структура проекта

```
root
├── cmd/service/main.go          # Точка входа
├── internal/
│   ├── domain.go                # Централизованные интерфейсы
│   ├── usecase/                 # Бизнес-логика
│   │   ├── usecase.go
│   │   ├── auth.go
│   │   └── models/              # DTO и доменные ошибки
│   ├── repository/              # Работа с БД
│   │   ├── repository.go
│   │   ├── auth.go
│   │   └── models/
│   ├── service/                 # HTTP handlers
│   │   ├── service.go
│   │   └── auth.go
│   ├── middleware/              # Middleware
│   │   ├── auth.go
│   │   └── cors.go
│   └── migrations/              # SQL миграции
├── pkg/
│   ├── config/                  # Конфигурация
│   ├── jwt/                     # JWT утилиты
│   └── password/                 # Хеширование паролей
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── Makefile
```

## Установка и запуск

### Предварительные требования

- Docker и Docker Compose (для PostgreSQL)
- Go 1.23+ (для запуска приложения локально)

### Локальная разработка

1. Клонируйте репозиторий
2. Скопируйте `.env.example` в `.env` и настройте переменные окружения:
   ```powershell
   Copy-Item .env.example .env
   ```
   **Важно:** Измените `JWT_SECRET` на безопасный случайный ключ!

3. Запустите только PostgreSQL (через Docker):

   **Windows (PowerShell):**
   ```powershell
   docker-compose up -d postgres
   ```
   или используйте скрипт:
   ```powershell
   .\docker-up.ps1
   ```

   **Linux/Mac:**
   ```bash
   docker-compose up -d postgres
   ```
   или:
   ```bash
   make docker-up
   ```

4. Дождитесь готовности PostgreSQL (около 10 секунд), затем выполните миграции:

   **Windows (PowerShell):**
   ```powershell
   .\migrate-up.ps1
   ```
   или напрямую (если установлен goose):
   ```powershell
   goose -dir ./internal/migrations postgres "postgres://postgres:postgres@localhost:5432/adminkaback?sslmode=disable" up
   ```

   **Linux/Mac:**
   ```bash
   make migrate-up
   ```

5. Установите зависимости Go (если еще не установлены):
   ```bash
   go mod download
   ```

6. Запустите приложение:

   **Windows (PowerShell):**
   ```powershell
   .\run.ps1
   ```
   или напрямую:
   ```powershell
   go run cmd/service/main.go
   ```

   **Linux/Mac:**
   ```bash
   make run
   ```
   или:
   ```bash
   go run cmd/service/main.go
   ```

### Запуск только PostgreSQL

Если нужно запустить только базу данных без приложения:

```powershell
docker-compose up -d postgres
```

Остановка:
```powershell
docker-compose down
```

### Docker

**Важно:** Перед запуском создайте `.env` файл с настройками (см. `.env.example` или `ENV_EXAMPLE.md`). Особенно важно установить безопасный `JWT_SECRET` (минимум 32 символа).

```bash
# Скопируйте пример конфигурации
cp .env.example .env

# Отредактируйте .env и установите JWT_SECRET
# Затем запустите
docker-compose up -d
```

или в PowerShell:
```powershell
# Скопируйте пример конфигурации
Copy-Item .env.example .env

# Отредактируйте .env и установите JWT_SECRET
# Затем запустите
docker-compose up -d
```

**Примечание:** Если видите ошибку `JWT_SECRET must be set and changed from default`, убедитесь, что в `.env` файле установлен безопасный `JWT_SECRET` (не равный `your-secret-key-change-in-production`). См. `DOCKER_SETUP.md` для подробностей.

## Создание первого администратора

В приложении нет предустановленных пользователей. Первого администратора нужно создать через API регистрации:

```bash
curl -X POST http://localhost:8090/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

Или используйте фронтенд: откройте `http://localhost:3000/login` и нажмите "Зарегистрироваться".

**Рекомендуемые учетные данные для разработки:**
- Email: `admin@example.com`
- Пароль: `admin123`
- Имя: `Admin User`

См. `CREATE_FIRST_ADMIN.md` для подробностей.

## API Endpoints

### Аутентификация

- `POST /api/v1/auth/register` - Регистрация администратора
- `POST /api/v1/auth/login` - Вход в систему
- `POST /api/v1/auth/refresh` - Обновление токена
- `POST /api/v1/auth/logout` - Выход из системы
- `GET /api/v1/auth/me` - Получение текущего администратора (требует авторизации)

### Health Check

- `GET /_hc` - Проверка состояния сервиса

## Формат ответов

### Успешный ответ:
```json
{
  "success": true,
  "data": {...}
}
```

### Ошибка:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Переменные окружения

См. `.env.example` для полного списка переменных окружения.

## Миграции

Создание новой миграции:
```bash
make migrate-create
```

Применить миграции:
```bash
make migrate-up
```

Откатить миграции:
```bash
make migrate-down
```

## Линтинг

```bash
make lint
```

## Архитектура

Проект следует принципам Clean Architecture:
- Интерфейсы централизованы в `internal/domain.go`
- Разделение слоев: usecase → repository → service
- Все зависимости через конструкторы
- Все публичные методы принимают `context.Context`

## Code Style Guide

Код строго следует Code Style Guide проекта:
- Использование pgx/v5 и Squirrel (НЕ GORM)
- Ошибки объявляются в `internal/usecase/models/`
- Правильное именование (пакеты строчными, ошибки Err..., булевы is/has)
- Разделение импортов (стандартная библиотека отдельно)
- Запрет внешних вызовов внутри транзакций БД

