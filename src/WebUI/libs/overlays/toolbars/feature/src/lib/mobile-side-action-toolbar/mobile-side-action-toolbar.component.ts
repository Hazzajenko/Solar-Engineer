import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { goTop } from '@shared/animations'
import { InputSvgComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { MobileBottomToolbarDirective } from '../mobile-bottom-toolbar/mobile-bottom-toolbar.directive'
import { NgClass, NgIf } from '@angular/common'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { assertNotNull } from '@shared/utils'
import { EntityFactoryService, injectEntityStore } from '@entities/data-access'
import { injectAppStateStore, MODE_STATE } from '@canvas/app/data-access'
import { injectAppUser } from '@auth/data-access'
import { createStringWithPanels } from '@entities/utils'
import { ActionButtonDirective } from './action-button.directive'

@Component({
	selector: 'overlay-mobile-side-action-toolbar',
	standalone: true,
	imports: [
		InputSvgComponent,
		LetDirective,
		MobileBottomToolbarDirective,
		NgIf,
		NgClass,
		ActionButtonDirective,
	],
	templateUrl: './mobile-side-action-toolbar.component.html',
	styles: [],
	animations: [goTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSideActionToolbarComponent {
	private _selectedStore = injectSelectedStore()
	private _entityStore = injectEntityStore()
	private _appStore = injectAppStateStore()
	private _entityFactory = inject(EntityFactoryService)
	user = injectAppUser()
	selectedState = this._selectedStore.select.selectedState
	mode = this._appStore.select.mode
	stringIsSelected = computed(() => {
		return !!this._selectedStore.select.selectedStringId()
	})
	isInLinkMode = computed(() => {
		return this._appStore.select.mode() === MODE_STATE.LINK_MODE
	})

	isInSelectedState = computed(() => {
		const selectedState = this.selectedState()
		return (
			!!selectedState.selectedStringId ||
			!!selectedState.singleSelectedPanelId ||
			selectedState.multipleSelectedPanelIds.length > 0
		)
	})

	panelOrPanelsOfSameStringIsSelectedWithoutStringSelected = computed(() => {
		const selectedState = this.selectedState()
		const singleSelectedPanelId = selectedState.singleSelectedPanelId
		const multipleSelectedPanelIds = selectedState.multipleSelectedPanelIds

		if (!singleSelectedPanelId && multipleSelectedPanelIds.length < 1) return false
		let selectedPanelIds = []
		if (singleSelectedPanelId) {
			selectedPanelIds.push(singleSelectedPanelId)
		}
		if (multipleSelectedPanelIds.length > 0) {
			selectedPanelIds = selectedPanelIds.concat(multipleSelectedPanelIds)
		}
		const selectedPanels = this._entityStore.panels.select.getByIds(selectedPanelIds)
		const selectedStringIds = selectedPanels.map((panel) => panel.stringId)
		const uniqueSelectedStringIds = [...new Set(selectedStringIds)]
		if (uniqueSelectedStringIds.length > 1) return false
		if (uniqueSelectedStringIds.length === 0) return false
		const selectedStringId = uniqueSelectedStringIds[0]
		const undefinedStringId = this._entityStore.strings.select.undefinedStringId()
		if (selectedStringId === undefinedStringId) return false
		return !selectedState.selectedStringId
	})

	multiplePanelsAreSelectedWithoutStringSelected = computed(() => {
		const selectedState = this.selectedState()
		return selectedState.multipleSelectedPanelIds.length > 0 && !selectedState.selectedStringId
	})

	stringIsSelectedAndNotInLinkMode = computed(() => {
		const selectedState = this.selectedState()
		const mode = this._appStore.select.mode()
		return !!selectedState.selectedStringId && mode !== MODE_STATE.LINK_MODE
	})

	toggleLinkModeForSelectedString() {
		const selectedStringId = this._selectedStore.select.selectedStringId()
		assertNotNull(selectedStringId)
		if (this._appStore.select.mode() === MODE_STATE.LINK_MODE) {
			this._appStore.dispatch.setModeState(MODE_STATE.SELECT_MODE)
			return
		}
		this._appStore.dispatch.setModeState(MODE_STATE.LINK_MODE)
	}

	clearSelectedInOrder() {
		if (this._selectedStore.select.multipleSelectedPanelIds().length > 0) {
			this._selectedStore.dispatch.clearMultipleSelected()
			return
		}

		if (this._selectedStore.select.singleSelectedPanelId()) {
			this._selectedStore.dispatch.clearSingleSelected()
			return
		}

		if (this._selectedStore.select.selectedStringId()) {
			this._selectedStore.dispatch.clearSelectedString()
			return
		}
	}

	deleteSelected() {
		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (selectedStringId) {
			this._entityStore.strings.dispatch.deleteString(selectedStringId)
			return
		}

		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (multipleSelectedPanelIds.length > 0) {
			this._entityStore.panels.dispatch.deleteManyPanels(multipleSelectedPanelIds)
			return
		}

		const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
		if (singleSelectedPanelId) {
			this._entityStore.panels.dispatch.deletePanel(singleSelectedPanelId)
			return
		}
	}

	selectStringForSelectedPanelOrPanels() {
		const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		let selectedPanelIds = []
		if (singleSelectedPanelId) {
			selectedPanelIds.push(singleSelectedPanelId)
		}
		if (multipleSelectedPanelIds.length > 0) {
			selectedPanelIds = selectedPanelIds.concat(multipleSelectedPanelIds)
		}
		const selectedPanels = this._entityStore.panels.select.getByIds(selectedPanelIds)
		const selectedStringIds = selectedPanels.map((panel) => panel.stringId)
		const uniqueSelectedStringIds = [...new Set(selectedStringIds)]
		if (uniqueSelectedStringIds.length !== 1) {
			throw new Error('Cannot select string for panels of different strings')
		}
		const selectedStringId = uniqueSelectedStringIds[0]

		this._selectedStore.dispatch.selectStringId(selectedStringId)
	}

	createStringWithSelectedPanels() {
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		assertNotNull(multipleSelectedPanelIds)
		const amountOfStrings = this._entityStore.strings.select.allStrings().length
		const { string, panelUpdates } = createStringWithPanels(
			multipleSelectedPanelIds,
			amountOfStrings,
		)
		this._entityStore.strings.dispatch.addStringWithPanels(string, panelUpdates)
		this._selectedStore.dispatch.clearMultipleSelected()
		this._selectedStore.dispatch.selectStringId(string.id)
	}
}
