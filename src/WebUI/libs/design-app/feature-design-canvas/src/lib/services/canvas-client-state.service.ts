import { Injectable } from '@angular/core'
import { EntityLocation, EntityRotation } from '../types'

export type CanvasClientState = {
  hoveringEntityId: string | undefined
  selectedStringId: string | undefined
  singleSelectedId: string | undefined
  multiSelectedIds: string[]
  singleToRotateEntity: EntityRotation | undefined
  multiToRotateEntities: EntityLocation[]
  singleToMoveEntity: EntityLocation | undefined
  multiToMoveEntities: EntityLocation[]
}

@Injectable({
  providedIn: 'root',
})
export class CanvasClientStateService
  implements CanvasClientState {
  private _hoveringEntityId: string | undefined = undefined
  private _selectedStringId: string | undefined = undefined
  private _singleSelectedId: string | undefined = undefined
  private _multiSelectedIds: string[] = []
  private _singleToRotateEntity: EntityRotation | undefined = undefined
  private _multiToRotateEntities: EntityLocation[] = []
  private _singleToMoveEntity: EntityLocation | undefined = undefined
  private _multiToMoveEntities: EntityLocation[] = []

  get state(): CanvasClientState {
    return {
      hoveringEntityId:      this.hoveringEntityId,
      selectedStringId:      this.selectedStringId,
      singleSelectedId:      this.singleSelectedId,
      multiSelectedIds:      this.multiSelectedIds,
      singleToRotateEntity:  this.singleToRotateEntity,
      multiToRotateEntities: this.multiToRotateEntities,
      singleToMoveEntity:    this.singleToMoveEntity,
      multiToMoveEntities:   this.multiToMoveEntities,
    }
  }

  set state(value: CanvasClientState) {
    this.hoveringEntityId = value.hoveringEntityId
    this.selectedStringId = value.selectedStringId
    this.singleSelectedId = value.singleSelectedId
    this.multiSelectedIds = value.multiSelectedIds
    this.singleToRotateEntity = value.singleToRotateEntity
    this.multiToRotateEntities = value.multiToRotateEntities
    this.singleToMoveEntity = value.singleToMoveEntity
    this.multiToMoveEntities = value.multiToMoveEntities

  }

  updateState(value: Partial<CanvasClientState>) {
    this.hoveringEntityId = value.hoveringEntityId ?? this.hoveringEntityId
    this.selectedStringId = value.selectedStringId ?? this.selectedStringId
    this.singleSelectedId = value.singleSelectedId ?? this.singleSelectedId
    this.multiSelectedIds = value.multiSelectedIds ?? this.multiSelectedIds
    this.singleToRotateEntity = value.singleToRotateEntity ?? this.singleToRotateEntity
    this.multiToRotateEntities = value.multiToRotateEntities ?? this.multiToRotateEntities
    this.singleToMoveEntity = value.singleToMoveEntity ?? this.singleToMoveEntity
    this.multiToMoveEntities = value.multiToMoveEntities ?? this.multiToMoveEntities
    console.log('CanvasClientStateService.partialState', this.state)
  }

  get hoveringEntityId(): string | undefined {
    return this._hoveringEntityId
  }

  set hoveringEntityId(value: string | undefined) {
    this._hoveringEntityId = value
  }

  get selectedStringId(): string | undefined {
    return this._selectedStringId
  }

  set selectedStringId(value: string | undefined) {
    this._selectedStringId = value
  }

  get singleSelectedId(): string | undefined {
    return this._singleSelectedId
  }

  set singleSelectedId(value: string | undefined) {
    this._singleSelectedId = value
  }

  get multiSelectedIds(): string[] {
    return this._multiSelectedIds
  }

  set multiSelectedIds(value: string[]) {
    this._multiSelectedIds = value
  }

  get singleToRotateEntity(): EntityRotation | undefined {
    return this._singleToRotateEntity
  }

  set singleToRotateEntity(value: EntityRotation | undefined) {
    this._singleToRotateEntity = value
  }

  get multiToRotateEntities(): EntityLocation[] {
    return this._multiToRotateEntities
  }

  set multiToRotateEntities(value: EntityLocation[]) {
    this._multiToRotateEntities = value
  }

  get singleToMoveEntity(): EntityLocation | undefined {
    return this._singleToMoveEntity
  }

  set singleToMoveEntity(value: EntityLocation | undefined) {
    this._singleToMoveEntity = value
  }

  get multiToMoveEntities(): EntityLocation[] {
    return this._multiToMoveEntities

  }

  set multiToMoveEntities(value: EntityLocation[]) {
    this._multiToMoveEntities = value
  }

}
