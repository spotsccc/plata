import { Inject, Injectable } from "@nestjs/common"
import { createHash } from "crypto"
import { Email, UserId, Username } from "models"

export type UserDTO = {
  id: UserId
  password: string
  email: Email
  username: Username
}

export class User {
  public id: UserId
  public password: string
  public email: Email
  public username: Username

  constructor(data: UserDTO) {
    this.id = data.id
    this.username = data.username
    this.email = data.email
    this.password = data.password
  }

  public isPasswordEqual({ password }: { password: string }): boolean {
    return this.password === createHash("sha256").update(password).digest("hex")
  }
}

export type CreateUserDTO = {
  password: string
  email: string
  username: string
}

export type UserUpdate = {
  password?: string
  email?: string
  username?: string
}

export const USERS_REPOSITORY = Symbol("USERS_REPOSITORY")

export class SaveUserError extends Error {}
export class GetUserError extends Error {}

export interface IUsersRepository {
  getById(x: { id: UserId }): Promise<User | null>
  getByUsername(x: { username: Username }): Promise<User | null>
  getByEmail(x: { email: string }): Promise<User | null>
  delete(x: { id: UserId }): Promise<void>
  save(data: CreateUserDTO): Promise<void>
  update(x: { update: UserUpdate; id: UserId }): Promise<void>
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly userRepository: IUsersRepository,
  ) {}

  public async createNewUser(data: CreateUserDTO): Promise<User> {
    await this.saveUser(data)
    const user = await this.getUserByUsername({
      username: data.username,
    })
    if (!user) {
      throw new Error() // todo: обработка ошибки
    }
    return user
  }

  public async getUserById({ id }: { id: UserId }): Promise<User | null> {
    try {
      const user = await this.userRepository.getById({ id })
      return user
    } catch (error) {
      // todo: logger
      throw new GetUserError(`can't get user by id: ${id}`, { cause: error })
    }
  }

  public async getUserByUsername({
    username,
  }: {
    username: string
  }): Promise<User | null> {
    try {
      const user = await this.userRepository.getByUsername({ username })
      return user
    } catch (error) {
      // todo: logger
      throw new GetUserError(`can't get user by username: ${username}`, {
        cause: error,
      })
    }
  }

  public async getUserByEmail({
    email,
  }: {
    email: string
  }): Promise<User | null> {
    try {
      const user = await this.userRepository.getByUsername({ username: email })
      return user
    } catch (error) {
      // todo: logger
      throw new GetUserError(`can't get user by email: ${email}`, {
        cause: error,
      })
    }
  }

  private async saveUser(data: CreateUserDTO): Promise<void> {
    try {
      await this.userRepository.save({
        ...data,
        password: createHash("sha256").update(data.password).digest("hex"),
      })
    } catch (error) {
      //todo: logger
      throw new SaveUserError(`can't save user data=${data}`, { cause: error })
    }
  }

  public async updateUser({
    id,
    update,
  }: {
    id: UserId
    update: UserUpdate
  }): Promise<void> {
    try {
      await this.userRepository.update({ id, update })
    } catch (error) {
      //todo: logger
      throw new SaveUserError(
        `can't update user with id=${id} update=${update}`,
        { cause: error },
      )
    }
  }
}
