import { AuthUserModel } from '@shared/data-access/models'

export interface AuthorizeResponse {
  token: string
  user: AuthUserModel
}