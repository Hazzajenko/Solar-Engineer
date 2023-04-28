import {
	CanvasClientStateService,
	DomPointService,
	ObjectRotatingService,
} from '../../../../services'
import { MenuDataset } from '../../../../types'
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
} from '@angular/core'
import { ShowSvgComponent } from '@shared/ui'


@Component({
	selector: 'app-right-click-menu[dataSet][closeMenu]',
	standalone: true,
	imports: [ShowSvgComponent],
	templateUrl: './right-click-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightClickMenuComponent {
	private _domPoint = inject(DomPointService)
	private _objRotating = inject(ObjectRotatingService)
	private _state = inject(CanvasClientStateService)
	private _dataSet!: MenuDataset
	@Input() set dataSet(domStringMap: DOMStringMap) {
		this._dataSet = {
			id: domStringMap['id']!,
			type: domStringMap['type']!, // type: domStringMap['type'] as CanvasEntity['type'],
			angle: domStringMap['angle']!,
		}
		// this._dataSet = domStringMapToMenuDataSet(domStringMap)
	}

	@Output() closeMenu = new EventEmitter()

	rotate(event: MouseEvent) {
		const startPoint = this._domPoint.getTransformedPointFromEventOffsets(event)

		this._objRotating.setEntityToRotate(this._dataSet.id, startPoint)
		this.closeMenu.emit()
	}

	delete() {
		this._state.entities.canvasEntities.removeEntity(this._dataSet.id)
		console.log('delete', this._dataSet)
		this.closeMenu.emit()
	}
}