import { PanelLinksActions } from './panel-links.actions'
import { initialPanelLinksState, PanelLinksState } from './panel-links.reducer'
import { selectAllPanelLinks, selectPanelLinksState } from './panel-links.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { UpdateStr } from '@ngrx/entity/src/models'
import { select, Store } from '@ngrx/store'
import { isNotNull } from '@shared/utils'
import { PanelLinkModel, PanelLinkRequest, Polarity } from './panel-link'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksStoreService {
	private readonly _store = inject(Store<PanelLinksState>)
	private readonly _state$ = this._store.pipe(select(selectPanelLinksState))
	private readonly _state = toSignal(this._state$, {
		initialValue: initialPanelLinksState,
	})
	private _allPanelLinks$ = this._store.select(selectAllPanelLinks)
	readonly dispatch = new PanelLinksRepository(this._store)
	panelLinkSignals = this._store.selectSignal(selectPanelLinksState)

	get state() {
		return this._state()
	}

	get ids() {
		return this.state.ids
	}

	get entities() {
		return this.state.entities
	}

	get allPanelLinks$() {
		return this._allPanelLinks$
	}

	get allPanelLinks() {
		return this.state.ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	get requestingLink() {
		return this.state.requestingLink
	}

	getById(id: string) {
		return this.entities[id]
	}

	getByIds(ids: string[]) {
		return ids.map((id) => this.entities[id]).filter(isNotNull)
	}

	getByStringId(stringId: string) {
		return this.allPanelLinks.filter((panelLink) => panelLink.stringId === stringId)
		// return this.panelLinksByStringId()[stringId] ?? []
	}

	isPanelLinkExisting(panelId: string, polarity: Polarity) {
		// return this._store.selectSignal(selectIsPanelLinkExisting({ panelId, polarity }))
		return !!this.allPanelLinks.find(
			(panelLink) =>
				(panelLink.positivePanelId === panelId && polarity === 'positive') ||
				(panelLink.negativePanelId === panelId && polarity === 'negative'),
		)
	}
}

class PanelLinksRepository {
	constructor(private readonly _store: Store<PanelLinksState>) {}

	startPanelLink(panelLinkRequest: PanelLinkRequest) {
		this._store.dispatch(PanelLinksActions.startPanelLink({ panelLinkRequest }))
	}

	endPanelLink() {
		this._store.dispatch(PanelLinksActions.endPanelLink())
	}

	addPanelLink(freePanelLink: PanelLinkModel) {
		this._store.dispatch(PanelLinksActions.addPanelLink({ panelLink: freePanelLink }))
	}

	addManyPanelLinks(panelLinks: PanelLinkModel[]) {
		this._store.dispatch(PanelLinksActions.addManyPanelLinks({ panelLinks }))
	}

	updatePanelLink(update: UpdateStr<PanelLinkModel>) {
		this._store.dispatch(PanelLinksActions.updatePanelLink({ update }))
	}

	updateManyPanelLinks(updates: UpdateStr<PanelLinkModel>[]) {
		this._store.dispatch(PanelLinksActions.updateManyPanelLinks({ updates }))
	}

	deletePanelLink(id: string) {
		this._store.dispatch(PanelLinksActions.deletePanelLink({ panelLinkId: id }))
	}

	deleteManyPanelLinks(ids: string[]) {
		this._store.dispatch(PanelLinksActions.deleteManyPanelLinks({ panelLinkIds: ids }))
	}

	clearPanelLinksState() {
		this._store.dispatch(PanelLinksActions.clearPanelLinksState())
	}
}
