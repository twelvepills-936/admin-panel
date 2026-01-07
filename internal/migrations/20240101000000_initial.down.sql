-- Drop trigger
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_refresh_tokens_expires_at;
DROP INDEX IF EXISTS idx_refresh_tokens_token;
DROP INDEX IF EXISTS idx_refresh_tokens_admin_id;
DROP INDEX IF EXISTS idx_admins_role;
DROP INDEX IF EXISTS idx_admins_email;

-- Drop tables
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS admins;

