import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { rotate180BasedOnOpenStateWithConfig } from '@shared/animations'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { InputSvgComponent } from '../../svgs'

@Component({
	selector: 'btn-animated-left-right-arrow',
	standalone: true,
	imports: [DefaultHoverEffectsDirective, InputSvgComponent],
	animations: [rotate180BasedOnOpenStateWithConfig(0.2)],
	templateUrl: './button-animated-left-right-arrow.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonAnimatedLeftRightArrowComponent {
	@Input({ required: true }) isOpen = false
}
