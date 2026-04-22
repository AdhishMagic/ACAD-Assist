from django.db import migrations


REPAIR_NOTE_TABLE_SQL = """
DO $$
BEGIN
	IF to_regclass('public.notes_note') IS NULL THEN
		RETURN;
	END IF;

	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'notes_note'
			AND column_name = 'content'
			AND data_type = 'jsonb'
	) THEN
		ALTER TABLE public.notes_note
			ALTER COLUMN content TYPE text
			USING CASE
				WHEN jsonb_typeof(content) = 'string' THEN content #>> '{}'
				ELSE content::text
			END;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'updated_at'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN updated_at timestamp with time zone;
		UPDATE public.notes_note SET updated_at = COALESCE(created_at, NOW());
		ALTER TABLE public.notes_note ALTER COLUMN updated_at SET NOT NULL;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'deleted_at'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN deleted_at timestamp with time zone;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'title'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN title varchar(255);
		UPDATE public.notes_note SET title = COALESCE(NULLIF(topic, ''), 'Untitled Note')
		WHERE title IS NULL;
		ALTER TABLE public.notes_note ALTER COLUMN title SET NOT NULL;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'note_type'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN note_type varchar(50) NOT NULL DEFAULT 'Lecture';
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'tags'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN tags jsonb NOT NULL DEFAULT '[]'::jsonb;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'is_published'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN is_published boolean NOT NULL DEFAULT false;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'source'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN source varchar(20) NOT NULL DEFAULT 'manual';
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'ai_model'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN ai_model varchar(100) NOT NULL DEFAULT '';
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'metadata'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
	END IF;

	IF EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'subject'
	) AND NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'legacy_subject'
	) THEN
		ALTER TABLE public.notes_note RENAME COLUMN subject TO legacy_subject;
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

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'subject_id'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN subject_id uuid;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'file_id'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN file_id uuid;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'created_by_id'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN created_by_id bigint;
		IF EXISTS (
			SELECT 1 FROM information_schema.columns
			WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'student_id'
		) THEN
			UPDATE public.notes_note SET created_by_id = student_id WHERE created_by_id IS NULL;
		END IF;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'notes_note' AND column_name = 'updated_by_id'
	) THEN
		ALTER TABLE public.notes_note ADD COLUMN updated_by_id bigint;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'notes_note_created_by_id_fk'
	) THEN
		ALTER TABLE public.notes_note
			ADD CONSTRAINT notes_note_created_by_id_fk
			FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id)
			DEFERRABLE INITIALLY DEFERRED;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'notes_note_updated_by_id_fk'
	) THEN
		ALTER TABLE public.notes_note
			ADD CONSTRAINT notes_note_updated_by_id_fk
			FOREIGN KEY (updated_by_id) REFERENCES public.accounts_user(id)
			DEFERRABLE INITIALLY DEFERRED;
	END IF;

	IF to_regclass('public.academics_subject') IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_note_subject_id_fk') THEN
		ALTER TABLE public.notes_note
			ADD CONSTRAINT notes_note_subject_id_fk
			FOREIGN KEY (subject_id) REFERENCES public.academics_subject(id)
			DEFERRABLE INITIALLY DEFERRED;
	END IF;

	IF to_regclass('public.files_file') IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notes_note_file_id_fk') THEN
		ALTER TABLE public.notes_note
			ADD CONSTRAINT notes_note_file_id_fk
			FOREIGN KEY (file_id) REFERENCES public.files_file(id)
			DEFERRABLE INITIALLY DEFERRED;
	END IF;

	CREATE INDEX IF NOT EXISTS idx_note_created_by ON public.notes_note(created_by_id);
	CREATE INDEX IF NOT EXISTS idx_note_file ON public.notes_note(file_id);
	CREATE INDEX IF NOT EXISTS idx_note_type ON public.notes_note(note_type);
	CREATE INDEX IF NOT EXISTS idx_note_published ON public.notes_note(is_published);
	CREATE INDEX IF NOT EXISTS notes_note_deleted_at_idx ON public.notes_note(deleted_at);
END $$;
"""


class Migration(migrations.Migration):
	dependencies = [
		("notes", "0006_note_tags_note_type"),
	]

	operations = [
		migrations.RunSQL(REPAIR_NOTE_TABLE_SQL, reverse_sql=migrations.RunSQL.noop),
	]
