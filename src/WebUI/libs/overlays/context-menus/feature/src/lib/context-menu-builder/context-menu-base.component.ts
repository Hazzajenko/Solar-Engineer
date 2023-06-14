import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { increaseScaleAndOpacity } from '@shared/animations'
import { NgIf } from '@angular/common'
import { ContextMenuHeadingComponent } from './context-menu-heading.component'

@Component({
	selector: 'context-menu-base',
	standalone: true,
	imports: [NgIf, ContextMenuHeadingComponent],
	template: `
		<ul
			@increaseScaleAndOpacity
			class="py-1 text-sm text-gray-700 dark:text-gray-200 absolute z-50 mt-2 w-56 bg-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
		>
			<context-menu-heading *ngIf="heading" [heading]="heading" />
			<ng-content />
		</ul>
	`,
	animations: [increaseScaleAndOpacity],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuBaseComponent {
	@Input() heading?: string
}
