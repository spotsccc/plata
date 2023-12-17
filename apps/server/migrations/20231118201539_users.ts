import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("users", async (table) => {
      table.string("password").notNullable()
      table.string("username").notNullable().unique()
      table.string("email").notNullable().unique()
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
