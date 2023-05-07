import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { initFlowbite } from '@shared/utils'

@Component({
	selector: 'side-ui-move-panels-to-string',
	standalone: true,
	templateUrl: 'move-panels-to-string-side-ui.component.html',
})
export class MovePanelsToStringSideUiComponent implements OnInit, AfterViewInit {
	@ViewChild('button') button?: ElementRef<HTMLButtonElement>

	ngOnInit(): void {
		console.log('MovePanelsToStringSideUiComponent')
		initFlowbite()
		// initDrawers()
		// initDrawersFlowbite()
		/*		document.addEventListener('DOMContentLoaded', function (event) {
		 document.getElementById('updateProductButton')?.click()
		 console.log('DOMContentLoaded')
		 })*/
	}

	ngAfterViewInit(): void {
		console.log('MovePanelsToStringSideUiComponent', this.button)
		this.button?.nativeElement.click()
	}
}
