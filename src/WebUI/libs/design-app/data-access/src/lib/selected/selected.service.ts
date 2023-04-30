import { AppStoreService } from '../app'
import { EntityStoreService } from '../entities'
import { SelectedSnapshot } from './selected-state.types'
import { inject, Injectable } from '@angular/core'
import { CanvasEntity } from '@design-app/shared'
import { assertNotNull } from '@shared/utils'


@Injectable({
	providedIn: 'root',
})
export class SelectedService {
	// private _entities = inject(EntityStoreService)
	private _entities = inject(EntityStoreService)
	private _app = inject(AppStoreService)

	handleEntityUnderMouse(event: MouseEvent, entityUnderMouse: CanvasEntity) {
		if (event.shiftKey) {
			this.addToMultiSelected(entityUnderMouse.id)
			return
		}
		this.setSelected(entityUnderMouse.id)
		return
	}

	setSelected(selectedId: string) {
		// const ev = SELECTED_EVENT_V2('SetMultipleSelectedEntities', { ids: [selectedId] })
		// this._app.sendEvent(SELECTED_EVENT('SetMultipleSelectedEntities', { ids: [selectedId] }))
		this._app.sendSelectedEvent({
			type: 'SetMultipleSelectedEntities',
			payload: { ids: [selectedId] },
		})
		// this._app.sendEvent({ type: 'SetMultipleSelectedEntities', payload: { ids: [selectedId] } })
		// this._app.sendEvent({ type: 'SelectedSingleEntity', payload: { id: selectedId } })
		// this._app.sendEvent(new SelectedSingleEntity({ id: selectedId }))
		console.log('set selected', selectedId)
	}

	addToMultiSelected(selectedId: string) {
		/*		const singleSelectedId = this._app.selectedCtx.singleSelectedId
		 // const singleSelectedId = this._app.appCtx.selected.singleSelectedId
		 if (singleSelectedId && singleSelectedId === selectedId) {
		 this._app.sendEvent({ type: 'ClearEntitySelected' })
		 // this._app.sendEvent(new ClearEntitySelected())
		 return
		 }*/

		const multipleSelectedIds = this._app.selectedCtx.multipleSelectedIds
		// const multipleSelectedIds = this._app.appCtx.selected.multipleSelectedIds
		if (multipleSelectedIds.includes(selectedId)) {
			// this._app.sendEvent(
			// 	{
			this._app.sendSelectedEvent({
				type: 'RemoveEntitiesFromMultipleSelected',
				payload: { ids: [selectedId] },
			})
			/*			this._app.sendStateEvent(
			 STATE_MACHINE.SELECTED,
			 {
			 type: 'RemoveEntitiesFromMultipleSelected',
			 payload: { ids: [selectedId] },
			 } /!*				new AddEntitiesToMultipleSelected({
			 ids: multipleSelectedIds.filter((id) => id !== selectedId),
			 }),*!/,
			 )*/
			return
		}

		if (!selectedId) return

		const selectedEntity = this._entities.panels.getEntityById(selectedId)
		assertNotNull(selectedEntity, 'selected entity not found')
		// this._app.sendEvent(
		// 	{
		this._app.sendSelectedEvent({
			type: 'AddEntitiesToMultipleSelected',
			payload: { ids: [...multipleSelectedIds, selectedId] },
		})
		/*		this._app.sendStateEvent(
		 STATE_MACHINE.SELECTED,
		 {
		 type: 'AddEntitiesToMultipleSelected',
		 payload: { ids: [...multipleSelectedIds, selectedId] },
		 }, // new AddEntitiesToMultipleSelected({ ids: [...multipleSelectedIds, selectedId] }),
		 )*/
	}

	removeFromMultiSelected(selected: CanvasEntity) {
		// this._app.sendEvent({
		this._app.sendSelectedEvent({
			type: 'RemoveEntitiesFromMultipleSelected',
			payload: { ids: [selected.id] },
		})
		/*		this._app.sendStateEvent(STATE_MACHINE.SELECTED, {
		 type: 'RemoveEntitiesFromMultipleSelected',
		 payload: { ids: [selected.id] },
		 })*/
		// this._app.sendEvent(new RemoveEntitiesFromMultipleSelected({ ids: [selected.id] }))
	}

	checkSelectedState(event: MouseEvent, clickedOnEntityId: string) {
		/*		const singleSelectedId = this._app.appCtx.selected.singleSelectedId
		 if (!singleSelectedId || (singleSelectedId !== clickedOnEntityId && !event.shiftKey)) {
		 this.clearSingleSelected()
		 }*/
	}

	/*	clearSingleSelected() {
	 /!*if (this._app.appCtx.selected.singleSelectedId) {
	 this._app.sendStateEvent(STATE_MACHINE.SELECTED, {
	 type: 'ClearEntitySelected',
	 })
	 // this._app.sendEvent({ type: 'ClearEntitySelected' })
	 // this._app.sendEvent(new ClearEntitySelected())
	 }*!/
	 }*/

	handleNotClickedOnEntity(selectedSnapshot: SelectedSnapshot) {
		/*		if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
		 this.clearSelectedState()
		 return
		 }*/

		if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
			this._app.sendSelectedEvent({ type: 'ClearMultipleSelectedEntities' })
			return
		}
	}

	// clear

	clearSelectedState() {
		this._app.sendSelectedEvent({ type: 'ClearSelectedState' })
		// this._app.sendSelectedEvent({ type: 'ClearEntitySelected' })
		/*	this._app.sendStateEvent(STATE_MACHINE.SELECTED, {
		 type: 'ClearEntitySelected',
		 })*/
		// this._app.sendEvent({ type: 'ClearSelectedState' })
		// this._app.sendEvent(new CancelSelected())
	}

	clearSelectedInOrder() {
		const snapshot = this._app.appSnapshot
		console.log('clearSelectedInOrder, snapshot', snapshot)

		/*		const res = handleSelectedStateRollback(snapshot)
		 if (!res) return
		 this._app.sendEvent(res)*/
		// res ? this._app.sendEvent(res) : () => {}

		/*if (snapshot.matches('SelectedState.StringSelected')) {
		 const history = snapshot.context.selectedHistoryState
		 // snapshot.
		 console.log('history', history)
		 if (history.length <= 1) {
		 console.log('history', history)
		 return
		 }
		 console.log('history', history[history.length - 2])
		 if (history[history.length - 2] === 'EntitySelected') {
		 this._app.sendEvent({
		 type: 'SelectedStringRollbackToSingle',
		 })
		 return
		 }
		 if (history[history.length - 2] === 'MultipleEntitiesSelected') {
		 this._app.sendEvent({
		 type: 'SelectedStringRollbackToMultiple',
		 })
		 return
		 }
		 throw new Error('unhandled')
		 // if (history[history.length - 2] === 'SelectedState.SingleEntitySelected') {
		 /!*			this._app.sendEvent({
		 type: 'SelectedRollback',
		 })*!/
		 // return
		 }*/

		/*		if (snapshot.matches('SelectedState.StringSelected')) {
		 this._app.sendEvent({
		 type: 'ClearStringSelected',
		 })
		 return
		 }

		 if (snapshot.matches('SelectedState.MultipleEntitiesSelected')) {
		 this._app.sendEvent({
		 type: 'CancelSelected',
		 payload: null,
		 })
		 return
		 }

		 if (snapshot.matches('SelectedState.EntitySelected')) {
		 this._app.sendEvent({
		 type: 'ClearEntitySelected',
		 payload: null,
		 })
		 return
		 }*/
	}
}