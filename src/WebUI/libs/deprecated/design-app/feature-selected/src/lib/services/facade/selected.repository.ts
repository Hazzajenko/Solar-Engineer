import { SelectedActions } from '../../store'
import { TypeOfEntity } from '../../types'
import { NearbyEntityOnAxis } from '../../types/nearby-entity-on-axis'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Point } from '@shared/data-access/models'

@Injectable({
	providedIn: 'root',
})
export class SelectedRepository {
	private readonly _store = inject(Store)

	public addNearbyEntityOnAxis(entity: NearbyEntityOnAxis) {
		this._store.dispatch(SelectedActions.addNearbyEntityOnAxis({ entity }))
	}

	/*  public addNearbyPanelsOnAxis(panels: TypeOfEntity[]) {
   this._store.dispatch(SelectedActions.addNearbyPanelsOnAxis({ panels }))
   }*/

	public clearNearbyEntitiesOnAxis() {
		this._store.dispatch(SelectedActions.clearNearbyEntitiesOnAxis())
	}

	public startMultiSelectionBox(point: Point) {
		this._store.dispatch(SelectedActions.startMultiSelectionBox({ point }))
	}

	public stopMultiSelectedBox(entities: TypeOfEntity[]) {
		this._store.dispatch(SelectedActions.stopMultiSelectionBox({ entities }))
	}

	public selectString(stringId: string) {
		this._store.dispatch(SelectedActions.selectString({ stringId }))
	}

	public selectEntity(entity: TypeOfEntity) {
		this._store.dispatch(SelectedActions.selectEntity({ entity }))
	}

	public selectEntities(entities: TypeOfEntity[]) {
		this._store.dispatch(SelectedActions.selectMultipleEntities({ entities }))
	}

	public deselectEntity() {
		this._store.dispatch(SelectedActions.clearSingleSelected())
	}

	public deselectAllEntities() {
		this._store.dispatch(SelectedActions.clearMultiSelected())
	}

	public startMultiSelect(entity: TypeOfEntity) {
		this._store.dispatch(SelectedActions.startMultiselect({ entity }))
	}

	public addEntityToMultiSelect(entity: TypeOfEntity) {
		this._store.dispatch(SelectedActions.addEntityToMultiselect({ entity }))
	}

	/*  public removeEntityFromMultiSelect(entity: TypeOfEntity) {
   this._store.dispatch(SelectedActions.removeEntityFromMultiselect({ entity }))
   }*/

	public clearMultiSelect() {
		this._store.dispatch(SelectedActions.clearMultiSelected())
	}

	/*  public deselectEntityById(id: string) {
   // this._store.dispatch(SelectedActions.deselectEntityById({ id }))
   }*/

	public clearSelectedState() {
		this._store.dispatch(SelectedActions.clearSelectedState())
	}
}
