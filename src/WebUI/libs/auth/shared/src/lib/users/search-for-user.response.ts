import { MinimalWebUser, WebUserModel } from './web-user.model'

export type SearchForUserResponse = {
	appUsers: MinimalWebUser[]
}

export type SearchForAppUserRequest = {
	searchQuery: string
}

export type SearchForAppUserResponse = {
	users: WebUserModel[]
}
