import { PanelComponentState } from '../models/panel-component.state'
import { PANEL_SELECTED } from '../models/panel-selected'
import { STRING_SELECTED } from '../models/string-selected'
import { Directive, ElementRef, inject, Input, NgZone, OnInit } from '@angular/core'
import { SoftColor, VibrantColor } from '@shared/data-access/models'
import tippy from 'tippy.js'


@Directive({
	selector: '[appPanelDirective]',
	standalone: true,
})
export class PanelDirective implements OnInit {
	private elRef = inject(ElementRef)

	constructor(private readonly zone: NgZone) {}

	@Input() set state(state: PanelComponentState) {
		// this.elRef.nativeElement.style.backgroundColor = '#95c2fa'

		switch (state.selected) {
			case PANEL_SELECTED.NOT_SELECTED: {
				this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftBrown
				// this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
				this.elRef.nativeElement.style.boxShadow = ``
				break
			}

			case PANEL_SELECTED.SINGLE_SELECTED: {
				// this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
				this.elRef.nativeElement.style.boxShadow = `0 0 0 1px red`
				break
			}

			case PANEL_SELECTED.MULTI_SELECTED: {
				// this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
				this.elRef.nativeElement.style.boxShadow = `0 0 0 1px red`
				break
			}
		}

		switch (state.stringSelected) {
			case STRING_SELECTED.SINGLE_SELECTED: {
				break
			}
			case STRING_SELECTED.OTHER_SELECTED: {
				this.elRef.nativeElement.style.backgroundColor = '#636363'
				break
			}
		}
		if (state.stringColor && state.stringSelected !== STRING_SELECTED.OTHER_SELECTED) {
			// this.elRef.nativeElement.style.backgroundColor = panelNg.stringColor
		}
		if (state.stringSelected === STRING_SELECTED.SINGLE_SELECTED) {
			if (state.panelPath && state.selected !== PANEL_SELECTED.SINGLE_SELECTED) {
				this.elRef.nativeElement.style.backgroundColor = state.panelPath.color
			}

			if (state.selectedPanelPath) {
				if (state.selectedPanelPath.count > 0) {
					this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftRed
				}
				if (state.selectedPanelPath.count < 0) {
					this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftCyan
				}
				if (state.selectedPanelPath.count === 0) {
					this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftGreen
					// this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftYellow
				}
			}

			/*    if (panelNg.isSelectedPositiveTo) {
			 this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftRed
			 }
			 if (panelNg.isSelectedNegativeTo) {
			 this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftCyan
			 }*/
			if (state.isPanelToLink) {
				this.elRef.nativeElement.style.backgroundColor = VibrantColor.VibrantPurple
			}
		}
	}

	ngOnInit() {
		// this.setupTooltip();
		this.zone.runOutsideAngular(() => {
			this.setupTooltip()
		})
	}

	private setupTooltip() {
		tippy(this.elRef.nativeElement, {
			// content: 'Bazinga!',
		})
	}
}