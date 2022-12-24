import { UserModel } from '@shared/data-access/models'

export interface AuthState {
  user?: UserModel
  token?: string
}
