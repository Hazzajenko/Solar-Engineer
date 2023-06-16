import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { NgClass } from '@angular/common'
import { SideUiNavBarView } from '../side-ui-nav-bar/side-ui-nav-bar.component'
// class="overflow-y-auto py-4 px-3 h-full w-{{
// this.width
// }} bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
// class="overflow-y-auto py-4 px-3 h-full w-80 md:w-60 bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
// <div
// 	class="w-[calc(100vw-64px)] overflow-y-auto py-4 px-3 h-full bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
// 				>
// w-72

@Component({
	selector: 'side-ui-base',
	standalone: true,
	imports: [NgClass],
	template: `
		<div
			[ngClass]="{
				'translate-x-0': sideUiNavOpen() && view !== 'none',
			}"
			class="{{
				this.fullscreenMobileClasses
			}} md:w-60 overflow-y-auto py-4 px-3 h-full bg-slate-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700  transition-transform -translate-x-full"
		>
			<ng-content></ng-content>
		</div>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiBaseComponent {
	private _uiStore = injectUiStore()
	sideUiNavOpen = this._uiStore.select.sideUiNavOpen
	fullscreenMobileClasses = 'w-[calc(100vw-64px)] absolute'
	@Input({ required: true }) view: SideUiNavBarView = 'none'
}
