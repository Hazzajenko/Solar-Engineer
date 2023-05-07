import { Component, signal } from '@angular/core'
import { NgIf } from '@angular/common'
import { goRightWithConfig } from '@shared/animations'

@Component({
	selector: 'side-ui-move-panels-to-string-v5',
	standalone: true,
	templateUrl: 'move-panels-to-string-side-ui-v5.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [NgIf],
})
export class MovePanelsToStringSideUiV5Component {
	isOpen = signal(true)

	toggle() {
		this.isOpen.set(!this.isOpen())
		setTimeout(() => {
			this.isOpen.set(!this.isOpen())
			console.log('toggle', this.isOpen())
		}, 1000)
	}
}
