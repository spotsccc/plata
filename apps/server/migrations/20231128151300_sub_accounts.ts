import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sub_accounts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))

    table.uuid("account_id").references("id").inTable("accounts")
    table.decimal("total_amount", 24, 0).notNullable()
    table.integer("total_accuracy").notNullable()
    table.string("total_currency_code").notNullable()
    table.string("name").notNullable()
    table.datetime("creation_date").notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("sub_accounts")
}
