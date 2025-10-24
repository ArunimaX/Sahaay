CREATE TABLE "consumer_info" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(10) NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_provider_info" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(10) NOT NULL,
	"aadhaar" varchar(12) NOT NULL,
	"skill_set" text NOT NULL,
	"years_of_experience" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "work_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consumer_user_id" varchar NOT NULL,
	"service_type" text NOT NULL,
	"description" text NOT NULL,
	"address" text NOT NULL,
	"urgency" varchar(16) NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"service_provider_id" varchar,
	"completed_at" timestamp,
	"otp_validated" varchar(4),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "consumer_info" ADD CONSTRAINT "consumer_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_provider_info" ADD CONSTRAINT "service_provider_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_requests" ADD CONSTRAINT "work_requests_consumer_user_id_users_id_fk" FOREIGN KEY ("consumer_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_requests" ADD CONSTRAINT "work_requests_service_provider_id_service_provider_info_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_provider_info"("id") ON DELETE no action ON UPDATE no action;