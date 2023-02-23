import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
import { ConnectionsSelectors } from '../store'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ConnectionsFacade {
  private store = inject(Store)

  connections$ = this.store.select(ConnectionsSelectors.selectAllConnections)
  error$ = this.store.select(ConnectionsSelectors.selectConnectionsError)
  loaded$ = this.store.select(ConnectionsSelectors.selectConnectionsLoaded)

  get connections() {
    return firstValueFrom(this.connections$)
  }

  isUserOnline$(userId: string) {
    return this.connections$.pipe(
      map((connections) => !!connections.find((connection) => connection.userId === userId)),
    )
  }
}
