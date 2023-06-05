import { inject, Injectable } from '@angular/core'
import { AppStateStoreService } from '@canvas/app/data-access'
import { NearbyService } from '@canvas/object-positioning/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { createPanel } from '@entities/utils'
import { getTopLeftPointFromTransformedPoint } from '@canvas/utils'
import { ENTITY_TYPE, SizeByType } from '@entities/shared'
import { TransformedPoint } from '@shared/data-access/models'
import { injectEntityStore } from '../store'

@Injectable({
	providedIn: 'root',
})
export class EntityFactoryService {
	private _appStore = inject(AppStateStoreService)
	private _selectedStore = injectSelectedStore()
	private _nearby = inject(NearbyService)
	private _render = inject(RenderService)
	private _entities = injectEntityStore()

	createEntity(event: PointerEvent, currentPoint: TransformedPoint) {
		const previewAxisState = this._appStore.state.previewAxis
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

			const selectedStringId = this._selectedStore.state.selectedStringId
			const entity = selectedStringId
				? createPanel(previewRectLocation, selectedStringId)
				: createPanel(previewRectLocation)
			this._entities.panels.addPanel(entity)
			this._nearby.axisPreviewRect = undefined
			this._appStore.dispatch.setPreviewAxisState('None')

			this._render.renderCanvasApp()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.PANEL],
		)
		const selectedStringId = this._selectedStore.state.selectedStringId
		const entity = selectedStringId
			? createPanel(location, selectedStringId)
			: createPanel(location)
		this._entities.panels.addPanel(entity)

		this._render.renderCanvasApp()
	}

	createEntityFromTouch(event: TouchEvent, currentPoint: TransformedPoint) {
		const previewAxisState = this._appStore.state.previewAxis
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

			const selectedStringId = this._selectedStore.state.selectedStringId
			const entity = selectedStringId
				? createPanel(previewRectLocation, selectedStringId)
				: createPanel(previewRectLocation)
			this._entities.panels.addPanel(entity)
			this._nearby.axisPreviewRect = undefined
			this._appStore.dispatch.setPreviewAxisState('None')

			this._render.renderCanvasApp()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.PANEL],
		)
		const selectedStringId = this._selectedStore.state.selectedStringId
		const entity = selectedStringId
			? createPanel(location, selectedStringId)
			: createPanel(location)
		this._entities.panels.addPanel(entity)

		this._render.renderCanvasApp()
	}
}
