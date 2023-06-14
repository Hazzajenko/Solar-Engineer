import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
	selector: 'context-menu-sub-heading',
	standalone: true,
	imports: [NgIf],
	template: `
		<div class="px-4 py-3" role="none">
			<p class="truncate capitalize text-xs font-medium text-gray-900" role="none">
				{{ heading }}
			</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuSubHeadingComponent {
	@Input({ required: true }) heading!: string
}
