import { AccountService } from "@/application/accounts"
import { AuthGuard, UserId } from "@/application/authentication"
import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  PipeTransform,
  Post,
  UseGuards,
} from "@nestjs/common"
import {
  AccountCreateRequest,
  AccountCreateRequestSchema,
  AccountCreateResponse,
  AccountGetResponse,
  TransactionCreateRequest,
  TransactionCreateResponse,
  TransctionCreateRequestSchema,
} from "api-contracts"
import { UserId as UserIdT } from "models"

@Injectable()
export class AccountCreateValidation implements PipeTransform {
  transform(value: unknown) {
    return AccountCreateRequestSchema.parse(value)
  }
}

@Injectable()
export class TransactionCreateValidation implements PipeTransform {
  transform(value: unknown) {
    return TransctionCreateRequestSchema.parse(value)
  }
}

@UseGuards(AuthGuard)
@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  public async getList(@UserId() userId: UserIdT) {
    const list = await this.accountService.getList({ userId })
    return list
  }

  @Get("/:id")
  public async get(
    @Param("id") accountId: string,
  ): Promise<AccountGetResponse> {
    const account = await this.accountService.get({ accountId })
    return account
  }

  @Post()
  public async create(
    @UserId() userId: UserIdT,
    @Body(AccountCreateValidation) body: AccountCreateRequest,
  ): Promise<AccountCreateResponse> {
    const account = await this.accountService.create({ userId, data: body })
    return { account }
  }

  @Post("/transaction")
  public async createTransaction(
    @Body(TransactionCreateValidation) body: TransactionCreateRequest,
  ): Promise<TransactionCreateResponse> {
    const res = await this.accountService.createTransaction({ data: body })
    return res
  }
}
