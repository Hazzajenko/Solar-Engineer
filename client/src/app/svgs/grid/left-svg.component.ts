import { Component } from '@angular/core'

@Component({
  selector: 'app-left-svg',
  template: `
    <svg viewBox="0 0 100 100">
      <path
        d="
        M 50, 50
        H -10
        "
      />
    </svg>
  `,
  standalone: true,
  styles: [
    `
      svg {
        //border: 1px solid red;
        height: 100%;
        width: 100%;
        z-index: 1;
      }

      path {
        stroke: #a60fe1;
        fill: none;
        stroke-width: 3;
        vector-effect: non-scaling-stroke;
        z-index: 1;
      }
    `,
  ],
})
export class LeftSvgComponent {}
