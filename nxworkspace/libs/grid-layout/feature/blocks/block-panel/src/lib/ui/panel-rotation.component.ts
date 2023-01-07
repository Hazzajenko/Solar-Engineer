import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
  selector: 'app-panel-rotation',
  template: `
    <div *ngIf='rotation && haveGotRotation'>
      <svg viewBox='0 0 100 100' class='pointer-events-none absolute'>
        <path
          class='stroke-slate-800 fill-none stroke-[8px] z-10'
          d='
              M 30, 0
              V 100
              '
        />
        <path
          class='stroke-slate-800 fill-none stroke-[8px] z-10'
          d='
              M 70, 0
              V 100
              '
        />
      </svg>
    </div>
    <ng-container *ngIf='rotation'>
      <ng-container [ngSwitch]='rotation'>
        <ng-container *ngSwitchCase='0'>
          <svg viewBox='0 0 100 100' class='pointer-events-none relative'>
            <path
              class='stroke-slate-800 fill-none stroke-[8px] z-10'
              d='
              M 30, 0
              V 100
              '
            />
            <path
              class='stroke-slate-800 fill-none stroke-[8px] z-10'
              d='
              M 70, 0
              V 100
              '
            />
          </svg>
        </ng-container>
        <ng-container *ngSwitchCase='1'>
          <svg viewBox='0 0 100 100' class='pointer-events-none relative'>
            <path
              class='stroke-slate-800 fill-none stroke-[8px] z-10'
              d='
              M 0, 30
              H 100
              '
            />
            <path
              class='stroke-slate-800 fill-none stroke-[8px] z-10'
              d='
              M 0, 70
              H 100
              '
            />
          </svg>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgIf,
  ],
  standalone: true,
})
export class PanelRotationComponent {
  @Input() set setRotation(rotation: number) {
    this.rotation = rotation
    this.haveGotRotation = true
  }

  rotation?: number
  haveGotRotation = false

}