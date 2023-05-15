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
import { RenderService } from '@canvas/rendering/data-access'

@Component({
	selector: 'app-context-menu-template',
	standalone: true,
	imports: [],
	template: `
		<!--		<div #menu class="absolute z-50">-->
		<ul
			#menu
			id="menu-list"
			class="py-1 text-sm text-gray-700 dark:text-gray-200 absolute z-50  mt-2 w-56 bg-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
		>
			<ng-content />
		</ul>
		<!--		</div>-->
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuTemplateComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _render = inject(RenderService)
	private _elementRef = inject(ElementRef)
	private _menuPos!: Point

	@ViewChild('menu', { static: true }) menu!: ElementRef<HTMLDivElement>

	@Input({ required: true }) set menuPos(point: Point) {
		console.log('set menuPosition(point: Point)', point)
		if (!point) {
			console.error('no point')
			return
		}
		console.log('set menuPosition(point: Point)', point)
		this._menuPos = point
	}

	get menuPos(): Point {
		return this._menuPos
	}

	ngAfterViewInit(): void {
		if (!this.menuPos) {
			console.error('no point')
			return
		}
		const point = this.menuPos
		console.log('point', point)
		console.log('this.menu.nativeElement', this.menu.nativeElement)
		this._renderer.setStyle(this.menu.nativeElement, 'top', `${point.y}px`)
		this._renderer.setStyle(this.menu.nativeElement, 'left', `${point.x}px`)
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this.menu.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}
}
