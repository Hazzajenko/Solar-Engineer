import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { firstValueFrom, Observable, tap } from 'rxjs'
import { Dictionary } from '@ngrx/entity'
import { CanvasEntity, selectAllCanvasEntities, selectCanvasEntitiesByIdArray, selectCanvasEntitiesViaDictionary, selectCanvasEntityById } from '@design-app/feature-design-canvas'
import { throwExpression } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class CanvasEntitiesQueries {
  private readonly _store = inject(Store)
  private readonly _entityDictionary$: Observable<Dictionary<CanvasEntity>> = this._store.pipe(select(selectCanvasEntitiesViaDictionary))
  private readonly _entities$: Observable<CanvasEntity[]> = this._store.pipe(select((selectAllCanvasEntities)))
  private readonly _entityDictionary: Dictionary<CanvasEntity> = {}
  private _entities: CanvasEntity[] = []

  public get entityDictionary$() {
    return this._entityDictionary$
  }

  public get entities$() {
    return this._entities$.pipe(
      tap((entities) => {
          this._entities = entities
        },
      ))
  }

  public get entities() {
    return this._entities
  }

  public entityById$(id: string) {
    return this._store.pipe(select(selectCanvasEntityById({ id })))
  }

  public entityById(id: string) {
    return this._entities.find((entity) => entity.id === id)
           ?? throwExpression(`Entity with id ${id} not found in CanvasEntitiesQueries.entityById(id: string)`)
    // return firstValueFrom(this.entityById$(id))
  }

  public canvasEntitiesByIdArray$(ids: string[]) {
    return this._store.pipe(select(selectCanvasEntitiesByIdArray({ ids })))
  }

  public canvasEntitiesByIdArray(ids: string[]) {
    return firstValueFrom(this._store.pipe(select(selectCanvasEntitiesByIdArray({ ids }))))
  }
}
