# Admin Panel Frontend

Веб-приложение админ панели на React с TypeScript.

## Технологии

- React 18
- TypeScript
- Vite
- React Router v6
- React Query (TanStack Query)
- Axios
- i18next
- SCSS

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Сборка

```bash
npm run build
```

## Переменные окружения

Создайте файл `.env` в корне проекта на основе `env.example`:

```
VITE_API_URL=http://localhost:5001
```

Или скопируйте файл:
```bash
cp env.example .env
```

## Структура проекта

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

## Интеграция с бэкендом

Все API запросы идут через `/api` endpoint. Настройте proxy в `vite.config.ts` или используйте переменную окружения `VITE_API_URL`.

## Авторизация

Токен авторизации сохраняется в `localStorage` под ключом `auth_token` и автоматически добавляется в заголовки всех API запросов.

