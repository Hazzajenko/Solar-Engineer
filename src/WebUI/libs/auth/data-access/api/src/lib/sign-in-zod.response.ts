import { UserType } from './user.type'

export interface SignInZodResponse {
  user: UserType
  token: string
}
