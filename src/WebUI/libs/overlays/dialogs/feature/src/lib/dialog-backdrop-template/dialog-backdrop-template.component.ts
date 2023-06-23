import {
	AfterViewInit,
	booleanAttribute,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	NgZone,
	OnDestroy,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { scaleAndOpacityAnimation } from '@shared/animations'
import { NgIf } from '@angular/common'

@Component({
	selector: 'dialog-backdrop-template-component',
	standalone: true,
	template: `
		<div
			*ngIf="currentDialog()"
			class="z-[45] fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50"
			id="backdrop"
		></div>
		<div
			@scaleAndOpacity
			#backdrop
			tabindex="-1"
			class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full"
		>
			<div
				[style.height]="height"
				class="relative w-fit left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 overflow-y-auto p-4"
			>
				<div
					class="relative bg-slate-100 rounded-lg shadow dark:bg-gray-700 mb-2"
					id="dialog-content"
				>
					<button
						(click)="closeDialog()"
						class="absolute top-2 right-2 text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
						data-modal-hide="crypto-modal"
						type="button"
					>
						<svg
							aria-hidden="true"
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								clip-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								fill-rule="evenodd"
							></path>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
					<ng-content />
				</div>
			</div>
		</div>
	`,
	animations: [scaleAndOpacityAnimation],
	imports: [NgIf],
})
export class DialogBackdropTemplateComponent implements AfterViewInit, OnDestroy {
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _uiStore = injectUiStore()
	private _dispose: ReturnType<typeof this._renderer.listen> | undefined = undefined
	currentDialog = this._uiStore.select.currentDialog
	@Input() height = ''
	@Input({ transform: booleanAttribute }) disableCloseDialog = false
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
					this.ngOnDestroy()
				},
			)
		})
	}

	closeDialog() {
		this.backdropClick.emit()
		if (this.disableCloseDialog) return
		this._uiStore.dispatch.closeDialog()
	}

	ngOnDestroy() {
		this._dispose?.()
		if (this.disableCloseDialog) return
		this._uiStore.dispatch.closeDialog()
	}
}
