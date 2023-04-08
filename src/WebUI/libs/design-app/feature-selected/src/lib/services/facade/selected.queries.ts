import { TypeOfEntity } from '../../types'
import { NearbyEntityOnAxis } from '../../types/nearby-entity-on-axis'
import { inject, Injectable } from '@angular/core'
import { selectMultiSelectedEntities, selectMultiSelectedEntitiesOfType, selectNearbyEntitiesOnAxis, selectSelectedPanelState, selectSingleSelectedEntity } from '@design-app/feature-selected'
import { select, Store } from '@ngrx/store'
import { firstValueFrom, Observable } from 'rxjs'
import { SelectedPanelState } from '@design-app/feature-panel'
import { selectSelectedId } from '@projects/data-access'
import { DesignEntityType } from '@design-app/shared'

@Injectable({
  providedIn: 'root',
})
export class SelectedQueries {
  private readonly _store = inject(Store)
  private readonly _singleSelected$: Observable<TypeOfEntity | undefined> = this._store.pipe(
    select(selectSingleSelectedEntity),
  )
  private readonly _multiSelected$: Observable<TypeOfEntity[]> = this._store.pipe(
    select(selectMultiSelectedEntities),
  )
  private readonly _selectedStringId$: Observable<string | undefined> = this._store.pipe(
    select(selectSelectedId),
  )
  private readonly _nearbyPanelsOnAxis$: Observable<NearbyEntityOnAxis[]> = this._store.pipe(
    select(selectNearbyEntitiesOnAxis),
  )

  public get selectedStringId$() {
    return this._selectedStringId$
  }

  public get selectedStringId() {
    return firstValueFrom(this._selectedStringId$)
  }

  public get nearbyPanelsOnAxis$() {
    return this._nearbyPanelsOnAxis$
  }

  public get nearbyPanelsOnAxis() {
    return firstValueFrom(this._nearbyPanelsOnAxis$)
  }

  public get singleSelected$() {
    return this._singleSelected$
  }

  public get singleSelected() {
    return firstValueFrom(this._singleSelected$)
  }

  public get multiSelected$() {
    return this._multiSelected$
  }

  public get multiSelected() {
    return firstValueFrom(this._multiSelected$)
  }

  public selectedPanelState$(id: string): Observable<SelectedPanelState> {
    return this._store.pipe(select(selectSelectedPanelState({ id })))
  }

  public multiSelectedEntitiesByType$(type: DesignEntityType): Observable<TypeOfEntity[]> {
    return this._store.pipe(select(selectMultiSelectedEntitiesOfType(type)))
  }

  public multiSelectedEntitiesByType(type: DesignEntityType) {
    return firstValueFrom(this.multiSelectedEntitiesByType$(type))
  }
}

