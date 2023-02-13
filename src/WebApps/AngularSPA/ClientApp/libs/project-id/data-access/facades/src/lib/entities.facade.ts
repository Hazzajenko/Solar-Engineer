import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import  {EntitiesSelectors} from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class EntitiesFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(EntitiesSelectors.selectEntitiesLoaded)
  allEntities$ = this.store.select(EntitiesSelectors.selectAllEntities)
  entitiesFromRoute$ = this.store.select(EntitiesSelectors.selectEntitiesByProjectIdRouteParams)
}
