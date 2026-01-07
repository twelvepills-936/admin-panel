#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "${PG_HOST:-postgres}" -p "${PG_PORT:-5432}" -U "${PG_USER:-postgres}"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

# Apply migrations using SQL files directly
echo "Applying migrations..."

# Apply initial migration
if [ -f "./migrations/20240101000000_initial.up.sql" ]; then
  echo "Applying initial migration..."
  PGPASSWORD="${PG_PASS:-postgres}" psql -h "${PG_HOST:-postgres}" -p "${PG_PORT:-5432}" -U "${PG_USER:-postgres}" -d "${PG_DBNAME:-adminkaback}" -f ./migrations/20240101000000_initial.up.sql
  if [ $? -eq 0 ]; then
    echo "Migration applied successfully!"
  else
    echo "Migration failed, but continuing..."
  fi
fi

# Start application
echo "Starting application..."
exec ./main

