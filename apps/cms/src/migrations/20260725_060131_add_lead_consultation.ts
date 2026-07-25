import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_source" AS ENUM('web-form', 'ai-chat', 'email', 'consultant');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('NEW', 'AI_QUALIFYING', 'NEED_MORE_INFORMATION', 'AI_RECOMMENDATION_SENT', 'WAITING_CUSTOMER', 'HUMAN_READY', 'ASSIGNED', 'CONTACTED', 'MEETING_BOOKED', 'PROPOSAL', 'NURTURE', 'UNSUBSCRIBED', 'CLOSED_LOST');
  CREATE TYPE "public"."enum_lead_devices_consent_status" AS ENUM('unknown', 'granted', 'denied');
  CREATE TYPE "public"."enum_lead_conversations_channels" AS ENUM('web-chat', 'email', 'consultant');
  CREATE TYPE "public"."enum_lead_conversations_status" AS ENUM('NEW', 'AI_QUALIFYING', 'NEED_MORE_INFORMATION', 'AI_RECOMMENDATION_SENT', 'WAITING_CUSTOMER', 'HUMAN_READY', 'ASSIGNED', 'CONTACTED', 'MEETING_BOOKED', 'PROPOSAL', 'NURTURE', 'UNSUBSCRIBED', 'CLOSED_LOST');
  CREATE TYPE "public"."enum_lead_conversations_handoff_reason" AS ENUM('requested_human', 'requested_call_demo_quote', 'complex_request', 'ai_uncertain', 'score_threshold', 'refused_ai', 'manual');
  CREATE TYPE "public"."enum_lead_messages_channel" AS ENUM('web-chat', 'email', 'consultant', 'system');
  CREATE TYPE "public"."enum_lead_messages_direction" AS ENUM('inbound', 'outbound');
  CREATE TYPE "public"."enum_lead_messages_role" AS ENUM('user', 'assistant', 'consultant', 'system');
  CREATE TYPE "public"."enum_resume_tokens_purpose" AS ENUM('resume', 'verify');
  CREATE TYPE "public"."enum_email_templates_audience" AS ENUM('customer', 'consultant');
  CREATE TYPE "public"."enum_email_templates_trigger_status" AS ENUM('NEW', 'AI_QUALIFYING', 'NEED_MORE_INFORMATION', 'AI_RECOMMENDATION_SENT', 'WAITING_CUSTOMER', 'HUMAN_READY', 'ASSIGNED', 'CONTACTED', 'MEETING_BOOKED', 'PROPOSAL', 'NURTURE', 'UNSUBSCRIBED', 'CLOSED_LOST');
  CREATE TYPE "public"."enum_consultants_specialties" AS ENUM('x-ai', 'xbooking', 'finerp', 'xbuilding', 'x-space', 'consulting');
  CREATE TYPE "public"."enum_consultant_assignments_status" AS ENUM('pending', 'accepted', 'contacted', 'closed');
  CREATE TYPE "public"."enum_consultant_assignments_handoff_reason" AS ENUM('requested_human', 'requested_call_demo_quote', 'complex_request', 'ai_uncertain', 'score_threshold', 'refused_ai', 'manual');
  CREATE TYPE "public"."enum_lead_activities_channel" AS ENUM('web-chat', 'email', 'consultant', 'system');
  CREATE TABLE "leads" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"job_title" varchar,
  	"source" "enum_leads_source" DEFAULT 'web-form',
  	"site_code" varchar,
  	"form_code" varchar,
  	"status" "enum_leads_status" DEFAULT 'NEW' NOT NULL,
  	"score" numeric DEFAULT 0,
  	"primary_need" varchar,
  	"business_model" varchar,
  	"user_scale" varchar,
  	"current_systems" varchar,
  	"departments" varchar,
  	"urgency" varchar,
  	"target_timeline" varchar,
  	"infrastructure" varchar,
  	"demo_or_quote" varchar,
  	"decision_maker" varchar,
  	"assigned_consultant_id" uuid,
  	"last_conversation_id" uuid,
  	"consent" boolean,
  	"unsubscribed" boolean,
  	"email_verified_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_devices" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"device_id" varchar NOT NULL,
  	"contact_id" uuid,
  	"first_seen_at" timestamp(3) with time zone,
  	"last_seen_at" timestamp(3) with time zone,
  	"consent_status" "enum_lead_devices_consent_status" DEFAULT 'unknown',
  	"is_trusted" boolean DEFAULT false,
  	"site_code" varchar,
  	"trusted_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_conversations_channels" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_lead_conversations_channels",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "lead_conversations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"public_id" varchar NOT NULL,
  	"lead_id" uuid NOT NULL,
  	"status" "enum_lead_conversations_status" DEFAULT 'NEW' NOT NULL,
  	"score" numeric DEFAULT 0,
  	"turn_count" numeric DEFAULT 0,
  	"origin_device_id" varchar,
  	"site_code" varchar,
  	"qualification_summary" varchar,
  	"collected" jsonb,
  	"missing_fields" jsonb,
  	"recommendation" varchar,
  	"handoff_reason" "enum_lead_conversations_handoff_reason",
  	"handoff_at" timestamp(3) with time zone,
  	"human_takeover_at" timestamp(3) with time zone,
  	"ai_paused" boolean DEFAULT false,
  	"last_outbound_email_at" timestamp(3) with time zone,
  	"outbound_email_count" numeric DEFAULT 0,
  	"last_email_message_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_conversations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"lead_devices_id" uuid
  );
  
  CREATE TABLE "lead_messages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"conversation_id" uuid NOT NULL,
  	"channel" "enum_lead_messages_channel" NOT NULL,
  	"direction" "enum_lead_messages_direction" NOT NULL,
  	"role" "enum_lead_messages_role" NOT NULL,
  	"content_text" varchar NOT NULL,
  	"content_html" varchar,
  	"email_message_id" varchar,
  	"email_in_reply_to" varchar,
  	"email_subject" varchar,
  	"email_from" varchar,
  	"template_key" varchar,
  	"device_id" varchar,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resume_tokens" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"token_hash" varchar NOT NULL,
  	"purpose" "enum_resume_tokens_purpose" DEFAULT 'resume' NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"lead_id" uuid,
  	"conversation_id" uuid,
  	"expected_device_id" varchar,
  	"otp_hash" varchar,
  	"otp_expires_at" timestamp(3) with time zone,
  	"otp_attempts" numeric DEFAULT 0,
  	"pending_device_id" varchar,
  	"used_at" timestamp(3) with time zone,
  	"revoked" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_templates" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"template_key" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"audience" "enum_email_templates_audience" DEFAULT 'customer' NOT NULL,
  	"trigger_status" "enum_email_templates_trigger_status",
  	"active" boolean DEFAULT true,
  	"subject" varchar NOT NULL,
  	"preheader" varchar,
  	"heading" varchar,
  	"html_body" varchar NOT NULL,
  	"text_body" varchar NOT NULL,
  	"cta_label" varchar,
  	"cta_url_var" varchar,
  	"version" numeric DEFAULT 1,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultants_specialties" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_consultants_specialties",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "consultants" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"active" boolean DEFAULT true,
  	"is_default" boolean DEFAULT false,
  	"user_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultants_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "consultant_assignments" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"lead_id" uuid NOT NULL,
  	"conversation_id" uuid NOT NULL,
  	"consultant_id" uuid,
  	"assigned_at" timestamp(3) with time zone,
  	"sla_due_at" timestamp(3) with time zone,
  	"status" "enum_consultant_assignments_status" DEFAULT 'pending',
  	"handoff_reason" "enum_consultant_assignments_handoff_reason",
  	"score_at_handoff" numeric,
  	"ai_summary" varchar,
  	"notes" varchar,
  	"notified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lead_activities" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"type" varchar NOT NULL,
  	"lead_id" uuid,
  	"conversation_id" uuid,
  	"channel" "enum_lead_activities_channel",
  	"actor" varchar,
  	"summary" varchar,
  	"detail" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_devices_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_conversations_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_messages_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resume_tokens_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_templates_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultants_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultant_assignments_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_activities_id" uuid;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_consultant_id_consultants_id_fk" FOREIGN KEY ("assigned_consultant_id") REFERENCES "public"."consultants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_last_conversation_id_lead_conversations_id_fk" FOREIGN KEY ("last_conversation_id") REFERENCES "public"."lead_conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lead_devices" ADD CONSTRAINT "lead_devices_contact_id_leads_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lead_conversations_channels" ADD CONSTRAINT "lead_conversations_channels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lead_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_conversations" ADD CONSTRAINT "lead_conversations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lead_conversations_rels" ADD CONSTRAINT "lead_conversations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lead_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_conversations_rels" ADD CONSTRAINT "lead_conversations_rels_lead_devices_fk" FOREIGN KEY ("lead_devices_id") REFERENCES "public"."lead_devices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_messages" ADD CONSTRAINT "lead_messages_conversation_id_lead_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."lead_conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resume_tokens" ADD CONSTRAINT "resume_tokens_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resume_tokens" ADD CONSTRAINT "resume_tokens_conversation_id_lead_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."lead_conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultants_specialties" ADD CONSTRAINT "consultants_specialties_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultants" ADD CONSTRAINT "consultants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultants_texts" ADD CONSTRAINT "consultants_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultant_assignments" ADD CONSTRAINT "consultant_assignments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultant_assignments" ADD CONSTRAINT "consultant_assignments_conversation_id_lead_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."lead_conversations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultant_assignments" ADD CONSTRAINT "consultant_assignments_consultant_id_consultants_id_fk" FOREIGN KEY ("consultant_id") REFERENCES "public"."consultants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_conversation_id_lead_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."lead_conversations"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");
  CREATE INDEX "leads_site_code_idx" ON "leads" USING btree ("site_code");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_assigned_consultant_idx" ON "leads" USING btree ("assigned_consultant_id");
  CREATE INDEX "leads_last_conversation_idx" ON "leads" USING btree ("last_conversation_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE UNIQUE INDEX "lead_devices_device_id_idx" ON "lead_devices" USING btree ("device_id");
  CREATE INDEX "lead_devices_contact_idx" ON "lead_devices" USING btree ("contact_id");
  CREATE INDEX "lead_devices_updated_at_idx" ON "lead_devices" USING btree ("updated_at");
  CREATE INDEX "lead_devices_created_at_idx" ON "lead_devices" USING btree ("created_at");
  CREATE INDEX "lead_conversations_channels_order_idx" ON "lead_conversations_channels" USING btree ("order");
  CREATE INDEX "lead_conversations_channels_parent_idx" ON "lead_conversations_channels" USING btree ("parent_id");
  CREATE UNIQUE INDEX "lead_conversations_public_id_idx" ON "lead_conversations" USING btree ("public_id");
  CREATE INDEX "lead_conversations_lead_idx" ON "lead_conversations" USING btree ("lead_id");
  CREATE INDEX "lead_conversations_status_idx" ON "lead_conversations" USING btree ("status");
  CREATE INDEX "lead_conversations_updated_at_idx" ON "lead_conversations" USING btree ("updated_at");
  CREATE INDEX "lead_conversations_created_at_idx" ON "lead_conversations" USING btree ("created_at");
  CREATE INDEX "lead_conversations_rels_order_idx" ON "lead_conversations_rels" USING btree ("order");
  CREATE INDEX "lead_conversations_rels_parent_idx" ON "lead_conversations_rels" USING btree ("parent_id");
  CREATE INDEX "lead_conversations_rels_path_idx" ON "lead_conversations_rels" USING btree ("path");
  CREATE INDEX "lead_conversations_rels_lead_devices_id_idx" ON "lead_conversations_rels" USING btree ("lead_devices_id");
  CREATE INDEX "lead_messages_conversation_idx" ON "lead_messages" USING btree ("conversation_id");
  CREATE UNIQUE INDEX "lead_messages_email_message_id_idx" ON "lead_messages" USING btree ("email_message_id");
  CREATE INDEX "lead_messages_updated_at_idx" ON "lead_messages" USING btree ("updated_at");
  CREATE INDEX "lead_messages_created_at_idx" ON "lead_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "resume_tokens_token_hash_idx" ON "resume_tokens" USING btree ("token_hash");
  CREATE INDEX "resume_tokens_lead_idx" ON "resume_tokens" USING btree ("lead_id");
  CREATE INDEX "resume_tokens_conversation_idx" ON "resume_tokens" USING btree ("conversation_id");
  CREATE INDEX "resume_tokens_updated_at_idx" ON "resume_tokens" USING btree ("updated_at");
  CREATE INDEX "resume_tokens_created_at_idx" ON "resume_tokens" USING btree ("created_at");
  CREATE UNIQUE INDEX "email_templates_template_key_idx" ON "email_templates" USING btree ("template_key");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  CREATE INDEX "consultants_specialties_order_idx" ON "consultants_specialties" USING btree ("order");
  CREATE INDEX "consultants_specialties_parent_idx" ON "consultants_specialties" USING btree ("parent_id");
  CREATE INDEX "consultants_user_idx" ON "consultants" USING btree ("user_id");
  CREATE INDEX "consultants_updated_at_idx" ON "consultants" USING btree ("updated_at");
  CREATE INDEX "consultants_created_at_idx" ON "consultants" USING btree ("created_at");
  CREATE INDEX "consultants_texts_order_parent" ON "consultants_texts" USING btree ("order","parent_id");
  CREATE INDEX "consultant_assignments_lead_idx" ON "consultant_assignments" USING btree ("lead_id");
  CREATE INDEX "consultant_assignments_conversation_idx" ON "consultant_assignments" USING btree ("conversation_id");
  CREATE INDEX "consultant_assignments_consultant_idx" ON "consultant_assignments" USING btree ("consultant_id");
  CREATE INDEX "consultant_assignments_updated_at_idx" ON "consultant_assignments" USING btree ("updated_at");
  CREATE INDEX "consultant_assignments_created_at_idx" ON "consultant_assignments" USING btree ("created_at");
  CREATE INDEX "lead_activities_type_idx" ON "lead_activities" USING btree ("type");
  CREATE INDEX "lead_activities_lead_idx" ON "lead_activities" USING btree ("lead_id");
  CREATE INDEX "lead_activities_conversation_idx" ON "lead_activities" USING btree ("conversation_id");
  CREATE INDEX "lead_activities_updated_at_idx" ON "lead_activities" USING btree ("updated_at");
  CREATE INDEX "lead_activities_created_at_idx" ON "lead_activities" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_devices_fk" FOREIGN KEY ("lead_devices_id") REFERENCES "public"."lead_devices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_conversations_fk" FOREIGN KEY ("lead_conversations_id") REFERENCES "public"."lead_conversations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_messages_fk" FOREIGN KEY ("lead_messages_id") REFERENCES "public"."lead_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resume_tokens_fk" FOREIGN KEY ("resume_tokens_id") REFERENCES "public"."resume_tokens"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultant_assignments_fk" FOREIGN KEY ("consultant_assignments_id") REFERENCES "public"."consultant_assignments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_activities_fk" FOREIGN KEY ("lead_activities_id") REFERENCES "public"."lead_activities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_lead_devices_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_devices_id");
  CREATE INDEX "payload_locked_documents_rels_lead_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_conversations_id");
  CREATE INDEX "payload_locked_documents_rels_lead_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_messages_id");
  CREATE INDEX "payload_locked_documents_rels_resume_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("resume_tokens_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_consultants_id_idx" ON "payload_locked_documents_rels" USING btree ("consultants_id");
  CREATE INDEX "payload_locked_documents_rels_consultant_assignments_id_idx" ON "payload_locked_documents_rels" USING btree ("consultant_assignments_id");
  CREATE INDEX "payload_locked_documents_rels_lead_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_activities_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_devices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_conversations_channels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_conversations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_conversations_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resume_tokens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultants_specialties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultants_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultant_assignments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_activities" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "lead_devices" CASCADE;
  DROP TABLE "lead_conversations_channels" CASCADE;
  DROP TABLE "lead_conversations" CASCADE;
  DROP TABLE "lead_conversations_rels" CASCADE;
  DROP TABLE "lead_messages" CASCADE;
  DROP TABLE "resume_tokens" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "consultants_specialties" CASCADE;
  DROP TABLE "consultants" CASCADE;
  DROP TABLE "consultants_texts" CASCADE;
  DROP TABLE "consultant_assignments" CASCADE;
  DROP TABLE "lead_activities" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_devices_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_conversations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_messages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resume_tokens_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultants_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultant_assignments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_activities_fk";
  
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_devices_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_conversations_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_messages_id_idx";
  DROP INDEX "payload_locked_documents_rels_resume_tokens_id_idx";
  DROP INDEX "payload_locked_documents_rels_email_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultants_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultant_assignments_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_activities_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_devices_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_conversations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_messages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resume_tokens_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultants_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultant_assignments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_activities_id";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_lead_devices_consent_status";
  DROP TYPE "public"."enum_lead_conversations_channels";
  DROP TYPE "public"."enum_lead_conversations_status";
  DROP TYPE "public"."enum_lead_conversations_handoff_reason";
  DROP TYPE "public"."enum_lead_messages_channel";
  DROP TYPE "public"."enum_lead_messages_direction";
  DROP TYPE "public"."enum_lead_messages_role";
  DROP TYPE "public"."enum_resume_tokens_purpose";
  DROP TYPE "public"."enum_email_templates_audience";
  DROP TYPE "public"."enum_email_templates_trigger_status";
  DROP TYPE "public"."enum_consultants_specialties";
  DROP TYPE "public"."enum_consultant_assignments_status";
  DROP TYPE "public"."enum_consultant_assignments_handoff_reason";
  DROP TYPE "public"."enum_lead_activities_channel";`)
}
