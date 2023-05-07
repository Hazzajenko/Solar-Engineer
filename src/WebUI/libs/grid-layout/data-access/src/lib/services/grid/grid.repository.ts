import { ClientXY } from '../..'
import { GridActions, GridSelectedActions, LinksActions, MultiActions } from '../../store'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BlockType, GridMode } from '@shared/data-access/models'


@Injectable({
	providedIn: 'root',
})
export class GridRepository {
	private readonly store = inject(Store)

	changeCreateType(createType: BlockType) {
		this.store.dispatch(GridActions.changeCreateType({ createType }))
	}

	selectGridMode(gridMode: GridMode) {
		switch (gridMode) {
			case GridMode.CREATE:
				return this.store.dispatch(GridActions.selectGridModeCreate())
			case GridMode.LINK:
				return this.store.dispatch(GridActions.selectGridModeLink())
			case GridMode.SELECT:
				return this.store.dispatch(GridActions.selectGridModeSelect())
			case GridMode.DELETE:
				return this.store.dispatch(GridActions.selectGridModeDelete())
			default:
				return undefined
		}
	}

	selectCreateMode() {
		this.store.dispatch(GridActions.selectGridModeCreate())
	}

	selectSelectMode() {
		this.store.dispatch(GridActions.selectGridModeSelect())
	}

	selectLinkMode() {
		this.store.dispatch(GridActions.selectGridModeLink())
	}

	selectDeleteMode() {
		this.store.dispatch(GridActions.selectGridModeDelete())
	}

	updateClientXY(clientXY: ClientXY) {
		this.store.dispatch(GridActions.setClientXY({ clientXY }))
	}

	clearEntireGridState() {
		this.store.dispatch(LinksActions.clearLinksState())
		this.store.dispatch(GridSelectedActions.clearSelectedState())
		this.store.dispatch(MultiActions.clearMultiState())
		this.store.dispatch(GridActions.selectGridModeSelect())
	}
}