import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { DesignCanvasDirective } from '../../directives'
import { select, Store } from '@ngrx/store'
import { selectDrawTime } from '../../store'
import { ShowSvgComponent } from '@shared/ui'
import { CanvasEntitiesStore } from '../../services'
import { Factory, MenuDataset } from '../../types'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:         [
    CdkDrag,
    CommonModule,
    DesignCanvasDirective,
    ShowSvgComponent,
  ],
  selector:        'app-design-canvas',
  standalone:      true,
  styles:          [],
  templateUrl:     './design-canvas.component.html',
})
export class DesignCanvasComponent
  implements OnInit {
  private _store = inject(Store)
  public entitiesStore = inject(CanvasEntitiesStore)
  public drawTime$ = this._store.pipe(select(selectDrawTime))
  @ViewChild(DesignCanvasDirective, { static: true }) canvas!: DesignCanvasDirective
  @ViewChild(CdkDrag, { static: true }) drag!: CdkDrag
  @ViewChild('menu', { static: true }) menu!: ElementRef<HTMLDivElement>

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit')
  }

  rotate() {
    const dataSet = this.getMenuDataSet()
    console.log(dataSet)

    const angle = parseInt(dataSet.angle, 10) + 45
    const update = Factory.Panel.updateForStore(dataSet.id, { angle })
    this.entitiesStore.dispatch.updateCanvasEntity(update)
    this.closeMenu()
  }

  delete() {
    const dataSet = this.getMenuDataSet()
    console.log(dataSet)
    this.entitiesStore.dispatch.deleteCanvasEntity(dataSet.id)
    this.closeMenu()
  }

  private getMenuDataSet() {
    const ref = this.menu.nativeElement
    return ref.dataset as MenuDataset
  }

  private closeMenu() {
    this.menu.nativeElement.style.display = 'none'
  }
}
