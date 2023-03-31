export const BgColorBuilder = (
  color:
    | 'blue'
    | 'red'
    | 'green'
    | 'yellow'
    | 'orange'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'gray'
    | 'white',
  lightness?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
) => {
  const addOpacity = (opacity: number): BackgroundColorWithOpacity => {
    if (lightness) return `bg-${color}-${lightness} bg-opacity-${opacity}`
    return `bg-${color}-500 bg-opacity-${opacity}`
  }

  if (lightness)
    return {
      toString: (): BackgroundColorWithoutOpacity => `bg-${color}-${lightness}`,
      addOpacity,
    }
  return {
    toString: (): BackgroundColorWithoutOpacity => `bg-${color}-500`,
    addOpacity,
  }
}
export type BackgroundColor = BackgroundColorWithoutOpacity | BackgroundColorWithOpacity
export type BackgroundColorWithoutOpacity = `bg-${string}-${number}`
export type BackgroundColorWithOpacity = `${BackgroundColorWithoutOpacity} bg-opacity-${number}`

export class BackgroundColorBuilder {
  private readonly color: BackgroundColorWithoutOpacity
  private opacity: number | null = null

  constructor(color: BackgroundColorWithoutOpacity, opacity?: number) {
    this.color = color
    if (opacity) this.opacity = opacity
  }

  addOpacity(opacity: number): BackgroundColorBuilder {
    this.opacity = opacity
    return this
  }

  toString(): BackgroundColor {
    if (!this.opacity) return this.color
    return `${this.color} bg-opacity-${this.opacity}`
  }
}

export type Lightness = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

/*export class BackgroundColorBuilderHelper {
  private color: BackgroundColorWithoutOpacity | null = null
  private opacity: number | null = null

  withLightness(light: Lightness) {
    if (light) this.color = `bg-blue-${light}`
    else this.color = `bg-blue-500`
    return this
  }

  blue() {
    this.color = `bg-blue-500`
    return this
    // }
  }

  addOpacity(opacity: number) {
    this.opacity = opacity
    return this
  }

  toString() {
    if (!this.opacity) return this.color
    return `${this.color} bg-opacity-${this.opacity}`
  }
}*/

export interface BackgroundColorBuilderHelper {
  withLightness: (light: Lightness) => BackgroundColorBuilderV2
  blue: () => BackgroundColorBuilderV2
  addOpacity: (opacity: number) => BackgroundColorBuilderV2
  toString: () => BackgroundColor
}

export class BackgroundColorBuilderV2 {
  private color: BackgroundColorWithoutOpacity | null = null
  private opacity: number | null = null
  private withLightness = (light: Lightness) => {
    this.color = `bg-blue-${light}`
return this
}

  blue() {
    this.color = `bg-blue-500`
    return {
      ...this,
      withLightness: (light: Lightness) => this.withLightness(light),
    } as BackgroundColorBuilderHelper
  }

  addOpacity(opacity: number) {
    this.opacity = opacity
    return this
  }

  toString() {
    if (!this.opacity) return this.color
    return `${this.color} bg-opacity-${this.opacity}`
  }

/*  private withLightness(lightness: Lightness) {
    if (lightness) this.color = `bg-blue-${lightness}`
    else this.color = `bg-blue-500`
    return this
  }*/
}

export const BgColorBuilderV2 = () => new BackgroundColorBuilderV2()
BgColorBuilderV2().blue().withLightness(500).addOpacity(50).toString()
const hi = BgColorBuilderV2().blue()
// BgColorBuilderV2().blue(500).addOpacity(50).toString()
// BgColorBuilderV2().blue().
// BgColorBuilderV2().blue().
