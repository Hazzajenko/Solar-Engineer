import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { InputSvgComponent } from '../../svgs'

@Component({
	selector: 'btn-context-menu',
	standalone: true,
	imports: [DefaultHoverEffectsDirective, InputSvgComponent],
	templateUrl: './button-context-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonContextMenuComponent {
	@Input({ transform: booleanAttribute }) hideMobile = false
}
