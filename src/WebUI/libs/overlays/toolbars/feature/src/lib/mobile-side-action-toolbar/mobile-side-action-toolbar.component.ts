import { ChangeDetectionStrategy, Component, computed } from '@angular/core'
import { goTop } from '@shared/animations'
import { InputSvgComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { MobileBottomToolbarDirective } from '../mobile-bottom-toolbar/mobile-bottom-toolbar.directive'
import { NgClass, NgIf } from '@angular/common'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { assertNotNull, NgTailwindClass, TAILWIND_CLASS } from '@shared/utils'
import { injectEntityStore } from '@entities/data-access'
import { injectAppStateStore, MODE_STATE } from '@canvas/app/data-access'
import { UNDEFINED_STRING_NAME } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'

@Component({
	selector: 'overlay-mobile-side-action-toolbar',
	standalone: true,
	imports: [InputSvgComponent, LetDirective, MobileBottomToolbarDirective, NgIf, NgClass],
	templateUrl: './mobile-side-action-toolbar.component.html',
	styles: [],
	animations: [goTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSideActionToolbarComponent {
	private _selectedStore = injectSelectedStore()
	private _entityStore = injectEntityStore()
	private _appStore = injectAppStateStore()
	user = injectAppUser()
	selectedState = this._selectedStore.select.selectedState

	isInSelectedState = computed(() => {
		const selectedState = this.selectedState()
		return (
			!!selectedState.selectedStringId ||
			!!selectedState.singleSelectedPanelId ||
			selectedState.multipleSelectedPanelIds.length > 0
		)
	})

	panelIsSelectedWithoutStringSelected = computed(() => {
		const selectedState = this.selectedState()
		const singleSelectedPanelId = selectedState.singleSelectedPanelId
		if (!singleSelectedPanelId) return false
		const singleSelectedPanel = this._entityStore.panels.select.getById(singleSelectedPanelId)
		assertNotNull(singleSelectedPanel)
		const stringForSelectedPanel = this._entityStore.strings.select.getById(
			singleSelectedPanel.stringId,
		)
		assertNotNull(stringForSelectedPanel)
		if (stringForSelectedPanel.name === UNDEFINED_STRING_NAME) return false
		return !!selectedState.singleSelectedPanelId && !selectedState.selectedStringId
	})

	stringIsSelectedAndNotInLinkMode = computed(() => {
		const selectedState = this.selectedState()
		const mode = this._appStore.select.mode()
		return !!selectedState.selectedStringId && mode !== MODE_STATE.LINK_MODE
	})

	cancelButtonNgClass = computed(() => {
		const isInSelectedState = this.isInSelectedState()
		const ngClass: NgTailwindClass = {}
		ngClass[TAILWIND_CLASS.SCALE_X_125] = isInSelectedState
		return ngClass
	})

	startLinkModeForSelectedString() {
		const selectedStringId = this._selectedStore.select.selectedStringId()
		assertNotNull(selectedStringId)
		this._appStore.dispatch.setModeState(MODE_STATE.LINK_MODE)
	}

	clearSelectedInOrder() {
		if (this._selectedStore.select.selectedStringId()) {
			this._selectedStore.dispatch.clearSelectedString()
			return
		}

		if (this._selectedStore.select.multipleSelectedPanelIds().length > 0) {
			this._selectedStore.dispatch.clearMultipleSelected()
			return
		}

		if (this._selectedStore.select.singleSelectedPanelId()) {
			this._selectedStore.dispatch.clearSingleSelected()
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

	selectStringForSelectedPanel() {
		const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
		assertNotNull(singleSelectedPanelId)

		const selectedPanel = this._entityStore.panels.select.getById(singleSelectedPanelId)
		assertNotNull(selectedPanel)

		this._selectedStore.dispatch.selectStringId(selectedPanel.stringId)
	}
}
