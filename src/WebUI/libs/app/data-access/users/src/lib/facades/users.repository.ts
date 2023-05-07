import { UpdateDisplayPictureRequest } from '../models'
import { UsersActions } from '../store'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { AppUserLinkModel } from '@shared/data-access/models'


@Injectable({
	providedIn: 'root',
})
export class UsersRepository {
	private store = inject(Store)

	getUserByUserName(userName: string) {
		this.store.dispatch(UsersActions.getUserByUserName({ userName }))
	}

	sendFriendRequest(userName: string) {
		this.store.dispatch(UsersActions.sendFriendRequest({ userName }))
	}

	acceptFriendRequest(userName: string) {
		this.store.dispatch(UsersActions.acceptFriendRequest({ userName }))
	}

	rejectFriendRequest(userName: string) {
		this.store.dispatch(UsersActions.rejectFriendRequest({ userName }))
	}

	updateDisplayPicture(request: UpdateDisplayPictureRequest) {
		this.store.dispatch(UsersActions.updateAppUserDisplayPictureWithIcon({ request }))
	}

	addUser(user: AppUserLinkModel) {
		this.store.dispatch(UsersActions.addUser({ user }))
	}

	addManyUsers(users: AppUserLinkModel[]) {
		this.store.dispatch(UsersActions.addManyUsers({ users }))
	}

	updateUser(update: Update<AppUserLinkModel>) {
		this.store.dispatch(UsersActions.updateUser({ update }))
	}

	removeUser(userUserName: string) {
		this.store.dispatch(UsersActions.removeUser({ userUserName }))
	}
}