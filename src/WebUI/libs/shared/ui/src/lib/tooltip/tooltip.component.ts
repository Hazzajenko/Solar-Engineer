import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { NgClass, NgSwitch, NgSwitchCase } from '@angular/common'

@Component({
	selector: 'app-tooltip',
	standalone: true,
	imports: [NgSwitchCase, NgClass, NgSwitch],
	template: `
		<ng-container [ngSwitch]="tooltipPlacement">
			<ng-container *ngSwitchCase="'top'">
				<div
					id="settings-tooltip"
					role="tooltip"
					[ngClass]="color"
					class="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg shadow-sm opacity-0 tooltip"
				>
					Tooltip on top
					<div class="tooltip-arrow" data-popper-arrow></div>
				</div>
			</ng-container>
			<ng-container *ngSwitchCase="'right'">
				<div
					id="tooltip-right"
					role="tooltip"
					[ngClass]="color"
					class="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white rounded-lg shadow-sm opacity-0 tooltip"
				>
					Tooltip on right
					<div class="tooltip-arrow" data-popper-arrow></div>
				</div>
			</ng-container>
			<ng-container *ngSwitchCase="'bottom'">
				<div
					id="tooltip-bottom"
					role="tooltip"
					[ngClass]="color"
					class="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white rounded-lg shadow-sm opacity-0 tooltip"
				>
					Tooltip on bottom
					<div class="tooltip-arrow" data-popper-arrow></div>
				</div>
			</ng-container>
			<ng-container *ngSwitchCase="'left'">
				<div
					id="tooltip-left"
					role="tooltip"
					[ngClass]="color"
					class="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white rounded-lg shadow-sm opacity-0 tooltip"
				>
					Tooltip on left
					<div class="tooltip-arrow" data-popper-arrow></div>
				</div>
			</ng-container>
		</ng-container>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
	@Input() tooltipPlacement: TooltipPlacement = 'top'
	@Input({ required: true }) tooltipText!: string
	@Input() tooltipColor = 'bg-gray-600'
	@Input() tooltipDarkColor = 'dark:bg-gray-800'

	get color() {
		return this.tooltipColor + ' ' + this.tooltipDarkColor
	}

	/*	@Input() tooltipTrigger: TooltipTrigger = 'hover'
	 @Input() tooltipDelay: number = 0
	 @Input() tooltipArrow: boolean = true
	 @Input() tooltipArrowType: TooltipArrowType = 'sharp'
	 @Input() tooltipTheme: TooltipTheme = 'light-border'
	 @Input() tooltipSize: TooltipSize = 'medium'*/
}

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left'
