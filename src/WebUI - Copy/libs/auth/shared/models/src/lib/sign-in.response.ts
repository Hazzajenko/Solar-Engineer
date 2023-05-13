import { IUserModel } from '@shared/data-access/models'

export interface SignInResponse {
  /*  email: string
   firstName: string
   lastName: string
   userName: string*/
  user: IUserModel
  token: string
  /*  photoUrl: string
   created: string
   lastActive: string*/
}