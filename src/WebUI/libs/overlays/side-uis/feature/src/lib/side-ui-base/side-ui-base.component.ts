import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
// class="overflow-y-auto py-4 px-3 h-full w-{{
// this.width
// }} bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
// class="overflow-y-auto py-4 px-3 h-full w-80 md:w-60 bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
// <div
// 	class="w-[calc(100vw-64px)] overflow-y-auto py-4 px-3 h-full bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
// 				>
@Component({
	selector: 'side-ui-base',
	standalone: true,
	imports: [],
	template: `
		<div
			class="w-72 md:w-60 overflow-y-auto py-4 px-3 h-full bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
		>
			<ng-content></ng-content>
		</div>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiBaseComponent {
	@Input() width = 60
}
