import { inject, Injectable } from '@angular/core'
import { ConnectionsFacade } from './connections.facade'
import { ConnectionsRepository } from './connections.repository'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsStoreService {
  public select = inject(ConnectionsFacade)
  public dispatch = inject(ConnectionsRepository)
}
