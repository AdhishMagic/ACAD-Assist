from django.db import migrations


RELAX_LEGACY_COLUMNS_SQL = """
DO $$
BEGIN
	IF to_regclass('public.notes_note') IS NULL THEN
		RETURN;
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'legacy_subject'
	) THEN
		ALTER TABLE public.notes_note ALTER COLUMN legacy_subject DROP NOT NULL;
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'topic'
	) THEN
		ALTER TABLE public.notes_note ALTER COLUMN topic DROP NOT NULL;
	END IF;
END $$;
"""


class Migration(migrations.Migration):
	dependencies = [
		("notes", "0007_repair_note_table_schema"),
	]

	operations = [
		migrations.RunSQL(RELAX_LEGACY_COLUMNS_SQL, reverse_sql=migrations.RunSQL.noop),
	]
