DO $$ BEGIN
    CREATE TYPE "PostContentFormat" AS ENUM ('RICH', 'MARKDOWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "contentFormat" "PostContentFormat" NOT NULL DEFAULT 'RICH';
