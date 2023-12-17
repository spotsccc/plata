import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("access_tokens", (table) => {
    table.string("uuid").primary()
    table.timestamp("expire_date").notNullable()
    table.uuid("user_id").references("id").inTable("users")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("access_tokens")
}
