-- Ejecuta este script en el Editor SQL de Supabase para reparar el registro de actividad

BEGIN;

-- 1. Crear tabla si no existe
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB
);

-- 2. Habilitar seguridad a nivel de fila (RLS)
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de seguridad (permite lectura/escritura pública/anónima para el admin)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'activity_log' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON activity_log FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'activity_log' AND policyname = 'Enable insert access for all users'
    ) THEN
        CREATE POLICY "Enable insert access for all users" ON activity_log FOR INSERT WITH CHECK (true);
    END IF;
END
$$;

COMMIT;
