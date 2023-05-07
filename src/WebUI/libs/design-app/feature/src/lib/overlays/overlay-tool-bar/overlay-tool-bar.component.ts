import { AfterViewInit, Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core'
import { assertNotNull, calculateTopLeft } from '@shared/utils'
import { NgClass } from '@angular/common'
import { AppNgrxStateStoreV2Service } from '@design-app/data-access'
import { getGuid } from '@ngrx/data'

@Component({
	selector: 'overlay-tool-bar-component',
	standalone: true,
	templateUrl: 'overlay-tool-bar.component.html',
	imports: [NgClass],
})
export class OverlayToolBarComponent implements AfterViewInit {
	private _renderer = inject(Renderer2)
	private _elementRef = inject(ElementRef)
	private _appStore = inject(AppNgrxStateStoreV2Service)
	showToolbar = true

	@ViewChild('toolBar') toolBar: ElementRef<HTMLDivElement> | undefined

	protected readonly WINDOW = window

	ngAfterViewInit(): void {
		console.log('toolBar', this.toolBar)
		assertNotNull(this.toolBar)
		const { left } = calculateTopLeft(this.toolBar.nativeElement)
		// this._renderer.setStyle(this.toolBar.nativeElement, 'left', left)
	}

	// protected readonly calculateTopLeft = calculateTopLeft

	openSettingsDialog() {
		this._appStore.dispatch.addDialog({
			id: getGuid(),
			component: 'AppSettingsDialogComponent',
			open: true,
		})
	}

	protected readonly calculateTopLeft = calculateTopLeft
}
