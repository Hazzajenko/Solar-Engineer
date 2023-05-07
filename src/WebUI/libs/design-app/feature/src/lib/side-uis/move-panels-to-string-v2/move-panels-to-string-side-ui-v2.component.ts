import { Component, signal } from '@angular/core'
import { goLeft, goRight, slideOver } from './animation'
import { NgIf } from '@angular/common'

@Component({
	selector: 'side-ui-move-panels-to-string-v2',
	standalone: true,
	templateUrl: 'move-panels-to-string-side-ui-v2.component.html',
	animations: [slideOver, goRight, goLeft],
	imports: [NgIf],
})
export class MovePanelsToStringSideUiV2Component {
	isOpen = signal(true)

	toggle() {
		this.isOpen.set(!this.isOpen())
		setTimeout(() => {
			this.isOpen.set(!this.isOpen())
			console.log('toggle', this.isOpen())
		}, 1000)
		/*		setInterval(() => {
		 this.isOpen = !this.isOpen

		 }, 2000)*/
	}
}
