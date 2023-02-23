import { inject, Injectable } from '@angular/core'
import { ConnectionsFacade } from './connections.facade'
import { ConnectionsRepository } from './connections.repository'
// import { ConnectionsFacade } from 'libs/shared/data-access/connections/src/lib/facades/connections.facade'
// import { ConnectionsRepository } from 'libs/shared/data-access/connections/src/lib/facades/connections.repository'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsStoreService {
  public select = inject(ConnectionsFacade)
  public dispatch = inject(ConnectionsRepository)
}
