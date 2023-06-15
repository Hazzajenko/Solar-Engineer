import { AppUserModel } from '@shared/data-access/models'

export interface AuthorizeResponse {
	user: AppUserModel
	token: string
}
