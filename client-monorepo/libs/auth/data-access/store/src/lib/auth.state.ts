import {UserModel} from '@shared/models'
export interface AuthState {
  user?: UserModel;
  token?: string;
}
