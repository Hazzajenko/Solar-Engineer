import { TransformedPoint } from 'deprecated/design-app/feature-design-canvas'

export type ViewStateDeprecated = {
	// canvas: HTMLCanvasElement
	// ctx: CanvasRenderingContext2D
	dragStart: TransformedPoint | undefined
}

export const InitialViewState: ViewStateDeprecated = {
	dragStart: undefined,
}
