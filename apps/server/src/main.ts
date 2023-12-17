import { NestFactory } from "@nestjs/core"
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify"
import fastifyCookie from "@fastify/cookie"
import { App } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    App,
    new FastifyAdapter(),
    {
      rawBody: false,
    },
  )
  app.setGlobalPrefix("api")

  app.enableCors({ origin: "http://localhost:8000", credentials: true })
  //@ts-ignore
  await app.register(fastifyCookie, {})

  await app.listen(4000, "0.0.0.0")
}

bootstrap().catch(console.log)
