import { CanvasEntity } from '../../types'
// import { CanvasEntitiesStore } from './canvas-entities'
import { CanvasAppStateStore } from '../canvas-app-state'
import { InjectClientState, MachineService, STATE_MACHINE } from '../canvas-client-state'
import { inject, Injectable } from '@angular/core'
import { assertNotNull } from '@shared/utils'

@Injectable({
	providedIn: 'root',
})
export class CanvasSelectedXstateService {
	private _entityStore = inject(CanvasAppStateStore)
	private _state = InjectClientState()
	private _machine = inject(MachineService)

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
		// this._machine.sendEvent(SELECTED_EVENT('SetMultipleSelectedEntities', { ids: [selectedId] }))
		this._machine.sendStateEvent(STATE_MACHINE.SELECTED, {
			type: 'SetMultipleSelectedEntities',
			payload: { ids: [selectedId] },
		})
		// this._machine.sendEvent({ type: 'SetMultipleSelectedEntities', payload: { ids: [selectedId] } })
		// this._machine.sendEvent({ type: 'SelectedSingleEntity', payload: { id: selectedId } })
		// this._machine.sendEvent(new SelectedSingleEntity({ id: selectedId }))
		console.log('set selected', selectedId)
	}

	addToMultiSelected(selectedId: string) {
		/*		const singleSelectedId = this._machine.selectedCtx.singleSelectedId
		 // const singleSelectedId = this._machine.appCtx.selected.singleSelectedId
		 if (singleSelectedId && singleSelectedId === selectedId) {
		 this._machine.sendEvent({ type: 'ClearEntitySelected' })
		 // this._machine.sendEvent(new ClearEntitySelected())
		 return
		 }*/

		const multipleSelectedIds = this._machine.selectedCtx.multipleSelectedIds
		// const multipleSelectedIds = this._machine.appCtx.selected.multipleSelectedIds
		if (multipleSelectedIds.includes(selectedId)) {
			// this._machine.sendEvent(
			// 	{
			this._machine.sendStateEvent(
				STATE_MACHINE.SELECTED,
				{
					type: 'RemoveEntitiesFromMultipleSelected',
					payload: { ids: [selectedId] },
				} /*				new AddEntitiesToMultipleSelected({
			 ids: multipleSelectedIds.filter((id) => id !== selectedId),
			 }),*/,
			)
			return
		}

		if (!selectedId) return

		const selectedEntity = this._state.entities.panels.getEntityById(selectedId)
		assertNotNull(selectedEntity, 'selected entity not found')
		// this._machine.sendEvent(
		// 	{
		this._machine.sendStateEvent(
			STATE_MACHINE.SELECTED,
			{
				type: 'AddEntitiesToMultipleSelected',
				payload: { ids: [...multipleSelectedIds, selectedId] },
			}, // new AddEntitiesToMultipleSelected({ ids: [...multipleSelectedIds, selectedId] }),
		)
	}

	removeFromMultiSelected(selected: CanvasEntity) {
		// this._machine.sendEvent({
		this._machine.sendStateEvent(STATE_MACHINE.SELECTED, {
			type: 'RemoveEntitiesFromMultipleSelected',
			payload: { ids: [selected.id] },
		})
		// this._machine.sendEvent(new RemoveEntitiesFromMultipleSelected({ ids: [selected.id] }))
	}

	checkSelectedState(event: MouseEvent, clickedOnEntityId: string) {
		/*		const singleSelectedId = this._machine.appCtx.selected.singleSelectedId
		 if (!singleSelectedId || (singleSelectedId !== clickedOnEntityId && !event.shiftKey)) {
		 this.clearSingleSelected()
		 }*/
	}

	clearSingleSelected() {
		/*if (this._machine.appCtx.selected.singleSelectedId) {
		 this._machine.sendStateEvent(STATE_MACHINE.SELECTED, {
		 type: 'ClearEntitySelected',
		 })
		 // this._machine.sendEvent({ type: 'ClearEntitySelected' })
		 // this._machine.sendEvent(new ClearEntitySelected())
		 }*/
	}

	clearSelectedState() {
		this._machine.sendStateEvent(STATE_MACHINE.SELECTED, {
			type: 'ClearEntitySelected',
		})
		// this._machine.sendEvent({ type: 'ClearSelectedState' })
		// this._machine.sendEvent(new CancelSelected())
	}

	clearSelectedInOrder() {
		const snapshot = this._machine.appSnapshot
		console.log('clearSelectedInOrder, snapshot', snapshot)

		/*		const res = handleSelectedStateRollback(snapshot)
		 if (!res) return
		 this._machine.sendEvent(res)*/
		// res ? this._machine.sendEvent(res) : () => {}

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
		 this._machine.sendEvent({
		 type: 'SelectedStringRollbackToSingle',
		 })
		 return
		 }
		 if (history[history.length - 2] === 'MultipleEntitiesSelected') {
		 this._machine.sendEvent({
		 type: 'SelectedStringRollbackToMultiple',
		 })
		 return
		 }
		 throw new Error('unhandled')
		 // if (history[history.length - 2] === 'SelectedState.SingleEntitySelected') {
		 /!*			this._machine.sendEvent({
		 type: 'SelectedRollback',
		 })*!/
		 // return
		 }*/

		/*		if (snapshot.matches('SelectedState.StringSelected')) {
		 this._machine.sendEvent({
		 type: 'ClearStringSelected',
		 })
		 return
		 }

		 if (snapshot.matches('SelectedState.MultipleEntitiesSelected')) {
		 this._machine.sendEvent({
		 type: 'CancelSelected',
		 payload: null,
		 })
		 return
		 }

		 if (snapshot.matches('SelectedState.EntitySelected')) {
		 this._machine.sendEvent({
		 type: 'ClearEntitySelected',
		 payload: null,
		 })
		 return
		 }*/
	}
}