CREATE TABLE IF NOT EXISTS "transactions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"account_id" bigint NOT NULL,
	"type" varchar(64) NOT NULL,
	"amount" numeric(32, 0) NOT NULL,
	"accuracy" integer NOT NULL,
	"currency" varchar(32),
	"description" varchar(512),
	"create_at" timestamp with time zone NOT NULL,
	"category" varchar(64),
	"receiver_id" bigint,
	"receive_amount" numeric(32, 0),
	"receive_accuracy" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_accounts_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
