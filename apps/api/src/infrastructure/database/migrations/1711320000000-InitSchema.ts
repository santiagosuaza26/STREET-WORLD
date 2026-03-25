import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1711320000000 implements MigrationInterface {
  name = 'InitSchema1711320000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY,
      "email" varchar NOT NULL UNIQUE,
      "passwordHash" varchar NOT NULL,
      "refreshTokenHash" varchar,
      "refreshTokenExpiresAt" timestamp,
      "firstName" varchar,
      "lastName" varchar,
      "phone" varchar,
      "documentId" varchar,
      "addressLine" varchar,
      "city" varchar,
      "country" varchar NOT NULL DEFAULT 'CO',
      "paymentMethods" text,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "categories" (
      "id" uuid PRIMARY KEY,
      "slug" varchar NOT NULL UNIQUE,
      "name" varchar NOT NULL,
      "description" text,
      "image" varchar,
      "isActive" boolean NOT NULL DEFAULT true,
      "parentId" varchar,
      "order" integer NOT NULL DEFAULT 0,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "products" (
      "id" uuid PRIMARY KEY,
      "slug" varchar UNIQUE,
      "name" varchar NOT NULL,
      "description" text NOT NULL,
      "summary" text,
      "tag" varchar,
      "gender" varchar NOT NULL DEFAULT 'unisex',
      "highlights" text,
      "price" numeric(10,2) NOT NULL,
      "salePrice" numeric(10,2),
      "onSale" boolean NOT NULL DEFAULT false,
      "isBestSeller" boolean NOT NULL DEFAULT false,
      "isNewArrival" boolean NOT NULL DEFAULT false,
      "inStock" boolean NOT NULL DEFAULT true,
      "image" varchar NOT NULL,
      "images" text,
      "category" varchar NOT NULL,
      "stock" integer NOT NULL DEFAULT 0,
      "sizes" text,
      "colors" text,
      "brand" varchar,
      "collection" varchar,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "contact_messages" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "fullName" varchar(120) NOT NULL,
      "email" varchar(160) NOT NULL,
      "subject" varchar(160) NOT NULL,
      "message" text NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )`);

    await queryRunner.query(`DO $$ BEGIN
      CREATE TYPE "orders_status_enum" AS ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "orders" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL,
      "status" "orders_status_enum" NOT NULL DEFAULT 'PENDING',
      "total" numeric(10,2) NOT NULL,
      "notes" text,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now(),
      CONSTRAINT "FK_orders_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "order_items" (
      "id" uuid PRIMARY KEY,
      "orderId" uuid NOT NULL,
      "productId" uuid NOT NULL,
      "productName" varchar NOT NULL,
      "unitPrice" numeric(10,2) NOT NULL,
      "quantity" integer NOT NULL,
      "subtotal" numeric(10,2) NOT NULL,
      CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "payments" (
      "id" uuid PRIMARY KEY,
      "orderId" uuid NOT NULL,
      "status" varchar NOT NULL DEFAULT 'PENDING',
      "method" varchar NOT NULL,
      "amount" numeric(10,2) NOT NULL,
      "transactionId" varchar,
      "metadata" text,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp,
      CONSTRAINT "FK_payments_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    )`);

    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_orders_userId" ON "orders" ("userId")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_orders_status" ON "orders" ("status")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_orders_createdAt" ON "orders" ("createdAt")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_order_items_orderId" ON "order_items" ("orderId")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_order_items_productId" ON "order_items" ("productId")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_payments_orderId" ON "payments" ("orderId")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_payments_status" ON "payments" ("status")');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "UQ_payments_transactionId" ON "payments" ("transactionId") WHERE "transactionId" IS NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "UQ_payments_transactionId"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_payments_status"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_payments_orderId"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_order_items_productId"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_order_items_orderId"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_orders_createdAt"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_orders_status"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_orders_userId"');

    await queryRunner.query('DROP TABLE IF EXISTS "payments"');
    await queryRunner.query('DROP TABLE IF EXISTS "order_items"');
    await queryRunner.query('DROP TABLE IF EXISTS "orders"');
    await queryRunner.query('DROP TYPE IF EXISTS "orders_status_enum"');
    await queryRunner.query('DROP TABLE IF EXISTS "contact_messages"');
    await queryRunner.query('DROP TABLE IF EXISTS "products"');
    await queryRunner.query('DROP TABLE IF EXISTS "categories"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}
