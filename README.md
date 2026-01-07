# Admin Panel

Полнофункциональная админ-панель с разделением на backend и frontend части.

## Структура проекта

Проект состоит из двух частей:
- **Backend** - сервис на Go с PostgreSQL
- **Frontend** - веб-приложение на React с TypeScript

---

## Backend

Бэкэнд сервис для админ-панели на Go с PostgreSQL, реализованный согласно Code Style Guide проекта.

### Технологический стек

- Go 1.24.2
- Gin framework для HTTP API
- PostgreSQL 15+ (pgx/v5)
- Squirrel для построения SQL запросов
- JWT для аутентификации
- Goose для миграций БД

### Структура проекта

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

### Установка и запуск Backend

#### Предварительные требования

- Docker и Docker Compose (для PostgreSQL)
- Go 1.23+ (для запуска приложения локально)

#### Локальная разработка

1. Клонируйте репозиторий
2. Скопируйте `.env.example` в `.env` и настройте переменные окружения:
   ```powershell
   Copy-Item .env.example .env
   ```
   **Важно:** Измените `JWT_SECRET` на безопасный случайный ключ!

3. Запустите только PostgreSQL (через Docker):
   ```powershell
   docker-compose up -d postgres
   ```

4. Дождитесь готовности PostgreSQL (около 10 секунд), затем выполните миграции:
   ```powershell
   goose -dir ./internal/migrations postgres "postgres://postgres:postgres@localhost:5432/adminkaback?sslmode=disable" up
   ```

5. Установите зависимости Go:
   ```bash
   go mod download
   ```

6. Запустите приложение:
   ```powershell
   go run cmd/service/main.go
   ```

### API Endpoints

#### Аутентификация

- `POST /api/v1/auth/register` - Регистрация администратора
- `POST /api/v1/auth/login` - Вход в систему
- `POST /api/v1/auth/refresh` - Обновление токена
- `POST /api/v1/auth/logout` - Выход из системы
- `GET /api/v1/auth/me` - Получение текущего администратора (требует авторизации)

#### Health Check

- `GET /_hc` - Проверка состояния сервиса

### Формат ответов

#### Успешный ответ:
```json
{
  "success": true,
  "data": {...}
}
```

#### Ошибка:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Миграции

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

### Архитектура

Проект следует принципам Clean Architecture:
- Интерфейсы централизованы в `internal/domain.go`
- Разделение слоев: usecase → repository → service
- Все зависимости через конструкторы
- Все публичные методы принимают `context.Context`

---

## Frontend

Веб-приложение админ панели на React с TypeScript.

### Технологии

- React 18
- TypeScript
- Vite
- React Router v6
- React Query (TanStack Query)
- Axios
- i18next
- SCSS

### Установка

```bash
npm install
```

### Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

### Сборка

```bash
npm run build
```

### Переменные окружения

Создайте файл `.env` в корне проекта на основе `env.example`:

```
VITE_API_URL=http://localhost:5001
```

Или скопируйте файл:
```bash
cp env.example .env
```

### Структура проекта

```
src/
├── features/          # Переиспользуемые фичи
├── pages/            # Страницы приложения
├── providers/        # React провайдеры
├── shared/           # Общие ресурсы
│   ├── api/         # API клиент и запросы
│   ├── assets/      # Статические ресурсы
│   ├── constants/   # Константы
│   ├── ui/          # UI компоненты
│   └── utils/       # Утилиты
└── App.tsx
```

### Интеграция с бэкендом

Все API запросы идут через `/api` endpoint. Настройте proxy в `vite.config.ts` или используйте переменную окружения `VITE_API_URL`.

### Авторизация

Токен авторизации сохраняется в `localStorage` под ключом `auth_token` и автоматически добавляется в заголовки всех API запросов.

---

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
