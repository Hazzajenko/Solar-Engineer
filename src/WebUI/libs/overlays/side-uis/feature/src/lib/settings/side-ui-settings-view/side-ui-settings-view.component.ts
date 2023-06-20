import { ChangeDetectionStrategy, Component, inject, Injector, signal } from '@angular/core'
import { SideUiBaseComponent } from '../../side-ui-base/side-ui-base.component'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../../side-ui-nav-bar/side-ui-nav-bar.component'
import { SideUiViewHeadingComponent } from '../../shared'
import { SettingsViewSectionPreviewComponent } from './settings-view-section-preview/settings-view-section-preview.component'
import { SettingsViewKeymapComponent } from './settings-view-keymap/settings-view-keymap.component'
import { NgIf } from '@angular/common'
import { SettingsViewDisplayComponent } from './settings-view-display/settings-view-display.component'
import { SettingsViewGraphicsComponent } from './settings-view-graphics/settings-view-graphics.component'
import { injectUiStore } from '@overlays/ui-store/data-access'

export type SettingsSection = 'keyMap' | 'display' | 'graphics'

@Component({
	selector: 'side-ui-settings-view',
	standalone: true,
	imports: [
		SideUiBaseComponent,
		SideUiViewHeadingComponent,
		SettingsViewSectionPreviewComponent,
		SettingsViewKeymapComponent,
		NgIf,
		SettingsViewDisplayComponent,
		SettingsViewGraphicsComponent,
	],
	templateUrl: './side-ui-settings-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiSettingsViewComponent {
	isMobile = injectUiStore().select.isMobile
	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView
	openedSettingsSections = signal<Set<SettingsSection>>(new Set())

	toggleSection(section: SettingsSection) {
		/*		const openedSettingsSections = this.openedSettingsSections()
		 if (openedSettingsSections.has(section)) {
		 openedSettingsSections.delete(section)
		 } else {
		 openedSettingsSections.add(section)
		 }
		 this.openedSettingsSections.set(openedSettingsSections)*/

		this.openedSettingsSections.update((openedSettingsSections) => {
			if (openedSettingsSections.has(section)) {
				openedSettingsSections.delete(section)
			} else {
				openedSettingsSections.add(section)
			}
			return openedSettingsSections
		})
	}
}
