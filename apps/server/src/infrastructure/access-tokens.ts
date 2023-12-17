import { IAccessTokensRepository, Token } from "@/application/authentication"
import { Knex } from "knex"
import { InjectConnection } from "nest-knexjs"

export class AccessTokensRepository implements IAccessTokensRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  public async save({ uuid, userId, expireDate }: Token): Promise<void> {
    await this.knex
      .table("access_tokens")
      .insert({ uuid, user_id: userId, expire_date: expireDate })
  }

  public async get({ uuid }: { uuid: string }): Promise<Token | null> {
    const [token] = await this.knex
      .table("access_tokens")
      .select("*", "user_id as userId", "expire_date as expireDate")
      .where({ uuid })
    if (!token) {
      return null
    }
    return new Token(token.uuid, token.userId, token.expireDate)
  }

  public async delete({ uuid }: { uuid: string }): Promise<void> {
    await this.knex.table("access_tokens").delete().where({ uuid })
  }
}
