import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_section" AS ENUM('insight', 'news', 'archive');
  CREATE TYPE "public"."enum_solutions_sections_layout" AS ENUM('grid', 'visual-right', 'visual-left', 'chips', 'steps');
  CREATE TABLE "solutions_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "solutions_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"layout" "enum_solutions_sections_layout" DEFAULT 'grid',
  	"image_id" uuid
  );
  
  CREATE TABLE "solutions_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "pages_blocks_feature_grid" ADD COLUMN "image_src" varchar;
  ALTER TABLE "posts" ADD COLUMN "section" "enum_posts_section" DEFAULT 'insight';
  ALTER TABLE "posts" ADD COLUMN "cover_id" uuid;
  ALTER TABLE "posts" ADD COLUMN "cover_url" varchar;
  ALTER TABLE "posts" ADD COLUMN "read_time" varchar;
  ALTER TABLE "posts" ADD COLUMN "date" varchar;
  ALTER TABLE "posts" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "solutions" ADD COLUMN "route" varchar;
  ALTER TABLE "solutions" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "solutions" ADD COLUMN "hero_image_id" uuid;
  ALTER TABLE "solutions" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "solutions" ADD COLUMN "cta_description" varchar;
  ALTER TABLE "solutions" ADD COLUMN "cta_image_id" uuid;
  ALTER TABLE "solutions_sections_items" ADD CONSTRAINT "solutions_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_sections" ADD CONSTRAINT "solutions_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_sections" ADD CONSTRAINT "solutions_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_texts" ADD CONSTRAINT "solutions_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solutions_sections_items_order_idx" ON "solutions_sections_items" USING btree ("_order");
  CREATE INDEX "solutions_sections_items_parent_id_idx" ON "solutions_sections_items" USING btree ("_parent_id");
  CREATE INDEX "solutions_sections_order_idx" ON "solutions_sections" USING btree ("_order");
  CREATE INDEX "solutions_sections_parent_id_idx" ON "solutions_sections" USING btree ("_parent_id");
  CREATE INDEX "solutions_sections_image_idx" ON "solutions_sections" USING btree ("image_id");
  CREATE INDEX "solutions_texts_order_parent" ON "solutions_texts" USING btree ("order","parent_id");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_section_idx" ON "posts" USING btree ("section");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "solutions_route_idx" ON "solutions" USING btree ("route");
  CREATE INDEX "solutions_hero_image_idx" ON "solutions" USING btree ("hero_image_id");
  CREATE INDEX "solutions_cta_image_idx" ON "solutions" USING btree ("cta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solutions_sections_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "solutions_sections_items" CASCADE;
  DROP TABLE "solutions_sections" CASCADE;
  DROP TABLE "solutions_texts" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT "posts_cover_id_media_id_fk";
  
  ALTER TABLE "solutions" DROP CONSTRAINT "solutions_hero_image_id_media_id_fk";
  
  ALTER TABLE "solutions" DROP CONSTRAINT "solutions_cta_image_id_media_id_fk";
  
  DROP INDEX "posts_section_idx";
  DROP INDEX "posts_cover_idx";
  DROP INDEX "solutions_route_idx";
  DROP INDEX "solutions_hero_image_idx";
  DROP INDEX "solutions_cta_image_idx";
  ALTER TABLE "pages_blocks_feature_grid" DROP COLUMN "image_src";
  ALTER TABLE "posts" DROP COLUMN "section";
  ALTER TABLE "posts" DROP COLUMN "cover_id";
  ALTER TABLE "posts" DROP COLUMN "cover_url";
  ALTER TABLE "posts" DROP COLUMN "read_time";
  ALTER TABLE "posts" DROP COLUMN "date";
  ALTER TABLE "posts" DROP COLUMN "featured";
  ALTER TABLE "solutions" DROP COLUMN "route";
  ALTER TABLE "solutions" DROP COLUMN "eyebrow";
  ALTER TABLE "solutions" DROP COLUMN "hero_image_id";
  ALTER TABLE "solutions" DROP COLUMN "cta_title";
  ALTER TABLE "solutions" DROP COLUMN "cta_description";
  ALTER TABLE "solutions" DROP COLUMN "cta_image_id";
  DROP TYPE "public"."enum_posts_section";
  DROP TYPE "public"."enum_solutions_sections_layout";`)
}
