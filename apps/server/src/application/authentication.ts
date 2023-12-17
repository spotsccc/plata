import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  createParamDecorator,
} from "@nestjs/common"
import { CreateUserDTO, UsersService } from "./user"
import { randomUUID } from "crypto"
import { addDays, isBefore } from "date-fns"
import { FastifyRequest } from "fastify"
import { UserId as UserIdT } from "models"

export class Token {
  public uuid: string
  public userId: UserIdT
  public expireDate: string

  constructor(uuid: string, userId: UserIdT, expireDate: string) {
    this.expireDate = expireDate
    this.userId = userId
    this.uuid = uuid
  }

  public isExpired() {
    return isBefore(new Date(this.expireDate), new Date())
  }
}

export const ACCESS_TOKENS_REPOSITORY = Symbol("ACCESS_TOKENS_REPOSITORY")
export interface IAccessTokensRepository {
  save(token: Token): Promise<void>
  get(x: { uuid: string }): Promise<Token | null>
  delete(x: { uuid: string }): Promise<void>
}

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(ACCESS_TOKENS_REPOSITORY)
    private readonly accessTokensRepository: IAccessTokensRepository,
    private readonly usersService: UsersService,
  ) {}

  public async getUserId({ uuid }: { uuid: string }): Promise<string> {
    const token = await this.accessTokensRepository.get({ uuid })
    if (!token) {
      // todo: error handling
      throw Error("")
    }
    return token.userId
  }

  public async signIn({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail: string
    password: string
  }): Promise<{ accessToken: Token }> {
    try {
      let user = await this.usersService.getUserByUsername({
        username: usernameOrEmail,
      })
      if (!user) {
        user = await this.usersService.getUserByEmail({
          email: usernameOrEmail,
        })
        if (!user) {
          throw new Error("") // todo: обработка ошибки
        }
      }
      if (user.isPasswordEqual({ password })) {
        throw new Error("Wrong password")
      }
      const accessToken = this.generateToken({ userId: user.id })
      await this.accessTokensRepository.save(accessToken)
      return { accessToken }
    } catch (error) {
      // todo: обработка ошибки
      throw new Error("")
    }
  }

  public async signUp(createUserDTO: CreateUserDTO) {
    const user = await this.usersService.createNewUser(createUserDTO)
    const accessToken = this.generateToken({ userId: user.id })
    await this.accessTokensRepository.save(accessToken)
    return { accessToken }
  }

  public async isTokenValid({ uuid }: { uuid: string }): Promise<boolean> {
    try {
      const existedToken = await this.accessTokensRepository.get({
        uuid,
      })
      if (!existedToken) {
        return false
      }
      return !existedToken.isExpired()
    } catch (error) {
      // todo: обработка ошибок
      throw new Error("")
    }
  }

  private generateToken({ userId }: { userId: UserIdT }): Token {
    return new Token(
      randomUUID(),
      userId,
      addDays(new Date(), 14).toISOString(),
    )
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const accessTokenUuid = request.cookies["accessToken"]
    if (!accessTokenUuid) {
      return false
    }
    try {
      const isTokenValid = await this.authenticationService.isTokenValid({
        uuid: accessTokenUuid,
      })
      if (isTokenValid) {
        // @ts-ignore
        request["userId"] = await this.authenticationService.getUserId({
          uuid: accessTokenUuid,
        })
        return true
      }
      return false
    } catch (error) {
      // todo: logging
      return false
    }
  }
}

export const UserId = createParamDecorator(
  (_, ctx: ExecutionContext): UserIdT => {
    const request = ctx.switchToHttp().getRequest()
    return request.userId
  },
)
