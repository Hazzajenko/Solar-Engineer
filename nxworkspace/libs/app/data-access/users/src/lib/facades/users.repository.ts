import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { AppUserLinkModel, UserModel } from '@shared/data-access/models'
import { UsersActions } from '../store'
import { UpdateDisplayPictureRequest } from '../models'

@Injectable({
  providedIn: 'root',
})
export class UsersRepository {
  private store = inject(Store)

  getUserByUserName(userName: string) {
    this.store.dispatch(UsersActions.getUserByUsername({ userName }))
  }

  updateDisplayPicture(request: UpdateDisplayPictureRequest) {
    this.store.dispatch(UsersActions.updateAppuserDisplayPictureWithIcon({ request }))
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
