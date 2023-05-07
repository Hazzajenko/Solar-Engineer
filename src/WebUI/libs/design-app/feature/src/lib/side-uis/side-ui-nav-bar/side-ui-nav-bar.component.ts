import { Component, signal } from '@angular/core'
import { NgIf } from '@angular/common'
import { goRightWithConfig } from '@shared/animations'

@Component({
	selector: 'side-ui-nav-bar',
	standalone: true,
	templateUrl: 'side-ui-nav-bar.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [NgIf],
})
export class SideUiNavBarComponent {
	isOpen = signal(true)

	toggle() {
		this.isOpen.set(!this.isOpen())
		setTimeout(() => {
			this.isOpen.set(!this.isOpen())
			console.log('toggle', this.isOpen())
		}, 1000)
	}
}
