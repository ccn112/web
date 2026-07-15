CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE content_status AS ENUM ('draft','review','approved','published','archived');
CREATE TYPE page_type AS ENUM ('home','landing','product','solution','article_index','form','legal');

CREATE TABLE sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) UNIQUE NOT NULL,
  name varchar(120) NOT NULL,
  primary_domain varchar(255),
  product varchar(120),
  tagline text,
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  chatbot_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status content_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) UNIQUE NOT NULL,
  password_hash text,
  full_name varchar(160),
  role varchar(40) NOT NULL DEFAULT 'editor',
  allowed_site_codes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE SET NULL,
  filename varchar(255) NOT NULL,
  mime_type varchar(120),
  storage_key text NOT NULL,
  alt_text text,
  caption text,
  source text,
  ai_generated boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  page_type page_type NOT NULL,
  locale varchar(10) NOT NULL DEFAULT 'vi',
  summary text,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggested_prompts jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_page_ids uuid[] NOT NULL DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(site_id, locale, slug)
);

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  excerpt text,
  category varchar(120),
  locale varchar(10) NOT NULL DEFAULT 'vi',
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  status content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  author_id uuid REFERENCES users(id),
  reviewer_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(site_id, locale, slug)
);

CREATE TABLE menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  code varchar(50) NOT NULL DEFAULT 'main',
  locale varchar(10) NOT NULL DEFAULT 'vi',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE(site_id, code, locale)
);

CREATE TABLE forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(80) UNIQUE NOT NULL,
  name varchar(160) NOT NULL,
  site_scope text[] NOT NULL DEFAULT '{}',
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  success_message text
);

CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE RESTRICT,
  site_id uuid REFERENCES sites(id) ON DELETE SET NULL,
  page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  visitor_session varchar(160),
  payload jsonb NOT NULL,
  utm jsonb NOT NULL DEFAULT '{}'::jsonb,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  visitor_session varchar(160),
  model varchar(120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role varchar(20) NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  token_usage jsonb NOT NULL DEFAULT '{}'::jsonb,
  feedback smallint CHECK (feedback IN (-1,1)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  source_path varchar(500) NOT NULL,
  destination_path varchar(500) NOT NULL,
  permanent boolean NOT NULL DEFAULT true,
  UNIQUE(site_id, source_path)
);

CREATE INDEX idx_pages_site_status ON pages(site_id,status);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_posts_site_status ON posts(site_id,status);
CREATE INDEX idx_chat_session_site ON chat_sessions(site_id,created_at DESC);
