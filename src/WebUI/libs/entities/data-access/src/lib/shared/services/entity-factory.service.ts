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

@Injectable({
	providedIn: 'root',
})
export class EntityFactoryService {
	private _appStore = injectAppStateStore()
	private _selectedStore = injectSelectedStore()
	private _nearby = inject(NearbyService)
	private _render = inject(RenderService)
	private _entities = injectEntityStore()

	createEntity(event: PointerEvent, currentPoint: TransformedPoint) {
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
				this._entities.strings.select.undefinedStringId()
			// const undefinedString = this._entities.strings.select.getById(UNDEFINED_STRING_ID)
			const entity = createPanel(previewRectLocation, selectedStringId)
			/*		const entity = selectedStringId
			 ? createPanel(previewRectLocation, selectedStringId)
			 : createPanel(previewRectLocation)*/
			this._entities.panels.dispatch.addPanel(entity)
			this._nearby.axisPreviewRect = undefined
			this._appStore.dispatch.setPreviewAxisState('None')

			this._render.renderCanvasApp()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.PANEL],
		)
		// const selectedStringId = this._selectedStore.select.selectedStringId()
		const selectedStringId =
			this._selectedStore.select.selectedStringId() ??
			this._entities.strings.select.undefinedStringId()
		const entity = createPanel(location, selectedStringId)
		/*		const entity = selectedStringId
		 ? createPanel(location, selectedStringId)
		 : createPanel(location)*/
		this._entities.panels.dispatch.addPanel(entity)

		this._render.renderCanvasApp()
	}

	createEntityFromTouch(event: TouchEvent, currentPoint: TransformedPoint) {
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

			const selectedStringId = this._selectedStore.select.selectedStringId()
			const entity = selectedStringId
				? createPanel(previewRectLocation, selectedStringId)
				: createPanel(previewRectLocation)
			this._entities.panels.dispatch.addPanel(entity)
			this._nearby.axisPreviewRect = undefined
			this._appStore.dispatch.setPreviewAxisState('None')

			this._render.renderCanvasApp()
			return
		}

		const location = getTopLeftPointFromTransformedPoint(
			currentPoint,
			SizeByType[ENTITY_TYPE.PANEL],
		)
		const selectedStringId = this._selectedStore.select.selectedStringId()
		const entity = selectedStringId
			? createPanel(location, selectedStringId)
			: createPanel(location)
		this._entities.panels.dispatch.addPanel(entity)

		this._render.renderCanvasApp()
	}
}
