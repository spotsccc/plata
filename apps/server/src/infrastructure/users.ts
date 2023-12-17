import {
  CreateUserDTO,
  IUsersRepository,
  User,
  UserUpdate,
} from "@/application/user"
import { Knex } from "knex"
import { Email, UserId, Username } from "models"
import { InjectConnection } from "nest-knexjs"

export class UsersRepository implements IUsersRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  public async getById({ id }: { id: Username }): Promise<User | null> {
    const [user] = await this.knex.table("users").select("*").where({ id })
    if (!user) {
      return null
    }
    return new User(user)
  }

  public async getByUsername({
    username,
  }: {
    username: Username
  }): Promise<User | null> {
    const [user] = await this.knex
      .table("users")
      .select("*")
      .where({ username })
    if (!user) {
      return null
    }
    return new User(user)
  }

  public async getByEmail({ email }: { email: Email }): Promise<User | null> {
    const [user] = await this.knex.table("users").select("*").where({ email })
    if (!user) {
      return null
    }
    return new User(user)
  }

  public async delete({ id }: { id: UserId }): Promise<void> {
    await this.knex.table("users").delete().where({ id })
  }

  public async save(data: CreateUserDTO): Promise<void> {
    const { email, password, username } = data
    console.log(email, password, username)
    await this.knex("users").insert({
      email,
      password,
      username,
    })
  }

  public async update({
    update,
    id,
  }: {
    update: UserUpdate
    id: UserId
  }): Promise<void> {
    await this.knex.table("users").update(update).where({ id })
  }
}
