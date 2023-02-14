import { inject, Injectable } from '@angular/core'
import { AuthFacade } from './auth.facade'
import { AuthRepository } from './auth.repository'

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  public select = inject(AuthFacade)
  public dispatch = inject(AuthRepository)
}
