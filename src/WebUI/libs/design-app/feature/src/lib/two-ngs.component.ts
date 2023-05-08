import { Component, Input } from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
	selector: 'app-two-ngs-component',
	standalone: true,
	template: `
		<ng-container *ngIf="ngif">
			<ng-container *ngIf="ngif2">
				<ng-content />
			</ng-container>
		</ng-container>
	`,
	imports: [NgIf],
})
export class TwoNgsComponent {
	@Input() ngif: unknown
	@Input() ngif2: unknown
}
