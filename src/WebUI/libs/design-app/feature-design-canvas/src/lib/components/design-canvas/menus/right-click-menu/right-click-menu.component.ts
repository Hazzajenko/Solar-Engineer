import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { domStringMapToMenuDataSet, MenuDataset } from '../../../../types'
import { CanvasClientStateService, DomPointService, ObjectRotatingService } from '../../../../services'
import { ShowSvgComponent } from '@shared/ui'

@Component({
	selector:       'app-right-click-menu[dataSet][closeMenu]', standalone: true, imports: [
		ShowSvgComponent,
	], templateUrl: './right-click-menu.component.html', styles: [], changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightClickMenuComponent {
	private _domPoint = inject(DomPointService)
	private _objRotating = inject(ObjectRotatingService)
	private _state = inject(CanvasClientStateService)
	private _dataSet!: MenuDataset
	@Input() set dataSet(domStringMap: DOMStringMap) {
		this._dataSet = domStringMapToMenuDataSet(domStringMap)
	}

	@Output() closeMenu = new EventEmitter()

	rotate(event: MouseEvent) {
		const startPoint = this._domPoint.getTransformedPointFromEventOffsets(event)

		this._objRotating.setEntityToRotate(this._dataSet.id, startPoint)
		this.closeMenu.emit()
	}

	delete() {
		this._state.entities.canvasEntities.removeEntity(this._dataSet.id)
		this.closeMenu.emit()
	}
}

