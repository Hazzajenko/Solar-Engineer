import { getNewStateFromTwoObjects } from '@shared/utils'

export const xstateLogger = (state: any) => {
	const currentState = state.value
	const historyState = state.history?.historyValue?.current
	const stateDifference = historyState
		? getNewStateFromTwoObjects(historyState, currentState)
		: null
	if (stateDifference && Object.keys(stateDifference).length > 0) {
		console.log('%c event', 'color: #03A9F4; font-weight: bold;', stateDifference)
		return
	}
	console.log('%c event', 'color: #03A9F4; font-weight: bold;', state.event)
}