import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { MatTooltipModule } from '@angular/material/tooltip'
import { SideUiNavBarStore } from '../../../side-ui-nav-bar/side-ui-nav-bar.store'

@Component({
	selector: 'side-ui-view-heading',
	standalone: true,
	imports: [InputSvgComponent, DefaultHoverEffectsDirective, MatTooltipModule],
	template: `
		<!--		<div class="absolute right-0 top-0 p-4 text-gray-600">
					<button
						(click)="toggleSideUi()"
						class="p-2 text-gray-500 blue rounded cursor-pointer active:text-gray-900 active:bg-gray-100 dark:text-gray-400 dark:active:text-white dark:active:bg-gray-600"
						enableDefaultHoverEffects
						matTooltip="Close Side Ui"
						type="button"
					>
						<svg-input class="w-5 h-5" svgName="SvgChevronDoubleLeft" />
					</button>
				</div>-->
		<div class="pt-5 pl-2 mb-4 text-sm text-gray-900 dark:text-gray-400 font-semibold capitalize">
			<h3>{{ heading }}</h3>
		</div>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiViewHeadingComponent {
	private _sideUiNavBarStore = inject(SideUiNavBarStore)
	@Input({ required: true }) heading!: string

	toggleSideUi() {
		this._sideUiNavBarStore.changeView('none')
	}
}
