import { AppUserModel } from '@shared/data-access/models'

export interface SignInResponse {
	user: AppUserModel
}

export interface SignInResponseWithToken {
	user: AppUserModel
	token: string
}
