import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
	selector: 'app-loading-project-spinner',
	standalone: true,
	imports: [NgIf],
	templateUrl: './loading-project-spinner.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingProjectSpinnerComponent {}
