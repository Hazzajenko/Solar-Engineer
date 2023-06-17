import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { rotate180BasedOnOpenStateWithConfig } from '@shared/animations'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { InputSvgComponent } from '../../svgs'

@Component({
	selector: 'btn-animated-down-up-arrow',
	standalone: true,
	imports: [DefaultHoverEffectsDirective, InputSvgComponent],
	templateUrl: './button-animated-down-up-arrow.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [rotate180BasedOnOpenStateWithConfig(0.2)],
})
export class ButtonAnimatedDownUpArrowComponent {
	@Input({ required: true }) isOpen = false
}
