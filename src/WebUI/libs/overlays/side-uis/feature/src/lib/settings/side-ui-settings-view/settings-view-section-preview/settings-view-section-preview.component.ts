import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ButtonAnimatedDownUpArrowComponent } from '@shared/ui'
import { NgIf } from '@angular/common'

@Component({
	selector: 'app-settings-view-section-preview',
	standalone: true,
	imports: [ButtonAnimatedDownUpArrowComponent, NgIf],
	templateUrl: './settings-view-section-preview.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewSectionPreviewComponent {
	@Input({ required: true }) sectionTitle!: string
	@Input({ required: true }) isOpen = false
	@Input() sectionDescription: string | undefined
	@Input() sectionIcon: string | undefined
}
