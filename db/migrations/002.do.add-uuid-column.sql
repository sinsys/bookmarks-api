CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE bookmarks
  ADD COLUMN
    uuid UUID NOT NULL uuid_generate_v4();