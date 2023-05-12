import { NearbyGraphicsMenuOptions } from './nearby-graphics-menu-options'
import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	NgZone,
	Renderer2,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ReactiveFormsModule } from '@angular/forms'
import {
	CREATE_PREVIEW_STATE,
	GraphicsStoreService,
	initialGraphicsState,
	NEARBY_LINES_STATE,
	NearbyLinesState,
	RenderService,
} from '@design-app/data-access'
import { LetDirective } from '@ngrx/component'
import { EVENT_TYPE } from '@shared/data-access/models'
import { GetOptionCheckedPipe, GraphicsStateBooleansKeys } from './get-option-checked.pipe'
import { StringManipulatePipe } from '@shared/pipes'

@Component({
	selector: 'app-canvas-graphics-settings',
	standalone: true,
	imports: [
		NgForOf,
		NgIf,
		AsyncPipe,
		ReactiveFormsModule,
		LetDirective,
		NgTemplateOutlet,
		GetOptionCheckedPipe,
		StringManipulatePipe,
	],
	templateUrl: './graphics-settings.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicsSettingsComponent implements AfterViewInit {
	private _graphicsStore = inject(GraphicsStoreService)
	_graphicsState = toSignal(this._graphicsStore.state$, { initialValue: initialGraphicsState })

	get graphicsState() {
		return this._graphicsState()
	}

	protected readonly NEARBY_LINES_STATE = NEARBY_LINES_STATE
	protected readonly CREATE_PREVIEW_STATE = CREATE_PREVIEW_STATE
	private _render = inject(RenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)

	nearbyGraphicsSelectMenuArray = NearbyGraphicsMenuOptions

	toggleOptions: {
		toggle: () => void
		name: GraphicsStateBooleansKeys
		label: string
	}[] = [
		{
			toggle: () => this._graphicsStore.dispatch.toggleSelectedPanelFill(),
			name: 'selectedPanelFill',
			label: 'Selected Panel Fill',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleSelectedStringPanelFill(),
			name: 'selectedStringPanelFill',
			label: 'Selected String Panel Fill',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleColouredStrings(),
			name: 'colouredStrings',
			label: 'Coloured Strings',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleStringBoxes(),
			name: 'stringBoxes',
			label: 'String Boxes',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleLinkModeSymbols(),
			name: 'linkModeSymbols',
			label: 'Link Mode Symbols',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleLinkModeOrderNumbers(),
			name: 'linkModeOrderNumbers',
			label: 'Link Mode Order Numbers',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleCreatePreview(),
			name: 'createPreview',
			label: 'Create Preview',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleNearbyLines(),
			name: 'nearbyLines',
			label: 'Nearby Lines',
		},
	]

	ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}

	toggleCreatePreview() {
		this._graphicsStore.dispatch.toggleStringBoxes()
		this._render.renderCanvasApp()
	}

	toggleNearbyLineGraphics() {
		this._graphicsStore.dispatch.toggleNearbyLines()
		this._render.renderCanvasApp()
	}

	toggleGraphics(
		toToggle:
			| 'toggleCreatePreview'
			| 'toggleNearbyLines'
			| 'toggleSelectedPanelFill'
			| 'toggleSelectedStringPanelFill'
			| 'toggleColouredStrings',
	) {
		this._graphicsStore.dispatch[toToggle]()
		this._render.renderCanvasApp()
	}

	changeNearbyGraphics(event: Event) {
		const target = event.target as HTMLInputElement
		const newState = target.value as NearbyLinesState

		switch (newState) {
			case NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES:
				this._graphicsStore.dispatch.setNearbyLines(NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES)
				break
			case NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE:
				this._graphicsStore.dispatch.setNearbyLines(NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE)
				break
			case NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
				this._graphicsStore.dispatch.setNearbyLines(
					NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES,
				)
				break
			default:
				throw new Error(`Unknown nearby graphics state: ${newState}`)
		}
		this._render.renderCanvasApp()
	}

	// protected readonly state = state
}
