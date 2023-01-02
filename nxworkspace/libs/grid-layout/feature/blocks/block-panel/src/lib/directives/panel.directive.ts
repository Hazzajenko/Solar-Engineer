import { Directive, ElementRef, inject, Input } from '@angular/core'
import { PanelLinkPath } from '@grid-layout/shared/models'
import { SoftColor, VibrantColor } from '@shared/data-access/models'
import { PanelNgModel, SelectedPanelVal, StringSelectedVal } from '../models/panel-ng.model'

@Directive({
  selector: '[appPanelDirective]',
  standalone: true,
})
export class PanelDirective {
  private elRef = inject(ElementRef)

  @Input() set id(id: string) {
    this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
  }

  @Input() set panelLinkPath(panelLinkPath: PanelLinkPath | undefined | null) {
    if (!panelLinkPath) return

    // this.elRef.nativeElement.style.backgroundColor = panelLinkPath.color
    /*     const thisPanelPath = stringPathMap.get(this.id)
        if (thisPanelPath) {
          this.elRef.nativeElement.style.backgroundColor = thisPanelPath.color
        } */
  }


  @Input() set panelNg(panelNg: PanelNgModel) {
    switch (panelNg.isSelectedPanel) {
      case SelectedPanelVal.NOT_SELECTED: {
        this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
        this.elRef.nativeElement.style.boxShadow = ``
        break
      }

      case SelectedPanelVal.SINGLE_SELECTED: {
        // this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
        this.elRef.nativeElement.style.boxShadow = `0 0 0 1px red`
        break
      }

      case SelectedPanelVal.MULTI_SELECTED: {
        // this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
        this.elRef.nativeElement.style.boxShadow = `0 0 0 1px red`
        break
      }
    }

    switch (panelNg.stringSelected) {
      case StringSelectedVal.SELECTED: {

        break
      }
      case StringSelectedVal.OTHER_SELECTED: {
        this.elRef.nativeElement.style.backgroundColor = '#636363'
        break
      }
    }
    if (panelNg.stringColor && panelNg.stringSelected !== 2) {
      this.elRef.nativeElement.style.backgroundColor = panelNg.stringColor
    }
    if (panelNg.panelLinkPath) {
      this.elRef.nativeElement.style.backgroundColor = panelNg.panelLinkPath.color
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

  }
}
