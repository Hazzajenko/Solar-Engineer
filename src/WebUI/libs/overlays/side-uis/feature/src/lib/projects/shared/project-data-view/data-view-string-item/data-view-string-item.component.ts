import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { InputSvgComponent } from '@shared/ui'
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgIf, NgStyle } from '@angular/common'
import { StringId, StringWithPanelsAndStats } from '@entities/shared'
import { heightInOutWithConfig } from '@shared/animations'

@Component({
	selector: 'app-data-view-string-item',
	standalone: true,
	imports: [DefaultHoverEffectsDirective, InputSvgComponent, MatTooltipModule, NgIf, NgStyle],
	templateUrl: './data-view-string-item.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [heightInOutWithConfig(0.2)],
})
export class DataViewStringItemComponent {
	@Input({ required: true }) stringGroup!: StringWithPanelsAndStats
	@Input({ required: true }) isDefined = false
	@Input({ required: true }) selectedStringId?: StringId

	@Output() stringSelected = new EventEmitter<StringId>()
	@Output() stringSettingsOpened = new EventEmitter<StringId>()
	@Output() stringDeleted = new EventEmitter<StringId>()
	@Output() stringColourPickerOpened = new EventEmitter<StringId>()

	selectStringInApp(id: StringId) {
		this.stringSelected.emit(id)
	}

	openStringSettings(id: StringId) {
		this.stringSettingsOpened.emit(id)
	}

	deleteString(id: StringId) {
		this.stringDeleted.emit(id)
	}

	openStringColourPicker(id: StringId) {
		this.stringColourPickerOpened.emit(id)
	}
}
