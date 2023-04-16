import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasEntitiesActions } from '../../store'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CanvasEntity } from '@design-app/feature-design-canvas'

@Injectable({
  providedIn: 'root',
})
export class CanvasEntitiesRepository {
  private _store = inject(Store)

  public addCanvasEntity(entity: CanvasEntity) {
    this._store.dispatch(CanvasEntitiesActions.addEntity({ entity }))
  }

  public addManyCanvasEntities(entities: CanvasEntity[]) {
    this._store.dispatch(CanvasEntitiesActions.addManyEntities({ entities }))
  }

  public updateCanvasEntity(update: UpdateStr<CanvasEntity>) {
    this._store.dispatch(CanvasEntitiesActions.updateEntity({ update }))
  }

  /*  public setCanvasEntityRotation(entityId: string, angle: number) {
   this._store.dispatch(CanvasEntitiesActions.setEntityRotation({ entityId, angle }))
   }

   public rotateCanvasEntity(entityId: string, rotateBy: number) {
   this._store.dispatch(CanvasEntitiesActions.rotateEntity({ entityId, rotateBy }))
   }*/

  public updateManyCanvasEntities(updates: UpdateStr<CanvasEntity>[]) {
    this._store.dispatch(CanvasEntitiesActions.updateManyEntities({ updates }))
  }

  public deleteCanvasEntity(entityId: string) {
    this._store.dispatch(CanvasEntitiesActions.deleteEntity({ entityId }))
  }

  public deleteManyCanvasEntities(entityIds: string[]) {
    this._store.dispatch(CanvasEntitiesActions.deleteManyEntities({ entityIds }))
  }
}
