import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { EntityStoreService } from '@design-app/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgIf } from '@angular/common'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { DataViewPanelsComponent } from './data-view-panels/data-view-panels.component'

@Component({
	selector: 'side-ui-data-view',
	standalone: true,
	imports: [NgIf, ShowSvgNoStylesComponent, DataViewPanelsComponent],
	templateUrl: './side-ui-data-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiDataViewComponent {
	private _entityStore = inject(EntityStoreService)
	private _panels = toSignal(this._entityStore.panels.allPanels$, {
		initialValue: this._entityStore.panels.allPanels,
	})
	private _strings = toSignal(this._entityStore.strings.allStrings$, {
		initialValue: this._entityStore.strings.allStrings,
	})

	get panels() {
		return this._panels()
	}

	get strings() {
		return this._strings()
	}
}
