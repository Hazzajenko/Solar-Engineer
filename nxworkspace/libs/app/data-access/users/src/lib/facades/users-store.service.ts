import { inject, Injectable } from '@angular/core'
import { UsersFacade } from './users.facade'
import { UsersRepository } from './users.repository'

@Injectable({
  providedIn: 'root',
})
export class UsersStoreService {
  public select = inject(UsersFacade)
  public dispatch = inject(UsersRepository)
}
