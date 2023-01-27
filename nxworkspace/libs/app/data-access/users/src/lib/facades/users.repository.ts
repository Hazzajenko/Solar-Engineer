import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { UserModel } from '@shared/data-access/models'
import { UsersActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class UsersRepository {
  private store = inject(Store)

  getUserByUserName(userName: string) {
    this.store.dispatch(UsersActions.getUserByUsername({ userName }))
  }

  addUser(user: UserModel) {
    this.store.dispatch(UsersActions.addUser({ user }))
  }

  addManyUsers(users: UserModel[]) {
    this.store.dispatch(UsersActions.addManyUsers({ users }))
  }

  updateUser(update: Update<UserModel>) {
    this.store.dispatch(UsersActions.updateUser({ update }))
  }

  removeUser(userUserName: string) {
    this.store.dispatch(UsersActions.removeUser({ userUserName }))
  }
}
