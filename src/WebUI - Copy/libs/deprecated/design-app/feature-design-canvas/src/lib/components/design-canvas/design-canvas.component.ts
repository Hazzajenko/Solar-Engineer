import { DesignCanvasWithXstateDirective } from '../../directives'
import {
	CanvasClientStateService,
	CanvasEntitiesStore,
	CanvasRenderService,
	DomPointService,
	ObjectPositioningService,
} from '../../services'
import { selectDrawTime } from '../../store'
import { MenuDataset } from '../../types'
import {
	CanvasAppSettingsComponent,
	CanvasGraphicsMenuComponent,
	KeyMapComponent,
	RightClickMenuComponent,
	StateValuesComponent,
} from './menus'
import { RightClickMenuV2Component } from './menus/right-click-menu-v2'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core'
import { LetModule } from '@ngrx/component'
import { select, Store } from '@ngrx/store'
import { ShowSvgComponent } from '@shared/ui'

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetModule,
		KeyMapComponent,
		CanvasAppSettingsComponent,
		RightClickMenuComponent,
		DesignCanvasWithXstateDirective,
		CanvasGraphicsMenuComponent,
		StateValuesComponent,
		RightClickMenuV2Component,
	],
	selector: 'app-design-canvas',
	standalone: true,
	styles: [],
	templateUrl: './design-canvas.component.html',
})
export class DesignCanvasComponent implements OnInit {
	private _store = inject(Store)
	private _objectPositioning = inject(ObjectPositioningService)
	// private _objectPositioning = inject(CanvasObjectPositioningService)
	private _domPoint = inject(DomPointService)
	private _state = inject(CanvasClientStateService)
	private _render = inject(CanvasRenderService)
	public entitiesStore = inject(CanvasEntitiesStore)
	public drawTime$ = this._store.pipe(select(selectDrawTime))
	// @ViewChild(DesignCanvasDirective, { static: true }) canvas!: DesignCanvasDirective
	@ViewChild(CdkDrag, { static: true }) drag!: CdkDrag
	@ViewChild('menu', { static: true }) menu!: ElementRef<HTMLDivElement>

	state = inject(CanvasClientStateService)

	rightClickMenu = [
		{ label: 'Rotate', action: this.rotate.bind(this) },
		{ label: 'Delete', action: this.delete.bind(this) },
	]

	canvasMenuArr = [
		{
			label: 'Create Preview',
			action: this.toggleCreatePreview.bind(this),
			selected: this._state.menu.createPreview,
		},
		{
			label: 'Nearby Axis Lines',
			action: this.toggleNearbyAxisLines.bind(this),
			selected: this._state.menu.nearbyAxisLines,
		},
	]

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
	}

	rotate(event: PointerEvent) {
		const dataSet = this.getMenuDataSet()
		console.log(dataSet)

		const startPoint = this._domPoint.getTransformedPointFromEvent(event)

		// TODO set entity to rotate
		// this._objectPositioning.setEntityToRotate(dataSet.id, startPoint)
		/*    const angle = parseInt(dataSet.angle, 10) + 45
		 const update = Factory.Panel.updateForStore(dataSet.id, { angle })
		 this.entitiesStore.dispatch.updateCanvasEntity(update)*/
		this.closeMenu()
	}

	delete() {
		const dataSet = this.getMenuDataSet()
		console.log(dataSet)
		this._state.entities.panels.removeEntity(dataSet.id)
		// this.entitiesStore.dispatch.deleteCanvasEntity(dataSet.id)
		this.closeMenu()
	}

	private getMenuDataSet() {
		const ref = this.menu.nativeElement
		return ref.dataset as MenuDataset
	}

	private closeMenu() {
		this.menu.nativeElement.style.display = 'none'
	}

	toggleCreatePreview() {
		this._state.updateState({
			menu: {
				createPreview: !this._state.menu.createPreview,
			},
		})
		this._render.drawCanvas()
	}

	toggleNearbyAxisLines() {
		this._state.updateState({
			menu: {
				nearbyAxisLines: !this._state.menu.nearbyAxisLines,
			},
		})
		this._render.drawCanvas()
	}
}