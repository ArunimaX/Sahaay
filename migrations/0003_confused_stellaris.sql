CREATE TABLE "profile_donor_info" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(10) NOT NULL,
	"address" text NOT NULL,
	"aadhaar" varchar(12) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_food_donations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar NOT NULL,
	"total_items" integer NOT NULL,
	"total_quantity" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_food_items" (
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
ALTER TABLE "profile_donor_info" ADD CONSTRAINT "profile_donor_info_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_food_donations" ADD CONSTRAINT "profile_food_donations_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_food_items" ADD CONSTRAINT "profile_food_items_donation_id_profile_food_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."profile_food_donations"("id") ON DELETE no action ON UPDATE no action;