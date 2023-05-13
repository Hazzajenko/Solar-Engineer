import { Typegen0 } from './selected-state.machine.typegen'

export type SelectedStateMatches = Typegen0['matchesStates']

export type SelectedStateMatchesModel = {
	EntitySelectedState?: 'EntitiesSelected' | 'NoneSelected'
	StringSelectedState?: 'NoneSelected' | 'StringSelected'
}