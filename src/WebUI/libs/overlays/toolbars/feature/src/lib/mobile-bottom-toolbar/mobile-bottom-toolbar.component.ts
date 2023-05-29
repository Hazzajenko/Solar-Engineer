import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	Renderer2,
	signal,
	ViewChild,
} from '@angular/core'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { goTop } from '@shared/animations'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { NgIf } from '@angular/common'
import { ContextMenuDirective } from '@overlays/context-menus/feature'
import { Point } from '@shared/data-access/models'
import { NgOnInitDirective } from './ng-oninit.directive'

@Component({
	selector: 'overlay-mobile-bottom-toolbar',
	standalone: true,
	imports: [ShowSvgNoStylesComponent, MatMenuModule, NgIf, ContextMenuDirective, NgOnInitDirective],
	templateUrl: './mobile-bottom-toolbar.component.html',
	styles: [],
	animations: [goTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomToolbarComponent {
	@ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger
	@ViewChild('testMenu') testMenu!: ElementRef<HTMLDivElement>
	@ViewChild('mobileToolbar') mobileToolbar!: ElementRef<HTMLDivElement>
	menuTopLeftPosition = { x: '0', y: '0' }
	contextMenuLocation = { x: 0, y: 0 } as Point
	_renderer = inject(Renderer2)
	_element = inject(ElementRef).nativeElement
	contextMenuOpen = signal(false)

	toggleContextMenu(event: TouchEvent, menuButton: HTMLButtonElement) {
		event.preventDefault()
		event.stopPropagation()
		const toolbarRect = this.mobileToolbar.nativeElement.getBoundingClientRect()
		const top = toolbarRect.top
		const rect = menuButton.getBoundingClientRect()
		this.contextMenuLocation.x = rect.left
		this.contextMenuLocation.y = top

		this.contextMenuOpen.set(!this.contextMenuOpen())

		this._renderer.listen(document, 'touchstart', (event: TouchEvent) => {
			const target = event.target as HTMLElement
			if (target.role !== 'menuitem') {
				this.contextMenuOpen.set(false)
			}
		})
	}

	initDiv(div: HTMLDivElement | HTMLUListElement) {
		const rect = div.getBoundingClientRect()
		const top = this.contextMenuLocation.y - rect.height
		const left = this.contextMenuLocation.x
		this._renderer.setStyle(div, 'top', top + 'px')
		this._renderer.setStyle(div, 'left', left + 'px')
	}
}
