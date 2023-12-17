import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("accounts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))
    table.uuid("user_id").references("id").inTable("users")
    table.string("name").notNullable()
    table.timestamp("creation_date").notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("accounts")
}
