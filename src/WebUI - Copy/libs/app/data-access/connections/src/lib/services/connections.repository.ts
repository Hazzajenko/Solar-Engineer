import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ConnectionModel } from '@shared/data-access/models'
import { ConnectionsActions } from '../store'

// import { ConnectionsActions } from 'libs/shared/data-access/connections/src/lib/store'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsRepository {
  private store = inject(Store)

  addConnection(connection: ConnectionModel) {
    this.store.dispatch(ConnectionsActions.addConnection({ connection }))
  }

  addManyConnections(connections: ConnectionModel[]) {
    this.store.dispatch(ConnectionsActions.addManyConnections({ connections }))
  }

  removeConnection(connection: ConnectionModel) {
    this.store.dispatch(ConnectionsActions.removeConnection({ connection }))
  }

  removeManyConnections(connections: ConnectionModel[]) {
    this.store.dispatch(ConnectionsActions.removeManyConnections({ connections }))
  }
}
