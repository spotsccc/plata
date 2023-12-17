import { Response } from "../response"

export type SignInRequest = {
  username: string
  email: string
  password: string
}

export type SignUpRequest = {
  usernameOrEmail: string
  password: string
}

export type SignUpResponse = Response<{
  accessToken: string
}>

export type SignInResponse = Response<{
  accessToken: string
}>
