import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { WebUserModel } from '@auth/shared'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe } from '@shared/pipes'

@Component({
	selector: 'app-search-result-user',
	standalone: true,
	imports: [
		InputSvgComponent,
		NgIf,
		NgOptimizedImage,
		TimeDifferenceFromNowPipe,
		StandaloneDatePipe,
	],
	templateUrl: './search-result-user.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultUserComponent {
	@Input({ required: true }) user!: WebUserModel
}
