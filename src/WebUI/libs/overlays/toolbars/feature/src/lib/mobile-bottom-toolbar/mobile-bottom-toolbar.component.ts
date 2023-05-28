import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { goTop } from '@shared/animations'

@Component({
	selector: 'overlay-mobile-bottom-toolbar',
	standalone: true,
	imports: [ShowSvgNoStylesComponent],
	templateUrl: './mobile-bottom-toolbar.component.html',
	styles: [],
	animations: [goTop],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomToolbarComponent {}
