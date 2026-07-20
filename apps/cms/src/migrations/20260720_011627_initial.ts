import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'site_admin', 'editor', 'reviewer', 'publisher');
  CREATE TYPE "public"."enum_sites_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_pages_blocks_hero_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_hero_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_product_cards_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_product_cards_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_solution_cards_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_solution_cards_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_pain_points_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_pain_points_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_process_timeline_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_process_timeline_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_statistics_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_statistics_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_screenshots_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_screenshots_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_architecture_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_architecture_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_comparison_table_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_comparison_table_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_integration_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_integration_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_faq_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_faq_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_related_insights_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_related_insights_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_deployment_cards_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_deployment_cards_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cta_theme" AS ENUM('light', 'soft', 'dark', 'brand');
  CREATE TYPE "public"."enum_pages_blocks_cta_padding" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_page_type" AS ENUM('home', 'landing', 'product', 'solution', 'article_index', 'form', 'legal');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_service_sections_items_side" AS ENUM('left', 'right', 'top', 'bottom');
  CREATE TYPE "public"."enum_service_sections_process_side" AS ENUM('left', 'right', 'top', 'bottom');
  CREATE TYPE "public"."enum_service_sections_visual_type" AS ENUM('hub-spoke', 'maturity-radar', 'architecture-stack', 'process-evolution', 'data-platform', 'integration-hub', 'adoption-journey', 'control-tower');
  CREATE TYPE "public"."enum_service_sections_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_solutions_category" AS ENUM('chuoi-nghiep-vu', 'doi-tuong', 'muc-tieu');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'review', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_prompt_sets_prompts_action_type" AS ENUM('ask', 'navigate', 'page', 'demo');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "sites" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"code" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"primary_domain" varchar,
  	"product" varchar,
  	"tagline" varchar,
  	"theme_primary" varchar,
  	"theme_accent" varchar,
  	"theme_surface" varchar,
  	"theme_style" varchar,
  	"chatbot_config_enabled" boolean DEFAULT true,
  	"chatbot_config_welcome" varchar,
  	"status" "enum_sites_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sites_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"source" varchar,
  	"site_id" uuid,
  	"ai_generated" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"primary_c_t_a_label" varchar NOT NULL,
  	"primary_c_t_a_href" varchar NOT NULL,
  	"secondary_c_t_a_label" varchar NOT NULL,
  	"secondary_c_t_a_href" varchar NOT NULL,
  	"illustration_id" uuid,
  	"background_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_hero_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_hero_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_rich_text_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_rich_text_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"illustration_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_feature_grid_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_feature_grid_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_product_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"illustration_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_product_cards_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_product_cards_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_solution_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_solution_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_solution_cards_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_solution_cards_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pain_points_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_pain_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_pain_points_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_pain_points_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_process_timeline_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_process_timeline_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_statistics_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_statistics_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_screenshots_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" uuid,
  	"alt" varchar NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_screenshots" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_screenshots_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_screenshots_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_architecture_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"illustration_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_architecture_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_architecture_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_comparison_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_comparison_table_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_comparison_table_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_integration_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_integration" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_integration_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_integration_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_case_study_cards_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_case_study_cards_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_faq_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_faq_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_related_insights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_related_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_related_insights_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_related_insights_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_deployment_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_deployment_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"illustration_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_deployment_cards_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_deployment_cards_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"form_code" varchar NOT NULL,
  	"illustration_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_lead_form_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_lead_form_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"primary_c_t_a_label" varchar NOT NULL,
  	"primary_c_t_a_href" varchar NOT NULL,
  	"secondary_c_t_a_label" varchar NOT NULL,
  	"secondary_c_t_a_href" varchar NOT NULL,
  	"illustration_id" uuid,
  	"anchor_id" varchar,
  	"theme" "enum_pages_blocks_cta_theme" DEFAULT 'light',
  	"padding" "enum_pages_blocks_cta_padding" DEFAULT 'normal',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid NOT NULL,
  	"site_code" varchar,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"page_type" "enum_pages_page_type" NOT NULL,
  	"locale" varchar DEFAULT 'vi' NOT NULL,
  	"summary" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_index" boolean DEFAULT true,
  	"seo_follow" boolean DEFAULT true,
  	"seo_canonical" varchar,
  	"seo_og_image_id" uuid,
  	"status" "enum_pages_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid
  );
  
  CREATE TABLE "posts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid NOT NULL,
  	"site_code" varchar,
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"category" varchar,
  	"locale" varchar DEFAULT 'vi' NOT NULL,
  	"body" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_index" boolean DEFAULT true,
  	"seo_follow" boolean DEFAULT true,
  	"seo_canonical" varchar,
  	"seo_og_image_id" uuid,
  	"author_id" uuid,
  	"reviewer_id" uuid,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "service_sections_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" varchar NOT NULL,
  	"order" numeric,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"side" "enum_service_sections_items_side",
  	"icon" varchar
  );
  
  CREATE TABLE "service_sections_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" varchar NOT NULL,
  	"order" numeric,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"side" "enum_service_sections_process_side",
  	"icon" varchar
  );
  
  CREATE TABLE "service_sections_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_id" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "service_sections" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid NOT NULL,
  	"site_code" varchar,
  	"section_id" varchar NOT NULL,
  	"visual_type" "enum_service_sections_visual_type" NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"order" numeric,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"locale" varchar DEFAULT 'vi' NOT NULL,
  	"status" "enum_service_sections_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_sections_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "products" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"tagline" varchar,
  	"description" varchar,
  	"logo_id" uuid,
  	"href" varchar,
  	"status" "enum_products_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "solutions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid,
  	"site_code" varchar,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_solutions_category",
  	"summary" varchar,
  	"status" "enum_solutions_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid,
  	"site_code" varchar,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"client" varchar,
  	"challenge" varchar,
  	"solution" varchar,
  	"architecture" varchar,
  	"cover_id" uuid,
  	"status" "enum_case_studies_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid,
  	"site_code" varchar,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "menus" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid NOT NULL,
  	"site_code" varchar,
  	"code" varchar DEFAULT 'main' NOT NULL,
  	"locale" varchar DEFAULT 'vi' NOT NULL,
  	"items" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"code" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"success_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "form_submissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"form_id" uuid NOT NULL,
  	"site_id" uuid,
  	"page_id" uuid,
  	"visitor_session" varchar,
  	"payload" jsonb NOT NULL,
  	"utm" jsonb,
  	"consent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prompt_sets_prompts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"prompt" varchar NOT NULL,
  	"action_type" "enum_prompt_sets_prompts_action_type" DEFAULT 'ask',
  	"enabled" boolean DEFAULT true,
  	"order" numeric DEFAULT 0
  );
  
  CREATE TABLE "prompt_sets" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid NOT NULL,
  	"site_code" varchar,
  	"code" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_id" uuid NOT NULL,
  	"site_code" varchar,
  	"source_path" varchar NOT NULL,
  	"destination_path" varchar NOT NULL,
  	"permanent" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_sessions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"device_id" varchar NOT NULL,
  	"session_id" varchar NOT NULL,
  	"title" varchar,
  	"site_code" varchar,
  	"last_route" varchar,
  	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
  	"message_count" numeric DEFAULT 0,
  	"provider" varchar,
  	"model" varchar,
  	"tokens_in" numeric DEFAULT 0,
  	"tokens_out" numeric DEFAULT 0,
  	"est_cost_usd" numeric DEFAULT 0,
  	"hidden_by_user" boolean DEFAULT false,
  	"flagged_quality" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"device_id" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"name" varchar,
  	"site_code" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_usage" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"day" varchar,
  	"provider" varchar,
  	"model" varchar,
  	"requests" numeric DEFAULT 0,
  	"tokens_in" numeric DEFAULT 0,
  	"tokens_out" numeric DEFAULT 0,
  	"est_cost_usd" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"sites_id" uuid,
  	"media_id" uuid,
  	"pages_id" uuid,
  	"posts_id" uuid,
  	"service_sections_id" uuid,
  	"products_id" uuid,
  	"solutions_id" uuid,
  	"case_studies_id" uuid,
  	"faqs_id" uuid,
  	"menus_id" uuid,
  	"forms_id" uuid,
  	"form_submissions_id" uuid,
  	"prompt_sets_id" uuid,
  	"redirects_id" uuid,
  	"chat_sessions_id" uuid,
  	"chat_users_id" uuid,
  	"chat_usage_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_texts" ADD CONSTRAINT "users_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sites_texts" ADD CONSTRAINT "sites_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_cards_items" ADD CONSTRAINT "pages_blocks_product_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_cards" ADD CONSTRAINT "pages_blocks_product_cards_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_cards" ADD CONSTRAINT "pages_blocks_product_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_cards_items" ADD CONSTRAINT "pages_blocks_solution_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solution_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solution_cards" ADD CONSTRAINT "pages_blocks_solution_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pain_points_items" ADD CONSTRAINT "pages_blocks_pain_points_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pain_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pain_points" ADD CONSTRAINT "pages_blocks_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_timeline" ADD CONSTRAINT "pages_blocks_process_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics_items" ADD CONSTRAINT "pages_blocks_statistics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics" ADD CONSTRAINT "pages_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_screenshots_items" ADD CONSTRAINT "pages_blocks_screenshots_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_screenshots_items" ADD CONSTRAINT "pages_blocks_screenshots_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_screenshots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_screenshots" ADD CONSTRAINT "pages_blocks_screenshots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_architecture_layers" ADD CONSTRAINT "pages_blocks_architecture_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_architecture" ADD CONSTRAINT "pages_blocks_architecture_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_architecture" ADD CONSTRAINT "pages_blocks_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_table_rows" ADD CONSTRAINT "pages_blocks_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_table" ADD CONSTRAINT "pages_blocks_comparison_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_integration_items" ADD CONSTRAINT "pages_blocks_integration_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_integration"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_integration" ADD CONSTRAINT "pages_blocks_integration_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_cards_items" ADD CONSTRAINT "pages_blocks_case_study_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_study_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_cards" ADD CONSTRAINT "pages_blocks_case_study_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_insights_items" ADD CONSTRAINT "pages_blocks_related_insights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_related_insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_insights" ADD CONSTRAINT "pages_blocks_related_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_deployment_cards_items" ADD CONSTRAINT "pages_blocks_deployment_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_deployment_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_deployment_cards" ADD CONSTRAINT "pages_blocks_deployment_cards_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_deployment_cards" ADD CONSTRAINT "pages_blocks_deployment_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form" ADD CONSTRAINT "pages_blocks_lead_form_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form" ADD CONSTRAINT "pages_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_illustration_id_media_id_fk" FOREIGN KEY ("illustration_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_sections_items" ADD CONSTRAINT "service_sections_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_sections_process" ADD CONSTRAINT "service_sections_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_sections_outcomes" ADD CONSTRAINT "service_sections_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_sections" ADD CONSTRAINT "service_sections_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_sections_texts" ADD CONSTRAINT "service_sections_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_results" ADD CONSTRAINT "case_studies_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_texts" ADD CONSTRAINT "faqs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menus" ADD CONSTRAINT "menus_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_texts" ADD CONSTRAINT "forms_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prompt_sets_prompts" ADD CONSTRAINT "prompt_sets_prompts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prompt_sets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prompt_sets" ADD CONSTRAINT "prompt_sets_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects" ADD CONSTRAINT "redirects_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sites_fk" FOREIGN KEY ("sites_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_sections_fk" FOREIGN KEY ("service_sections_id") REFERENCES "public"."service_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menus_fk" FOREIGN KEY ("menus_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prompt_sets_fk" FOREIGN KEY ("prompt_sets_id") REFERENCES "public"."prompt_sets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_sessions_fk" FOREIGN KEY ("chat_sessions_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_users_fk" FOREIGN KEY ("chat_users_id") REFERENCES "public"."chat_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_usage_fk" FOREIGN KEY ("chat_usage_id") REFERENCES "public"."chat_usage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_texts_order_parent" ON "users_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "sites_code_idx" ON "sites" USING btree ("code");
  CREATE INDEX "sites_primary_domain_idx" ON "sites" USING btree ("primary_domain");
  CREATE INDEX "sites_status_idx" ON "sites" USING btree ("status");
  CREATE INDEX "sites_updated_at_idx" ON "sites" USING btree ("updated_at");
  CREATE INDEX "sites_created_at_idx" ON "sites" USING btree ("created_at");
  CREATE INDEX "sites_texts_order_parent" ON "sites_texts" USING btree ("order","parent_id");
  CREATE INDEX "media_site_idx" ON "media" USING btree ("site_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_illustration_idx" ON "pages_blocks_hero" USING btree ("illustration_id");
  CREATE INDEX "pages_blocks_hero_background_idx" ON "pages_blocks_hero" USING btree ("background_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_items_order_idx" ON "pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_parent_id_idx" ON "pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_illustration_idx" ON "pages_blocks_feature_grid" USING btree ("illustration_id");
  CREATE INDEX "pages_blocks_product_cards_items_order_idx" ON "pages_blocks_product_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_cards_items_parent_id_idx" ON "pages_blocks_product_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_cards_order_idx" ON "pages_blocks_product_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_cards_parent_id_idx" ON "pages_blocks_product_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_cards_path_idx" ON "pages_blocks_product_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_cards_illustration_idx" ON "pages_blocks_product_cards" USING btree ("illustration_id");
  CREATE INDEX "pages_blocks_solution_cards_items_order_idx" ON "pages_blocks_solution_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_solution_cards_items_parent_id_idx" ON "pages_blocks_solution_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solution_cards_order_idx" ON "pages_blocks_solution_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_solution_cards_parent_id_idx" ON "pages_blocks_solution_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solution_cards_path_idx" ON "pages_blocks_solution_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_pain_points_items_order_idx" ON "pages_blocks_pain_points_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_pain_points_items_parent_id_idx" ON "pages_blocks_pain_points_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pain_points_order_idx" ON "pages_blocks_pain_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_pain_points_parent_id_idx" ON "pages_blocks_pain_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pain_points_path_idx" ON "pages_blocks_pain_points" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_timeline_order_idx" ON "pages_blocks_process_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_timeline_parent_id_idx" ON "pages_blocks_process_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_timeline_path_idx" ON "pages_blocks_process_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_statistics_items_order_idx" ON "pages_blocks_statistics_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_items_parent_id_idx" ON "pages_blocks_statistics_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_order_idx" ON "pages_blocks_statistics" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_parent_id_idx" ON "pages_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_path_idx" ON "pages_blocks_statistics" USING btree ("_path");
  CREATE INDEX "pages_blocks_screenshots_items_order_idx" ON "pages_blocks_screenshots_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_screenshots_items_parent_id_idx" ON "pages_blocks_screenshots_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_screenshots_items_media_idx" ON "pages_blocks_screenshots_items" USING btree ("media_id");
  CREATE INDEX "pages_blocks_screenshots_order_idx" ON "pages_blocks_screenshots" USING btree ("_order");
  CREATE INDEX "pages_blocks_screenshots_parent_id_idx" ON "pages_blocks_screenshots" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_screenshots_path_idx" ON "pages_blocks_screenshots" USING btree ("_path");
  CREATE INDEX "pages_blocks_architecture_layers_order_idx" ON "pages_blocks_architecture_layers" USING btree ("_order");
  CREATE INDEX "pages_blocks_architecture_layers_parent_id_idx" ON "pages_blocks_architecture_layers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_architecture_order_idx" ON "pages_blocks_architecture" USING btree ("_order");
  CREATE INDEX "pages_blocks_architecture_parent_id_idx" ON "pages_blocks_architecture" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_architecture_path_idx" ON "pages_blocks_architecture" USING btree ("_path");
  CREATE INDEX "pages_blocks_architecture_illustration_idx" ON "pages_blocks_architecture" USING btree ("illustration_id");
  CREATE INDEX "pages_blocks_comparison_table_rows_order_idx" ON "pages_blocks_comparison_table_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_table_rows_parent_id_idx" ON "pages_blocks_comparison_table_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_table_order_idx" ON "pages_blocks_comparison_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_table_parent_id_idx" ON "pages_blocks_comparison_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_table_path_idx" ON "pages_blocks_comparison_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_integration_items_order_idx" ON "pages_blocks_integration_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_integration_items_parent_id_idx" ON "pages_blocks_integration_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_integration_order_idx" ON "pages_blocks_integration" USING btree ("_order");
  CREATE INDEX "pages_blocks_integration_parent_id_idx" ON "pages_blocks_integration" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_integration_path_idx" ON "pages_blocks_integration" USING btree ("_path");
  CREATE INDEX "pages_blocks_case_study_cards_items_order_idx" ON "pages_blocks_case_study_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_cards_items_parent_id_idx" ON "pages_blocks_case_study_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_cards_order_idx" ON "pages_blocks_case_study_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_cards_parent_id_idx" ON "pages_blocks_case_study_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_cards_path_idx" ON "pages_blocks_case_study_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_related_insights_items_order_idx" ON "pages_blocks_related_insights_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_insights_items_parent_id_idx" ON "pages_blocks_related_insights_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_insights_order_idx" ON "pages_blocks_related_insights" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_insights_parent_id_idx" ON "pages_blocks_related_insights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_insights_path_idx" ON "pages_blocks_related_insights" USING btree ("_path");
  CREATE INDEX "pages_blocks_deployment_cards_items_order_idx" ON "pages_blocks_deployment_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_deployment_cards_items_parent_id_idx" ON "pages_blocks_deployment_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_deployment_cards_order_idx" ON "pages_blocks_deployment_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_deployment_cards_parent_id_idx" ON "pages_blocks_deployment_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_deployment_cards_path_idx" ON "pages_blocks_deployment_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_deployment_cards_illustration_idx" ON "pages_blocks_deployment_cards" USING btree ("illustration_id");
  CREATE INDEX "pages_blocks_lead_form_order_idx" ON "pages_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_lead_form_parent_id_idx" ON "pages_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lead_form_path_idx" ON "pages_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_lead_form_illustration_idx" ON "pages_blocks_lead_form" USING btree ("illustration_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_illustration_idx" ON "pages_blocks_cta" USING btree ("illustration_id");
  CREATE INDEX "pages_site_idx" ON "pages" USING btree ("site_id");
  CREATE INDEX "pages_site_code_idx" ON "pages" USING btree ("site_code");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_locale_idx" ON "pages" USING btree ("locale");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_status_idx" ON "pages" USING btree ("status");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "posts_site_idx" ON "posts" USING btree ("site_id");
  CREATE INDEX "posts_site_code_idx" ON "posts" USING btree ("site_code");
  CREATE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_locale_idx" ON "posts" USING btree ("locale");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_reviewer_idx" ON "posts" USING btree ("reviewer_id");
  CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_texts_text_idx" ON "posts_texts" USING btree ("text");
  CREATE INDEX "service_sections_items_order_idx" ON "service_sections_items" USING btree ("_order");
  CREATE INDEX "service_sections_items_parent_id_idx" ON "service_sections_items" USING btree ("_parent_id");
  CREATE INDEX "service_sections_process_order_idx" ON "service_sections_process" USING btree ("_order");
  CREATE INDEX "service_sections_process_parent_id_idx" ON "service_sections_process" USING btree ("_parent_id");
  CREATE INDEX "service_sections_outcomes_order_idx" ON "service_sections_outcomes" USING btree ("_order");
  CREATE INDEX "service_sections_outcomes_parent_id_idx" ON "service_sections_outcomes" USING btree ("_parent_id");
  CREATE INDEX "service_sections_site_idx" ON "service_sections" USING btree ("site_id");
  CREATE INDEX "service_sections_site_code_idx" ON "service_sections" USING btree ("site_code");
  CREATE INDEX "service_sections_section_id_idx" ON "service_sections" USING btree ("section_id");
  CREATE INDEX "service_sections_locale_idx" ON "service_sections" USING btree ("locale");
  CREATE INDEX "service_sections_status_idx" ON "service_sections" USING btree ("status");
  CREATE INDEX "service_sections_updated_at_idx" ON "service_sections" USING btree ("updated_at");
  CREATE INDEX "service_sections_created_at_idx" ON "service_sections" USING btree ("created_at");
  CREATE INDEX "service_sections_texts_order_parent" ON "service_sections_texts" USING btree ("order","parent_id");
  CREATE INDEX "service_sections_texts_text_idx" ON "service_sections_texts" USING btree ("text");
  CREATE UNIQUE INDEX "products_code_idx" ON "products" USING btree ("code");
  CREATE INDEX "products_logo_idx" ON "products" USING btree ("logo_id");
  CREATE INDEX "products_status_idx" ON "products" USING btree ("status");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "solutions_site_idx" ON "solutions" USING btree ("site_id");
  CREATE INDEX "solutions_site_code_idx" ON "solutions" USING btree ("site_code");
  CREATE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_status_idx" ON "solutions" USING btree ("status");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "case_studies_results_order_idx" ON "case_studies_results" USING btree ("_order");
  CREATE INDEX "case_studies_results_parent_id_idx" ON "case_studies_results" USING btree ("_parent_id");
  CREATE INDEX "case_studies_site_idx" ON "case_studies" USING btree ("site_id");
  CREATE INDEX "case_studies_site_code_idx" ON "case_studies" USING btree ("site_code");
  CREATE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_cover_idx" ON "case_studies" USING btree ("cover_id");
  CREATE INDEX "case_studies_status_idx" ON "case_studies" USING btree ("status");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "faqs_site_idx" ON "faqs" USING btree ("site_id");
  CREATE INDEX "faqs_site_code_idx" ON "faqs" USING btree ("site_code");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs_texts_order_parent" ON "faqs_texts" USING btree ("order","parent_id");
  CREATE INDEX "menus_site_idx" ON "menus" USING btree ("site_id");
  CREATE INDEX "menus_site_code_idx" ON "menus" USING btree ("site_code");
  CREATE INDEX "menus_updated_at_idx" ON "menus" USING btree ("updated_at");
  CREATE INDEX "menus_created_at_idx" ON "menus" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_code_idx" ON "forms" USING btree ("code");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms_texts_order_parent" ON "forms_texts" USING btree ("order","parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_site_idx" ON "form_submissions" USING btree ("site_id");
  CREATE INDEX "form_submissions_page_idx" ON "form_submissions" USING btree ("page_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "prompt_sets_prompts_order_idx" ON "prompt_sets_prompts" USING btree ("_order");
  CREATE INDEX "prompt_sets_prompts_parent_id_idx" ON "prompt_sets_prompts" USING btree ("_parent_id");
  CREATE INDEX "prompt_sets_site_idx" ON "prompt_sets" USING btree ("site_id");
  CREATE INDEX "prompt_sets_site_code_idx" ON "prompt_sets" USING btree ("site_code");
  CREATE UNIQUE INDEX "prompt_sets_code_idx" ON "prompt_sets" USING btree ("code");
  CREATE INDEX "prompt_sets_updated_at_idx" ON "prompt_sets" USING btree ("updated_at");
  CREATE INDEX "prompt_sets_created_at_idx" ON "prompt_sets" USING btree ("created_at");
  CREATE INDEX "redirects_site_idx" ON "redirects" USING btree ("site_id");
  CREATE INDEX "redirects_site_code_idx" ON "redirects" USING btree ("site_code");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "chat_sessions_device_id_idx" ON "chat_sessions" USING btree ("device_id");
  CREATE UNIQUE INDEX "chat_sessions_session_id_idx" ON "chat_sessions" USING btree ("session_id");
  CREATE INDEX "chat_sessions_site_code_idx" ON "chat_sessions" USING btree ("site_code");
  CREATE INDEX "chat_sessions_updated_at_idx" ON "chat_sessions" USING btree ("updated_at");
  CREATE INDEX "chat_sessions_created_at_idx" ON "chat_sessions" USING btree ("created_at");
  CREATE UNIQUE INDEX "chat_users_device_id_idx" ON "chat_users" USING btree ("device_id");
  CREATE INDEX "chat_users_updated_at_idx" ON "chat_users" USING btree ("updated_at");
  CREATE INDEX "chat_users_created_at_idx" ON "chat_users" USING btree ("created_at");
  CREATE UNIQUE INDEX "chat_usage_key_idx" ON "chat_usage" USING btree ("key");
  CREATE INDEX "chat_usage_day_idx" ON "chat_usage" USING btree ("day");
  CREATE INDEX "chat_usage_updated_at_idx" ON "chat_usage" USING btree ("updated_at");
  CREATE INDEX "chat_usage_created_at_idx" ON "chat_usage" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_sites_id_idx" ON "payload_locked_documents_rels" USING btree ("sites_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_service_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("service_sections_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("menus_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_prompt_sets_id_idx" ON "payload_locked_documents_rels" USING btree ("prompt_sets_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_chat_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_sessions_id");
  CREATE INDEX "payload_locked_documents_rels_chat_users_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_users_id");
  CREATE INDEX "payload_locked_documents_rels_chat_usage_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_usage_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_texts" CASCADE;
  DROP TABLE "sites" CASCADE;
  DROP TABLE "sites_texts" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_product_cards_items" CASCADE;
  DROP TABLE "pages_blocks_product_cards" CASCADE;
  DROP TABLE "pages_blocks_solution_cards_items" CASCADE;
  DROP TABLE "pages_blocks_solution_cards" CASCADE;
  DROP TABLE "pages_blocks_pain_points_items" CASCADE;
  DROP TABLE "pages_blocks_pain_points" CASCADE;
  DROP TABLE "pages_blocks_process_timeline" CASCADE;
  DROP TABLE "pages_blocks_statistics_items" CASCADE;
  DROP TABLE "pages_blocks_statistics" CASCADE;
  DROP TABLE "pages_blocks_screenshots_items" CASCADE;
  DROP TABLE "pages_blocks_screenshots" CASCADE;
  DROP TABLE "pages_blocks_architecture_layers" CASCADE;
  DROP TABLE "pages_blocks_architecture" CASCADE;
  DROP TABLE "pages_blocks_comparison_table_rows" CASCADE;
  DROP TABLE "pages_blocks_comparison_table" CASCADE;
  DROP TABLE "pages_blocks_integration_items" CASCADE;
  DROP TABLE "pages_blocks_integration" CASCADE;
  DROP TABLE "pages_blocks_case_study_cards_items" CASCADE;
  DROP TABLE "pages_blocks_case_study_cards" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_related_insights_items" CASCADE;
  DROP TABLE "pages_blocks_related_insights" CASCADE;
  DROP TABLE "pages_blocks_deployment_cards_items" CASCADE;
  DROP TABLE "pages_blocks_deployment_cards" CASCADE;
  DROP TABLE "pages_blocks_lead_form" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "service_sections_items" CASCADE;
  DROP TABLE "service_sections_process" CASCADE;
  DROP TABLE "service_sections_outcomes" CASCADE;
  DROP TABLE "service_sections" CASCADE;
  DROP TABLE "service_sections_texts" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "case_studies_results" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_texts" CASCADE;
  DROP TABLE "menus" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_texts" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "prompt_sets_prompts" CASCADE;
  DROP TABLE "prompt_sets" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "chat_sessions" CASCADE;
  DROP TABLE "chat_users" CASCADE;
  DROP TABLE "chat_usage" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_sites_status";
  DROP TYPE "public"."enum_pages_blocks_hero_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_padding";
  DROP TYPE "public"."enum_pages_blocks_rich_text_theme";
  DROP TYPE "public"."enum_pages_blocks_rich_text_padding";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_theme";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_padding";
  DROP TYPE "public"."enum_pages_blocks_product_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_product_cards_padding";
  DROP TYPE "public"."enum_pages_blocks_solution_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_solution_cards_padding";
  DROP TYPE "public"."enum_pages_blocks_pain_points_theme";
  DROP TYPE "public"."enum_pages_blocks_pain_points_padding";
  DROP TYPE "public"."enum_pages_blocks_process_timeline_theme";
  DROP TYPE "public"."enum_pages_blocks_process_timeline_padding";
  DROP TYPE "public"."enum_pages_blocks_statistics_theme";
  DROP TYPE "public"."enum_pages_blocks_statistics_padding";
  DROP TYPE "public"."enum_pages_blocks_screenshots_theme";
  DROP TYPE "public"."enum_pages_blocks_screenshots_padding";
  DROP TYPE "public"."enum_pages_blocks_architecture_theme";
  DROP TYPE "public"."enum_pages_blocks_architecture_padding";
  DROP TYPE "public"."enum_pages_blocks_comparison_table_theme";
  DROP TYPE "public"."enum_pages_blocks_comparison_table_padding";
  DROP TYPE "public"."enum_pages_blocks_integration_theme";
  DROP TYPE "public"."enum_pages_blocks_integration_padding";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_padding";
  DROP TYPE "public"."enum_pages_blocks_faq_theme";
  DROP TYPE "public"."enum_pages_blocks_faq_padding";
  DROP TYPE "public"."enum_pages_blocks_related_insights_theme";
  DROP TYPE "public"."enum_pages_blocks_related_insights_padding";
  DROP TYPE "public"."enum_pages_blocks_deployment_cards_theme";
  DROP TYPE "public"."enum_pages_blocks_deployment_cards_padding";
  DROP TYPE "public"."enum_pages_blocks_lead_form_theme";
  DROP TYPE "public"."enum_pages_blocks_lead_form_padding";
  DROP TYPE "public"."enum_pages_blocks_cta_theme";
  DROP TYPE "public"."enum_pages_blocks_cta_padding";
  DROP TYPE "public"."enum_pages_page_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_service_sections_items_side";
  DROP TYPE "public"."enum_service_sections_process_side";
  DROP TYPE "public"."enum_service_sections_visual_type";
  DROP TYPE "public"."enum_service_sections_status";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_solutions_category";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum_prompt_sets_prompts_action_type";`)
}
