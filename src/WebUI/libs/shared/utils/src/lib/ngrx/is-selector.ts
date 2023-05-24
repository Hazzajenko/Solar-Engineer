import { MemoizedSelector } from '@ngrx/store'

export const isMemoizedSelector = <State, Result, ProjectorFn>(
	selector: unknown,
): selector is MemoizedSelector<State, Result, ProjectorFn> => {
	return typeof selector === 'function' && Object.prototype.hasOwnProperty.call(selector, 'release')
}
