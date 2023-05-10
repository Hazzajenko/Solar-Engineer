import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	Input,
	NgZone,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { EVENT_TYPE, Point } from '@shared/data-access/models'
import { RenderService } from '@design-app/data-access'

@Component({
	selector: 'app-context-menu-template',
	standalone: true,
	imports: [],
	template: `
		<div #menu class="absolute">
			<ul
				id="menu-list"
				class="py-1 text-sm text-gray-700 dark:text-gray-200 absolute z-50  mt-2 w-56 bg-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			>
				<ng-content />
			</ul>
		</div>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuTemplateComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _render = inject(RenderService)
	private _elementRef = inject(ElementRef)
	private _menuPosition!: Point

	@ViewChild('menu', { static: true }) menu!: ElementRef<HTMLDivElement>

	@Input({ required: true }) set menuPosition(point: Point) {
		if (!point) {
			console.error('no point')
			return
		}
		this._menuPosition = point
	}

	get menuPosition(): Point {
		return this._menuPosition
	}

	ngAfterViewInit(): void {
		if (!this.menuPosition) {
			console.error('no point')
			return
		}
		const point = this.menuPosition
		this._renderer.setStyle(this.menu.nativeElement, 'top', `${point.y}px`)
		this._renderer.setStyle(this.menu.nativeElement, 'left', `${point.x}px`)
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this.menu.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}
}
