import {
  Body,
  Controller,
  Injectable,
  PipeTransform,
  Post,
  UseGuards,
} from "@nestjs/common"
import {
  SubAccountCreateRequest,
  SubAccountCreateRequestSchema,
} from "api-contracts"
import { SubAccountCreateResponse } from "api-contracts"

import { AccountService } from "@/application/accounts"
import { AuthGuard, UserId } from "@/application/authentication"

@Injectable()
export class SubAccountCreateRequestValidation implements PipeTransform {
  transform(value: unknown) {
    return SubAccountCreateRequestSchema.parse(value)
  }
}

@UseGuards(AuthGuard)
@Controller("sub-account")
export class SubAccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  public async create(
    @Body(SubAccountCreateRequestValidation) body: SubAccountCreateRequest,
  ): Promise<SubAccountCreateResponse> {
    const subAccount = await this.accountService.createSubAccount({
      data: body,
    })
    return {
      subAccount,
    }
  }
}
