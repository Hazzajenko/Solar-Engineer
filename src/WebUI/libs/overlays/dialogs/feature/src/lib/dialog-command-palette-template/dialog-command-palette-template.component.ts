import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	NgZone,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { NgIf } from '@angular/common'

@Component({
	selector: 'dialog-command-palette-template',
	standalone: true,
	imports: [NgIf],
	templateUrl: './dialog-command-palette-template.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCommandPaletteTemplateComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _uiStore = injectUiStore()
	private _dispose: ReturnType<typeof this._renderer.listen> | undefined = undefined
	currentDialog = this._uiStore.select.currentDialog
	@Input() height = ''
	@ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>
	@Output() backdropClick = new EventEmitter<void>()

	ngAfterViewInit(): void {
		this._ngZone.runOutsideAngular(() => {
			this._dispose = this._renderer.listen(
				this.backdrop.nativeElement,
				'click',
				(event: MouseEvent) => {
					console.log('backdrop click', event.target)
					const dialogContentElement =
						this.backdrop.nativeElement.children[0].id === 'dialog-content'
							? this.backdrop.nativeElement.children[0]
							: this.backdrop.nativeElement.children[0].children[0].id === 'dialog-content'
							? this.backdrop.nativeElement.children[0].children[0]
							: undefined

					const target = event.target as HTMLElement
					if (dialogContentElement?.contains(target)) return
					this.backdropClick.emit()
					this.closeDialog()
				},
			)
		})
	}

	closeDialog() {
		console.log('closeDialog')
		this._dispose?.()
		this._uiStore.dispatch.closeDialog()
	}
}
