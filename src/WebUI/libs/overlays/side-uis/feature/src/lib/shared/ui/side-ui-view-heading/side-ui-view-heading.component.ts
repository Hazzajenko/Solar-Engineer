import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
	selector: 'side-ui-view-heading',
	standalone: true,
	imports: [],
	template: `
		<div class="pt-5 pl-2 mb-4 text-sm text-gray-900 dark:text-gray-400 font-semibold capitalize">
			<h3>{{ heading }}</h3>
		</div>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiViewHeadingComponent {
	@Input({ required: true }) heading!: string
}
