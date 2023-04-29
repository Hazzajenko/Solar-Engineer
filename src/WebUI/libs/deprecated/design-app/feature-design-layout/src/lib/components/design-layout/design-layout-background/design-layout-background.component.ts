import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
	selector: 'app-design-layout-background',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './design-layout-background.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [],
})
export class DesignLayoutBackgroundComponent {}
