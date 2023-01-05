import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { LetModule } from '@ngrx/component'

@Component({
  selector: 'app-grid-background',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    LetModule,
  ],
  template: `
    <!--    <div class='pointer-events-none absolute'>-->
    <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <pattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'>
          <path d='M 8 0 L 0 0 0 8' fill='none' stroke='gray' stroke-width='0.5' />
        </pattern>
        <pattern id='grid' width='32' height='32' patternUnits='userSpaceOnUse'>
          <rect width='32' height='32' fill='url(#smallGrid)' />
          <path d='M 32 0 L 0 0 0 32' fill='none' stroke='gray' stroke-width='1' />
        </pattern>
      </defs>

      <rect width='100%' height='100%' fill='url(#grid)' />
    </svg>
    <!--    </div>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
})
export class GridBackgroundComponent {
  height?: string
  width?: string

  @Input() set gridSize(size: { rows: number, cols: number }) {
    this.height = `${size.rows * 32 + 1}px`
    this.width = `${size.cols * 32 + 1}px`
  }


}