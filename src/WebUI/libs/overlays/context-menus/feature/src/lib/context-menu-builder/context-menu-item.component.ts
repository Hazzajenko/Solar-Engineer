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

@Component({
	selector: 'context-menu-item',
	standalone: true,
	imports: [NgIf, ShowSvgNoStylesComponent, InputSvgComponent],
	template: `
		<li>
			<a
				class="group flex items-center px-4 py-2 text-xs text-gray-700 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
				role="menuitem"
				tabindex="-1"
			>
				<svg-input *ngIf="svgName" class="mr-1 group-hover:text-gray-600" [svgName]="svgName" />
				{{ label }}
			</a>
		</li>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuItemComponent implements OnInit {
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
