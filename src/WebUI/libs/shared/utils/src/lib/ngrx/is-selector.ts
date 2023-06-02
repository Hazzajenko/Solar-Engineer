import { MemoizedSelector } from '@ngrx/store'

export const isMemoizedSelector = <State, Result, ProjectorFn>(
	selector: unknown,
): selector is MemoizedSelector<State, Result, ProjectorFn> => {
	return typeof selector === 'function' && Object.prototype.hasOwnProperty.call(selector, 'release')
}

export const assertIsMemoizedSelector = <State, Result, ProjectorFn>(
	selector: unknown,
): asserts selector is MemoizedSelector<State, Result, ProjectorFn> => {
	if (!isMemoizedSelector(selector)) {
		throw new Error(`Expected selector to be MemoizedSelector, but got ${typeof selector}`)
	}
}
