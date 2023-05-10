import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	NgZone,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { AppStateStoreService, UiStoreService } from '@design-app/data-access'

@Component({
	selector: 'dialog-backdrop-template-component',
	standalone: true,
	template: `
		<div
			#backdrop
			tabindex="-1"
			class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
		>
			<ng-content />
		</div>
	`,
})
export class DialogBackdropTemplateComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)
	private _dispose: ReturnType<typeof this._renderer.listen> | undefined = undefined
	// private mouseDownTimeOut: ReturnType<typeof setTimeout> | undefined
	@ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>
	@Output() backdropClick = new EventEmitter<void>()

	// @Input({ required: true }) dialogId!: string

	ngAfterViewInit(): void {
		this._ngZone.runOutsideAngular(() => {
			this._dispose = this._renderer.listen(
				this.backdrop.nativeElement,
				'click',
				(event: MouseEvent) => {
					if (event.target !== this.backdrop.nativeElement) return
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
		// this._uiStore.dispatch.updateDialog({ id: this.dialogId, changes: { open: false } })
	}
}
