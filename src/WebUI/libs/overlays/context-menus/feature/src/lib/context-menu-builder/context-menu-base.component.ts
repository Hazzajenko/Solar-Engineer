import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { scaleAndOpacityAnimation } from '@shared/animations'
import { NgIf } from '@angular/common'
import { ContextMenuHeadingComponent } from './context-menu-heading.component'

@Component({
	selector: 'context-menu-base',
	standalone: true,
	imports: [NgIf, ContextMenuHeadingComponent],
	template: `
		<ul
			@scaleAndOpacity
			class="py-1 text-sm text-gray-700 dark:text-gray-200 absolute z-50 mt-2 w-56 bg-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
		>
			<context-menu-heading *ngIf="heading" [heading]="heading" />
			<ng-content />
		</ul>
	`,
	animations: [scaleAndOpacityAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuBaseComponent {
	@Input() heading?: string
}
