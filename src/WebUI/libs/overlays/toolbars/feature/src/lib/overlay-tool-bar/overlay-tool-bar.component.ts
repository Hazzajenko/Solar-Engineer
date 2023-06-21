import { Component, computed, Signal } from '@angular/core'
import { assertNotNull, ToSafeHtmlPipe } from '@shared/utils'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
	ButtonAnimatedLeftRightArrowComponent,
	InputSvgComponent,
	ShowSvgNoStylesComponent,
	ToggleSvgNoStylesComponent,
	TooltipComponent,
} from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { NgIconComponent } from '@ng-icons/core'
import { goBottom } from '@shared/animations'
import { DynamicWidthDirective } from './dynamic-width.directive'
import { injectAppUser } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'
import { ActionButtonDirective } from '../mobile-side-action-toolbar/action-button.directive'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { injectEntityStore } from '@entities/data-access'
import { injectAppStateStore, MODE_STATE } from '@canvas/app/data-access'
import { createStringWithPanels } from '@entities/utils'
import { DefaultHoverEffectsDirective } from '@shared/directives'

@Component({
	selector: 'overlay-tool-bar-component',
	standalone: true,
	templateUrl: 'overlay-tool-bar.component.html',
	imports: [
		NgClass,
		MatTooltipModule,
		TooltipComponent,
		ToSafeHtmlPipe,
		ConvertTooltipPipe,
		ShowSvgNoStylesComponent,
		NgIf,
		ToggleSvgNoStylesComponent,
		NgIconComponent,
		NgForOf,
		NgStyle,
		DynamicWidthDirective,
		LetDirective,
		ActionButtonDirective,
		InputSvgComponent,
		ButtonAnimatedLeftRightArrowComponent,
		DefaultHoverEffectsDirective,
	],
	hostDirectives: [MouseOverRenderDirective],
	animations: [goBottom],
})
export class OverlayToolBarComponent {
	private _uiStore = injectUiStore()
	private _selectedStore = injectSelectedStore()
	private _entitiesStore = injectEntityStore()
	private _appStore = injectAppStateStore()
	sideUiNavOpen = this._uiStore.select.sideUiNavOpen as Signal<boolean>
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
		const selectedPanels = this._entitiesStore.panels.select.getByIds(selectedPanelIds)
		const selectedStringIds = selectedPanels.map((panel) => panel.stringId)
		const uniqueSelectedStringIds = [...new Set(selectedStringIds)]
		if (uniqueSelectedStringIds.length > 1) return false
		if (uniqueSelectedStringIds.length === 0) return false
		const selectedStringId = uniqueSelectedStringIds[0]
		const undefinedStringId = this._entitiesStore.strings.select.undefinedStringId()
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

	toggleSideUi() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	openColourPicker(changeColourButton: HTMLButtonElement, toolBar: HTMLDivElement) {
		const rect = changeColourButton.getBoundingClientRect()

		const location = { x: rect.left, y: rect.top + rect.height }
		location.y += 10
		const toolbarRect = toolBar.getBoundingClientRect()
		const right = toolbarRect.right

		this._uiStore.dispatch.openContextMenu({
			component: CONTEXT_MENU_COMPONENT.COLOUR_PICKER_MENU,
			location,
			data: {
				left: rect.left,
				right,
			},
		})
	}

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
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (multipleSelectedPanelIds.length > 0) {
			this._entitiesStore.panels.dispatch.deleteManyPanels(multipleSelectedPanelIds)
			return
		}

		const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
		if (singleSelectedPanelId) {
			this._entitiesStore.panels.dispatch.deletePanel(singleSelectedPanelId)
			return
		}

		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (selectedStringId) {
			// this._entityStore.strings.dispatch.deleteString(selectedStringId)
			const string = this._entitiesStore.strings.select.getById(selectedStringId)
			assertNotNull(string, 'KeyEventsService: keyUpHandlerV3: string not found')
			this._uiStore.dispatch.openDialog({
				component: DIALOG_COMPONENT.WARNING_TEMPLATE,
				data: {
					title: 'Delete String',
					message: `Are you sure you want to delete string ${string.name}?`,
					buttonText: 'Delete',
					buttonAction: () => {
						if (!selectedStringId)
							throw new Error('KeyEventsService: keyUpHandlerV3: no selected string id')
						this._entitiesStore.strings.dispatch.deleteString(selectedStringId)
					},
				},
			})
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
		const selectedPanels = this._entitiesStore.panels.select.getByIds(selectedPanelIds)
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
		const amountOfStrings = this._entitiesStore.strings.select.allStrings().length
		const { string, panelUpdates } = createStringWithPanels(
			multipleSelectedPanelIds,
			amountOfStrings,
		)
		this._entitiesStore.strings.dispatch.addStringWithPanels(string, panelUpdates)
		this._selectedStore.dispatch.clearMultipleSelected()
		this._selectedStore.dispatch.selectStringId(string.id)
	}
}
