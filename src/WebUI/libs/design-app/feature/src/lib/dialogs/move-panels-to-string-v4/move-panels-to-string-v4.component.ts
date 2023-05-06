import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	Input,
	NgZone,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { EntityNgrxStoreService } from '@design-app/data-access'


@Component({
	selector: 'dialog-move-panels-to-string-v4',
	templateUrl: 'move-panels-to-string-v4.component.html',
	standalone: true,
	imports: [AsyncPipe, NgForOf, NgIf, MatDialogModule, MatButtonModule],
})
export class MovePanelsToStringV4Component implements OnInit, AfterViewInit {
	private _elementRef = inject(ElementRef<HTMLDivElement>)
	private _entities = inject(EntityNgrxStoreService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	@ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>
	strings = toSignal(this._entities.strings.allStringsWithPanels$)
	private _panelIds: string[] = []

	@Input({ required: true }) set data(panelIds: string[]) {
		console.log('panelIds', panelIds)
		this._panelIds = panelIds
	}

	get panelIds() {
		return this._panelIds
	}

	// private dialogRef = inject(MatDialogRef<MovePanelsToStringV2Component>)
	// private data = inject(MAT_DIALOG_DATA)
	// dialogs = inject(DialogsService)
	// private _data = inject(MAT_DIALOG_DATA)
	// panelIds: string[] = inject(MAT_DIALOG_DATA).panelIds

	ngOnInit(): void {
		console.log('panelIds', this.constructor.name)
	}

	ngAfterViewInit(): void {
		/*		const width = this.dialog.nativeElement.style.width
		 const height = this.dialog.nativeElement.style.height
		 console.log('width', width)
		 console.log('height', height)*/
		const { width, height } = this.dialog.nativeElement.getBoundingClientRect()
		// rect.
		const top = (window.innerHeight - height) / 2 + 'px'
		const left = (window.innerWidth - width) / 2 + 'px'
		console.log('nativeElement', this._elementRef.nativeElement)
		console.log('backdrop-nativeElement', this.backdrop.nativeElement)
		console.log('dialog-nativeElement', this.dialog.nativeElement)
		// this._renderer.setStyle(this.dialog.nativeElement, 'background-color', 'red')
		console.log('top', top)
		console.log('left', left)
		this._renderer.setStyle(this.dialog.nativeElement, 'top', top)
		this._renderer.setStyle(this.dialog.nativeElement, 'left', left)
		// this.dialog.nativeElement.style.top = top
		// this.dialog.nativeElement.style.left = left
		this.setupListeners()
		// this._elementRef.nativeElement.
	}

	private setupListeners() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this.backdrop.nativeElement, 'click', this.onClick)
			/*			this._renderer.listen(this.dialog.nativeElement, 'mousedown', this.onMouseDown)
			 this._renderer.listen(this.dialog.nativeElement, 'mouseup', this.onMouseUp)
			 this._renderer.listen(this.dialog.nativeElement, 'mousemove', this.onMouseMove)
			 this._renderer.listen(this.dialog.nativeElement, 'mouseleave', this.onMouseLeave)*/
		})
		// this._renderer.listen(this.dialog.nativeElement, 'click', this.onClick)
		// this._renderer.listen(this.dialog.nativeElement, 'mousedown', this.onMouseDown)
		// this._renderer.listen(this.dialog.nativeElement, 'mouseup', this.onMouseUp)
		// this._renderer.listen(this.dialog.nativeElement, 'mousemove', this.onMouseMove)
		// this._renderer.listen(this.dialog.nativeElement, 'mouseleave', this.onMouseLeave)
	}

	private onClick = (event: MouseEvent) => {
		console.log('onClick', event)
		this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none')
	}
}