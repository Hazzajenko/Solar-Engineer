import { AppStateSnapshot, XStateSelectedEvent } from '../canvas-client-state'

export const handleSelectedStateRollback = (
	snapshot: AppStateSnapshot,
): XStateSelectedEvent | undefined => {
	if (snapshot.matches('SelectedState.StringSelected')) {
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
	}
	return undefined
}