import { roundToTwoDecimals } from 'design-app/utils'

export class CanvasScale {
  public static readonly identity = new CanvasScale(1, 1)

  constructor(public x: number, public y: number) {}

  public static fromScale(scale: number): CanvasScale {
    return new CanvasScale(scale, scale)
  }

  public static fromScaleXY(scaleX: number, scaleY: number): CanvasScale {
    return new CanvasScale(scaleX, scaleY)
  }

  public setScale(scale: number): CanvasScale {
    this.x = scale
    this.y = scale
    return this
  }

  public handleWheelEvent(event: WheelEvent): CanvasScale {
    if (event.deltaY > 0) return this.decrease()
    if (event.deltaY < 0) return this.increase()
    return this
  }

  public increase(): CanvasScale {
    if (this.x >= CanvasScaleMax || this.y >= CanvasScaleMax) return this
    this.x += CanvasScaleStep
    this.y += CanvasScaleStep
    this.handleLongNumbers()
    return this
  }

  public decrease(): CanvasScale {
    if (this.x <= CanvasScaleMin || this.y <= CanvasScaleMin) return this
    this.x -= CanvasScaleStep
    this.y -= CanvasScaleStep
    this.handleLongNumbers()
    return this
  }

  private handleLongNumbers() {
    this.x = roundToTwoDecimals(this.x)
    this.y = roundToTwoDecimals(this.y)
  }
}

export const CanvasScaleStep = 0.1
export const CanvasScaleMin = 0.3
export const CanvasScaleMax = 2