import { AuthUserModel } from '@shared/data-access/models'

export interface SignInResponse {
  user: AuthUserModel
}

export interface SignInResponseWithToken {
  user: AuthUserModel
  token: string
}
