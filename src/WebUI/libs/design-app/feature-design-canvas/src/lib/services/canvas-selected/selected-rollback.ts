import { XStateSelectedEvent } from '../canvas-client-state'
import { SelectedStateSnapshot } from '../canvas-client-state/+xstate/selected-state.machine'

export const handleSelectedStateRollback = (
	snapshot: SelectedStateSnapshot,
): XStateSelectedEvent | undefined => {
	/*	if (snapshot.matches('StringSelectedState.StringSelected')) {
	 const history = snapshot.context.selectedHistoryState
	 if (history.length <= 1) {
	 console.log('history', history)
	 return undefined
	 }
	 const rollback = history[history.length - 2]
	 console.log('rollback', rollback)
	 switch (rollback) {
	 case 'EntitySelected':
	 return { type: 'SelectedStringRollbackToSingle' }
	 case 'MultipleEntitiesSelected':
	 return { type: 'SelectedStringRollbackToMultiple' }
	 default:
	 throw new Error('unhandled')
	 }
	 }
	 if (snapshot.matches('SelectedState.MultipleEntitiesSelected')) {
	 return { type: 'CancelSelected' }
	 }
	 if (snapshot.matches('SelectedState.EntitySelected')) {
	 return { type: 'ClearEntitySelected' }
	 }*/
	return undefined
}