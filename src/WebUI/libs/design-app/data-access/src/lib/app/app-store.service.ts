import { GraphicsStateEvent, graphicsStateMachine, GraphicsStateMatchesModel } from '../graphics'
import { SelectedStateEvent, selectedStateMachine, SelectedStateMatchesModel } from '../selected'
import { ContextMenuState } from '../view'
import { appStateMachine } from './app-state.machine'
import { AppStateEvent, AppStateMatches, AppStateMatchesModel } from './app-state.types'
import { Injectable } from '@angular/core'
import { xstateLogger } from '@design-app/utils'
import { BehaviorSubject } from 'rxjs'
import { interpret } from 'xstate'


const appInterpreter = interpret(appStateMachine, { devTools: true }).onTransition((state) => {
	xstateLogger(state)
})

const selectedInterpreter = interpret(selectedStateMachine, {
	devTools: true,
}).onTransition((state) => {
	xstateLogger(state)
})

const graphicsInterpreter = interpret(graphicsStateMachine, {
	devTools: true,
}).onTransition((state) => {
	xstateLogger(state)
})

@Injectable({
	providedIn: 'root',
})
export class AppStoreService {
	private _appInterpreter = appInterpreter.onTransition((state) => {
		if (state.event.type === 'OpenContextMenu') {
			this._contextMenu$.next(state.event.payload)
		}
		if (state.event.type === 'CloseContextMenu') {
			this._contextMenu$.next(undefined)
		}
		this._appState$.next(state.value as AppStateMatchesModel)
	})
	private _selectedInterpreter = selectedInterpreter.onTransition((state) => {
		this._selectedState$.next(state.value as SelectedStateMatchesModel)
	})
	private _graphicsInterpreter = graphicsInterpreter.onTransition((state) => {
		this._graphicsState$.next(state.value as GraphicsStateMatchesModel)
	})
	private _appState$ = new BehaviorSubject<AppStateMatchesModel>(
		this.appSnapshot.value as AppStateMatchesModel,
	)
	private _selectedState$ = new BehaviorSubject<SelectedStateMatchesModel>(
		this.selectedSnapshot.value as SelectedStateMatchesModel,
	)
	private _graphicsState$ = new BehaviorSubject<GraphicsStateMatchesModel>(
		this.graphicsSnapshot.value as GraphicsStateMatchesModel,
	)
	private _contextMenu$ = new BehaviorSubject<ContextMenuState | undefined>(
		this.appSnapshot.context.view.contextMenu,
	)

	constructor() {
		this._appInterpreter.start()
		this._selectedInterpreter.start()
		this._graphicsInterpreter.start()
	}

	get appCtx() {
		return this._appInterpreter.getSnapshot().context
	}

	get selectedCtx() {
		return this._selectedInterpreter.getSnapshot().context
	}

	get graphicsCtx() {
		return this._graphicsInterpreter.getSnapshot().context
	}

	get allCtx() {
		return {
			appCtx: this.appCtx,
			selectedCtx: this.selectedCtx,
			graphicsCtx: this.graphicsCtx,
		}
	}

	get appSnapshot() {
		return this._appInterpreter.getSnapshot()
	}

	get selectedSnapshot() {
		return this._selectedInterpreter.getSnapshot()
	}

	get graphicsSnapshot() {
		return this._graphicsInterpreter.getSnapshot()
	}

	get allSnapshots() {
		return {
			appSnapshot: this.appSnapshot,
			selectedSnapshot: this.selectedSnapshot,
			graphicsSnapshot: this.graphicsSnapshot,
		}
	}

	get state() {
		return this.appSnapshot.value as AppStateMatchesModel
	}

	sendEvent(event: AppStateEvent) {
		return this._appInterpreter.send(event)
	}

	sendSelectedEvent(event: SelectedStateEvent) {
		return this._selectedInterpreter.send(event)
	}

	sendGraphicsEvent(event: GraphicsStateEvent) {
		return this._graphicsInterpreter.send(event)
	}

	subscribeApp$() {
		return this._appState$.asObservable()
	}

	subscribeSelected$() {
		return this._selectedState$.asObservable()
	}

	subscribeContextMenu$() {
		return this._contextMenu$.asObservable()
	}

	subscribeGraphics$() {
		return this._graphicsState$.asObservable()
	}

	matches(matches: AppStateMatches) {
		return this.appSnapshot.matches(matches)
	}
}