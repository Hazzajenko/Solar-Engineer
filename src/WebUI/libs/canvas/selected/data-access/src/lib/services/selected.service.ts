import { AppStateStoreService } from '@canvas/app/data-access'
import { ENTITY_SELECTED_STATE, SelectedStoreService } from '../store'
import { inject, Injectable } from '@angular/core'
import { assertNotNull } from '@shared/utils'
import { EntityStoreService } from '@entities/data-access'
import { CanvasEntity } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class SelectedService {
	// private _entities = inject(EntityStoreService)
	private _entities = inject(EntityStoreService)
	// private _app = inject(AppStoreService)
	private _appStore = inject(AppStateStoreService)
	private _selectedStore = inject(SelectedStoreService)

	// private _appState = inject(AppSt)

	handleEntityUnderMouse(event: MouseEvent, entityUnderMouse: CanvasEntity) {
		if (event.shiftKey) {
			this.addToMultiSelected(entityUnderMouse.id)
			return
		}
		this.setSelected(entityUnderMouse.id)
		// this._selectedStore.fetchByKey('selectedStringId')
		// const yo = this._selectedStore.fetchByKeys(['selectedStringId', 'multipleSelectedEntityIds'])
		// // yo
		/*	const yo = this._selectedStore.fetchByKeysAsObject(['selectedStringId', 'multipleSelectedEntityIds'])
		 yo*/
		return
	}

	setSelected(selectedId: string) {
		// const ev = SELECTED_EVENT_V2('SetMultipleSelectedEntities', { ids: [selectedId] })
		// this._app.sendEvent(SELECTED_EVENT('SetMultipleSelectedEntities', payload: { ids: [selectedId] }))
		/*		this._app.sendSelectedEvent({
		 type: 'SetMultipleSelectedEntities',
		 payload: { ids: [selectedId] },
		 })*/
		const currentSelected = this._appStore.state
		console.log('currentSelected', currentSelected)
		this._selectedStore.dispatch.selectEntity(selectedId)
		// this._appStore.dispatch.setSelectedState(SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED)
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

		const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
		// const multipleSelectedIds = this._app.selectedCtx.multipleSelectedIds
		// const multipleSelectedIds = this._app.appCtx.selected.multipleSelectedIds
		if (multipleSelectedIds.includes(selectedId)) {
			this._selectedStore.dispatch.removeEntitiesFromMultiSelect([selectedId])
			// this._app.sendEvent(
			// 	{
			/*			this._app.sendSelectedEvent({
			 type: 'RemoveEntitiesFromMultipleSelected',
			 payload: { ids: [selectedId] },
			 })*/

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

		const selectedEntity = this._entities.panels.getById(selectedId)
		assertNotNull(selectedEntity, 'selected entity not found')
		// this._app.sendEvent(
		// 	{
		/*		this._app.sendSelectedEvent({
		 type: 'AddEntitiesToMultipleSelected',
		 payload: { ids: [...multipleSelectedIds, selectedId] },
		 })*/
		this._selectedStore.dispatch.addEntitiesToMultiSelect([...multipleSelectedIds, selectedId])
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
		/*		this._app.sendSelectedEvent({
		 type: 'RemoveEntitiesFromMultipleSelected',
		 payload: { ids: [selected.id] },
		 })*/
		/*		this._app.sendStateEvent(STATE_MACHINE.SELECTED, {
		 type: 'RemoveEntitiesFromMultipleSelected',
		 payload: { ids: [selected.id] },
		 })*/
		// this._app.sendEvent(new RemoveEntitiesFromMultipleSelected({ ids: [selected.id] }))
	}

	/*
	 checkSelectedState(event: MouseEvent, clickedOnEntityId: string) {
	 /!*		const singleSelectedId = this._app.appCtx.selected.singleSelectedId
	 if (!singleSelectedId || (singleSelectedId !== clickedOnEntityId && !event.shiftKey)) {
	 this.clearSingleSelected()
	 }*!/
	 }
	 */

	handleNotClickedOnEntity() {
		/*		if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
		 this.clearSelectedState()
		 return
		 }*/

		const entitySelectedState = this._selectedStore.state.entityState
		if (entitySelectedState === ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED) {
			this._selectedStore.dispatch.clearMultiSelected()
			return
		}

		if (entitySelectedState === ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED) {
			this._selectedStore.dispatch.clearSingleSelected()
			return
		}
		/*
		 if (selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')) {
		 // this._app.sendSelectedEvent({ type: 'ClearMultipleSelectedEntities' })
		 this._selectedStore.dispatch.clearMultiSelected()
		 return
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

	// clear

	clearSelectedState() {
		this._selectedStore.dispatch.clearSelectedState()
		// this._app.sendSelectedEvent({ type: 'ClearSelectedState' })
		// this._app.sendSelectedEvent({ type: 'ClearEntitySelected' })
		/*	this._app.sendStateEvent(STATE_MACHINE.SELECTED, {
		 type: 'ClearEntitySelected',
		 })*/
		// this._app.sendEvent({ type: 'ClearSelectedState' })
		// this._app.sendEvent(new CancelSelected())
	}

	clearSingleOrMultipleSelected() {
		this._selectedStore.dispatch.clearSingleSelected()
		this._selectedStore.dispatch.clearMultiSelected()
	}

	clearSelectedInOrder() {
		/*		const appSnapshot = this._app.appSnapshot
		 const selectedSnapshot = this._app.selectedSnapshot
		 if (selectedSnapshot.matches('StringSelectedState.StringSelected')) {
		 this._app.sendSelectedEvent({ type: 'ClearStringSelected' })
		 }*/

		if (this._selectedStore.state.selectedStringId) {
			this._selectedStore.dispatch.clearSelectedString()
			return
		}

		if (
			this._selectedStore.state.entityState === ENTITY_SELECTED_STATE.MULTIPLE_ENTITIES_SELECTED
		) {
			this._selectedStore.dispatch.clearMultiSelected()
			return
		}

		if (this._selectedStore.state.entityState === ENTITY_SELECTED_STATE.SINGLE_ENTITY_SELECTED) {
			this._selectedStore.dispatch.clearSingleSelected()
			return
		}

		// console.log('clearSelectedInOrder, snapshot', appSnapshot)

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
