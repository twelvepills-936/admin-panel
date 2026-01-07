# Быстрое решение: Применение миграций

## Проблема решена!

Миграции были применены. Таблицы `admins` и `refresh_tokens` теперь существуют в базе данных.

## Что дальше?

### 1. Перезапустите контейнер приложения (если нужно)

```bash
docker-compose restart app
```

### 2. Создайте первого пользователя

**Через API:**
```bash
curl -X POST http://localhost:8090/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

**Или через фронтенд:**
1. Откройте `http://localhost:3000/login`
2. Нажмите "Нет аккаунта? Зарегистрироваться"
3. Заполните форму и зарегистрируйтесь

### 3. Войдите в систему

После регистрации используйте:
- **Email:** `admin@example.com`
- **Пароль:** `admin123`

## Если нужно применить миграции снова

```bash
# Windows PowerShell
Get-Content internal\migrations\20240101000000_initial.up.sql | docker-compose exec -T postgres psql -U postgres -d adminkaback

# Linux/Mac
cat internal/migrations/20240101000000_initial.up.sql | docker-compose exec -T postgres psql -U postgres -d adminkaback
```

## Проверка

Проверьте, что таблицы созданы:
```bash
docker-compose exec postgres psql -U postgres -d adminkaback -c "\dt"
```

Должны увидеть:
- `admins`
- `refresh_tokens`

