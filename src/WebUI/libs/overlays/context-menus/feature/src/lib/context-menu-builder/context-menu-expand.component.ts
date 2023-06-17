import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	Input,
	OnInit,
	Renderer2,
} from '@angular/core'
import { NgIf } from '@angular/common'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { AppSvgKey } from '@shared/assets'
import { ChildContextMenuDirective } from '../directives'
import { scaleAndOpacityAnimation } from '@shared/animations'

@Component({
	selector: 'context-menu-expand',
	standalone: true,
	imports: [NgIf, ShowSvgNoStylesComponent, InputSvgComponent, ChildContextMenuDirective],
	template: `
		<li class="relative">
			<div
				[childContextMenuElement]="expandMenu"
				appChildContextMenu
				class="group hover:bg-gray-100 flex items-center justify-between"
			>
				<div class="group flex items-center justify-center">
					<a
						class="flex items-center px-4 py-2 text-xs text-gray-700 group-hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
						role="menuitem"
						tabindex="-1"
					>
						<app-show-svg-no-styles
							class="mr-1 group-hover:text-gray-600"
							svgPath="profile/user-plus"
						/>
						{{ label }}
					</a>
				</div>
				<a class="flex group justify-end items-center pr-1 text-sm" role="menuitem" tabindex="-1">
					<app-show-svg-no-styles class="group-hover:text-gray-600" svgPath="arrows/right" />
				</a>
			</div>
			<ul
				#expandMenu
				@scaleAndOpacity
				class="text-xs text-gray-700 dark:text-gray-200 absolute top-1 left-full ml-1 z-50 w-56 bg-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				style="display: none"
			>
				<ng-content />
			</ul>
		</li>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [scaleAndOpacityAnimation],
})
export class ContextMenuExpandComponent implements OnInit {
	private _renderer = inject(Renderer2)
	private _element = inject(ElementRef)

	@Input({ required: true }) label!: string
	@Input() svgName?: AppSvgKey

	ngOnInit(): void {
		const div = this._renderer.createElement('li') as HTMLElement
		const parent = this._element.nativeElement.parentElement as Element
		this._renderer.insertBefore(parent, div, this._element.nativeElement)
		this._renderer.appendChild(div, this._element.nativeElement)
	}
}
