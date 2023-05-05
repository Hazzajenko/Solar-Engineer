import { AppStateQueries } from './app-state.queries'
import { AppState } from './app-state.reducer'
import { AppStateRepository } from './app-state.repository'
import { inject, Injectable } from '@angular/core'


@Injectable({
	providedIn: 'root',
})
export class AppNgrxStateStore {
	public select = inject(AppStateQueries)
	public dispatch = inject(AppStateRepository)

	private get state() {
		return this.select.state
	}

	get matches() {
		let res = {}
		for (const key in this.state) {
			const k = key as keyof AppState
			res = {
				...res,
				[key]: (value: AppState[typeof k]) => this.state[k] === value,
			}
		}
		return res as {
			[key in keyof AppState]: (value: AppState[key]) => boolean
		}
	}

	/*	get snapshot() {
	 return {
	 ...this.state(),
	 matches: this.matches,
	 }
	 }*/

	/*	get snapshotV2() {
	 return new AppNgrxSnapshot(this)
	 }*/

	get snapshot() {
		return {
			state: this.state,
			matches: this.matches,
		}
	}
}

// export type AppNgrxSnapshot = ReturnType<AppNgrxStateStore['snapshot']>
// type AppNgrxSnapshotMatches = ReturnType<AppNgrxStateStore['matches']>

export type AppNgrxSnapshot = {
	state: AppState
	matches: AppNgrxMatches
}

type AppNgrxMatches = {
	[key in keyof AppState]: (value: AppState[key]) => boolean
}

// type test = AppNgrxStateStore['snapshot']

/*
 class AppNgrxSnapshot {
 constructor(private readonly _store: AppNgrxStateStore) {}

 get state() {
 return this._store.snapshot
 }

 get matches() {
 return this._store.matches
 }
 }*/