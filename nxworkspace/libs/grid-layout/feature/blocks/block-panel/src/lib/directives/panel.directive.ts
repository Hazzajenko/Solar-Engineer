import { Directive, ElementRef, inject, Input } from '@angular/core'
import { SoftColor, VibrantColor } from '@shared/data-access/models'
import { PanelNgModel, SelectedPanelType } from '../models/panel-ng.model'

@Directive({
  selector: '[appPanelDirective]',
  standalone: true,
})
export class PanelDirective {
  private elRef = inject(ElementRef)
  @Input() set id(id: string) {
    this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
  }

  @Input() set panelNg(panelNg: PanelNgModel) {
    switch (panelNg.isSelectedPanel) {
      case SelectedPanelType.NOT_SELECTED: {
        this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
        break
      }

      case SelectedPanelType.SINGLE_SELECTED: {
        this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
        break
      }

      case SelectedPanelType.MULTI_SELECETED: {
        this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
        break
      }
    }

    if (panelNg.isSelectedString) {
      this.elRef.nativeElement.style.backgroundColor = '#4f562a'
    }

    if (panelNg.isSelectedPositiveTo) {
      this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftRed
    }
    if (panelNg.isSelectedNegativeTo) {
      this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftCyan
    }
    if (panelNg.isPanelToLink) {
      this.elRef.nativeElement.style.backgroundColor = VibrantColor.VibrantPurple
    }
    if (!panelNg.isPanelToLink && panelNg.isSelectedString) {
      this.elRef.nativeElement.style.backgroundColor = '#4f562a'
    }

    // this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
    /*     if (isOtherStringSelected) {
      return '#819CA9'
    } */

    /*     if (pathMap) {
      const thisPanelPath = pathMap.get(this.id)
      if (thisPanelPath) {
        return thisPanelPath.color
      }
    } */

    /*     if (panelNg) {
      // return '#ff1c24'
      // return '#00E6DF'
      // return VibrantColors.VibrantGreen
      // return `hwb(0 20% 0%)`
    }
    if (stringColor.length > 0) {
      // return `hwb(0 0% 20%)`
      // return DarkColors.SoftCyan
      // return DarkColors.Purple
      return stringColor
    } */
  }
}
