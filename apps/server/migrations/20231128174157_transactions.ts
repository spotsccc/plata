import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))

    table.string("type").notNullable()
    table.uuid("sub_account_id").references("id").inTable("sub_accounts")
    table
      .uuid("exchange_receiver")
      .references("id")
      .inTable("sub_accounts")
      .nullable()
    table.decimal("amount", 24, 0).notNullable()
    table.integer("accuracy").notNullable()
    table.string("currency").notNullable()
    table.decimal("exchange_amount", 24, 0).nullable()
    table.integer("exchange_accuracy").nullable()
    table.string("exchange_currency_code").nullable()
    table.string("category").nullable()
    table.timestamp("creation_date").notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions")
}
