CREATE TABLE "delivery_proofs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ngo_request_id" varchar NOT NULL,
	"before_image_path" text NOT NULL,
	"after_image_path" text NOT NULL,
	"before_lat" numeric(10, 6) NOT NULL,
	"before_lng" numeric(10, 6) NOT NULL,
	"after_lat" numeric(10, 6) NOT NULL,
	"after_lng" numeric(10, 6) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "donor_info" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(10) NOT NULL,
	"address" text NOT NULL,
	"aadhaar" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "food_donations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"total_items" integer NOT NULL,
	"total_quantity" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "food_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donation_id" varchar NOT NULL,
	"food_type" text NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"food_safety_tag" text,
	"preparation_time" varchar NOT NULL,
	"preparation_date" varchar NOT NULL,
	"food_type_category" text NOT NULL,
	"storage_requirement" text NOT NULL,
	"expiry_date" varchar NOT NULL,
	"expiry_time" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ngo_info" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(10) NOT NULL,
	"address" text NOT NULL,
	"pan_id" varchar(16) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ngo_requests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donation_id" varchar NOT NULL,
	"ngo_user_id" varchar NOT NULL,
	"status" varchar(16) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"decision_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" varchar(32) NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_ngo_request_id_ngo_requests_id_fk" FOREIGN KEY ("ngo_request_id") REFERENCES "public"."ngo_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donor_info" ADD CONSTRAINT "donor_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_donations" ADD CONSTRAINT "food_donations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_items" ADD CONSTRAINT "food_items_donation_id_food_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."food_donations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ngo_info" ADD CONSTRAINT "ngo_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ngo_requests" ADD CONSTRAINT "ngo_requests_donation_id_food_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."food_donations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ngo_requests" ADD CONSTRAINT "ngo_requests_ngo_user_id_users_id_fk" FOREIGN KEY ("ngo_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;