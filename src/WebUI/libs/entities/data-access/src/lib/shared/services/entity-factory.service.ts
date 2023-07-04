import { inject, Injectable } from '@angular/core'
import { NearbyService } from '@canvas/object-positioning/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { createPanel } from '@entities/utils'
import { getTopLeftPointFromTransformedPoint } from '@canvas/utils'
import { ENTITY_TYPE, SizeByType } from '@entities/shared'
import { TransformedPoint } from '@shared/data-access/models'
import { injectEntityStore } from '../store'
import { injectAppStateStore } from '@canvas/app/data-access'
import { injectAppUser } from '@auth/data-access'

@Injectable({
	providedIn: 'root',
})
export class EntityFactoryService {
	private _appStore = injectAppStateStore()
	private _selectedStore = injectSelectedStore()
	private _nearby = inject(NearbyService)
	private _render = inject(RenderService)
	private _entityStore = injectEntityStore()
	private user = injectAppUser()

	createEntity(event: PointerEvent, currentPoint: TransformedPoint) {
		const selectedPanelConfigId = this._entityStore.panelConfigs.select.selectedPanelConfigId()
		const previewAxisState = this._appStore.select.previewAxis()
		if (previewAxisState === 'AxisCreatePreviewInProgress') {
			if (!event.altKey || !this._nearby.axisPreviewRect) {
				this._appStore.dispatch.setPreviewAxisState('None')
				this._nearby.axisPreviewRect = undefined
				this._render.renderCanvasApp()
				return
			}

			const previewRectLocation = {
				x: this._nearby.axisPreviewRect.left,
				y: this._nearby.axisPreviewRect.top,
			}

			const selectedStringId =
				this._selectedStore.select.selectedStringId() ??
				this._entityStore.strings.select.undefinedStringId()

			const entity = createPanel(previewRectLocation, selectedStringId, selectedPanelConfigId)
			this._entityStore.panels.dispatch.addPanel(entity)
			this._nearby.axisPreviewRect = undefined
			this._appStore.dispatch.setPreviewAxisState('None')

			this._render.renderCanvasApp()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.PANEL],
		)

		const selectedStringId =
			this._selectedStore.select.selectedStringId() ??
			this._entityStore.strings.select.undefinedStringId()
		const entity = createPanel(location, selectedStringId, selectedPanelConfigId)
		this._entityStore.panels.dispatch.addPanel(entity)

		this._render.renderCanvasApp()
	}

	createEntityFromTouch(event: TouchEvent, currentPoint: TransformedPoint) {
		const selectedPanelConfigId = this._entityStore.panelConfigs.select.selectedPanelConfigId()
		const previewAxisState = this._appStore.select.previewAxis()
		if (previewAxisState === 'AxisCreatePreviewInProgress') {
			if (!event.altKey || !this._nearby.axisPreviewRect) {
				this._appStore.dispatch.setPreviewAxisState('None')
				this._nearby.axisPreviewRect = undefined
				this._render.renderCanvasApp()
				return
			}

			const previewRectLocation = {
				x: this._nearby.axisPreviewRect.left,
				y: this._nearby.axisPreviewRect.top,
			}

			const selectedStringId =
				this._selectedStore.select.selectedStringId() ??
				this._entityStore.strings.select.undefinedStringId()
			const entity = createPanel(previewRectLocation, selectedStringId, selectedPanelConfigId)
			this._entityStore.panels.dispatch.addPanel(entity)
			this._nearby.axisPreviewRect = undefined
			this._appStore.dispatch.setPreviewAxisState('None')

			this._render.renderCanvasApp()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.PANEL],
		)
		const selectedStringId =
			this._selectedStore.select.selectedStringId() ??
			this._entityStore.strings.select.undefinedStringId()
		const entity = createPanel(location, selectedStringId, selectedPanelConfigId)
		this._entityStore.panels.dispatch.addPanel(entity)

		this._render.renderCanvasApp()
	}

	private getSelectedStringId() {
		if (!this.user()) {
			return this._entityStore.strings.select.undefinedStringId()
		}
		return (
			this._selectedStore.select.selectedStringId() ??
			this._entityStore.strings.select.undefinedStringId()
		)
	}
}
