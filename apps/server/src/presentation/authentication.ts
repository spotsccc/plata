import { AuthGuard, AuthenticationService } from "@/application/authentication"
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common"
import { FastifyReply } from "fastify"
import { IsString } from "class-validator"
import { addDays } from "date-fns"

class SignInRequestBody {
  public usernameOrEmail: string
  public password: string

  constructor(usernameOrEmail: string, password: string) {
    this.password = password
    this.usernameOrEmail = usernameOrEmail
  }
}

class SignUpRequestBody {
  @IsString()
  public username: string

  @IsString()
  public password: string

  @IsString()
  public email: string

  constructor(username: string, password: string, email: string) {
    this.email = email
    this.password = password
    this.username = username
  }
}

@Controller("auth")
export class AuthencticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post("sign-in")
  public async signIn(
    @Body() body: SignInRequestBody,
    @Res() response: FastifyReply,
  ) {
    const { accessToken } = await this.authService.signIn(body)
    response.setCookie("accessToken", accessToken.uuid, {
      httpOnly: true,
      path: "/",
      expires: addDays(new Date(), 14),
    })
    return { accessToken }
  }

  @Post("sign-up")
  public async signUp(
    @Body() body: SignUpRequestBody,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const { accessToken } = await this.authService.signUp(body)
    response.setCookie("accessToken", accessToken.uuid, {
      httpOnly: true,
      path: "/",
      expires: addDays(new Date(), 14),
    })
    return { accessToken }
  }

  @Get("test")
  @UseGuards(AuthGuard)
  public async test() {
    return "hello world"
  }
}
