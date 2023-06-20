import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	NgZone,
	Renderer2,
} from '@angular/core'
import {
	CREATE_PREVIEW_STATE,
	GraphicsStoreService,
	initialGraphicsState,
	NEARBY_LINES_STATE,
	NearbyLinesState,
} from '@canvas/graphics/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { RenderService } from '@canvas/rendering/data-access'
import { NearbyGraphicsMenuOptions } from '@overlays/dialogs/feature'
import {
	GetOptionCheckedPipe,
	GraphicsStateBooleansKeys,
} from '../../../../../../../dialogs/feature/src/lib/app-settings-dialog/graphics-settings/get-option-checked.pipe'
import { FormsModule } from '@angular/forms'
import { NgForOf, NgIf } from '@angular/common'
import { StringManipulatePipe } from '@shared/pipes'
import { LetDirective } from '@ngrx/component'

@Component({
	selector: 'app-settings-view-graphics',
	standalone: true,
	imports: [FormsModule, NgForOf, GetOptionCheckedPipe, StringManipulatePipe, LetDirective, NgIf],
	templateUrl: './settings-view-graphics.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewGraphicsComponent {
	private _graphicsStore = inject(GraphicsStoreService)
	private _render = inject(RenderService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _elementRef = inject(ElementRef)
	_graphicsState = toSignal(this._graphicsStore.state$, { initialValue: initialGraphicsState })
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
	protected readonly NEARBY_LINES_STATE = NEARBY_LINES_STATE
	protected readonly CREATE_PREVIEW_STATE = CREATE_PREVIEW_STATE

	get graphicsState() {
		return this._graphicsState()
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
}
