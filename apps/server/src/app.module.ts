import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { KnexModule } from "nest-knexjs"

import { getKnexConfig } from "./configs/knex"
import { AuthencticationController } from "./presentation/authentication"
import { USERS_REPOSITORY, UsersService } from "./application/user"
import {
  ACCESS_TOKENS_REPOSITORY,
  AuthenticationService,
} from "./application/authentication"
import { UsersRepository } from "./infrastructure/users"
import { AccessTokensRepository } from "./infrastructure/access-tokens"
import { TransactionsRepository } from "./infrastructure/transactions"
import {
  ACCOUNTS_REPOSITORY,
  AccountService,
  SUB_ACCOUNTS_REPOSITORY,
  TRANSACTIONS_REPOSITORY,
} from "./application/accounts"
import { AccountsRepository } from "./infrastructure/accounts"
import { SubAccountsRepository } from "./infrastructure/sub-accounts"
import { AccountController } from "./presentation/account"
import { SubAccountController } from "./presentation/sub-account"

@Module({
  controllers: [
    AuthencticationController,
    AccountController,
    SubAccountController,
  ],
  providers: [
    UsersService,
    AuthenticationService,
    AccountService,
    {
      provide: SUB_ACCOUNTS_REPOSITORY,
      useClass: SubAccountsRepository,
    },
    {
      provide: ACCOUNTS_REPOSITORY,
      useClass: AccountsRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: ACCESS_TOKENS_REPOSITORY,
      useClass: AccessTokensRepository,
    },
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: TransactionsRepository,
    },
  ],
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    KnexModule.forRootAsync(getKnexConfig()),
  ],
})
export class App {}
