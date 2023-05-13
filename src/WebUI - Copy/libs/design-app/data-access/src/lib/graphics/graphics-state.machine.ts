import { GraphicsStateEvent } from './graphics-state.types'
import { createMachine } from 'xstate'

export type GraphicsSettingsContext = {
	createPreviewEnabled: boolean
	nearbyLinesEnabled: boolean
}

export const InitialGraphicsSettingsContext: GraphicsSettingsContext = {
	createPreviewEnabled: true,
	nearbyLinesEnabled: true,
}

export const graphicsStateMachine = createMachine(
	{
		tsTypes: {} as import('./graphics-state.machine.typegen').Typegen0,
		type: 'parallel',
		schema: {
			context: {} as GraphicsSettingsContext,
			events: {} as GraphicsStateEvent,
		},
		context: InitialGraphicsSettingsContext,
		id: 'GraphicsMenu',
		states: {
			CreatePreviewState: {
				initial: 'CreatePreviewEnabled',
				states: {
					CreatePreviewEnabled: {
						on: {
							CreatePreviewToggle: {
								target: 'CreatePreviewDisabled',
								actions: (ctx) => (ctx.createPreviewEnabled = false),
							},
						},
					},
					CreatePreviewDisabled: {
						on: {
							CreatePreviewToggle: {
								target: 'CreatePreviewEnabled',
								actions: (ctx) => (ctx.createPreviewEnabled = true),
							},
						},
					},
				},
			},
			NearbyLinesState: {
				initial: 'NearbyLinesEnabled', // initial: 'CenterLineBetweenTwoEntities',
				states: {
					NearbyLinesEnabled: {
						initial: 'CenterLineBetweenTwoEntities',
						on: {
							NearbyLinesToggle: {
								target: 'NearbyLinesDisabled',
								actions: (ctx) => (ctx.nearbyLinesEnabled = false),
							},
						},
						states: {
							CenterLineBetweenTwoEntities: {
								on: {
									SelectCenterLineScreenSize: {
										target: 'CenterLineScreenSize',
									},
									SelectTwoSideAxisLines: {
										target: 'TwoSideAxisLines',
									},
								},
							},
							CenterLineScreenSize: {
								on: {
									SelectCenterLineBetweenTwoEntities: {
										target: 'CenterLineBetweenTwoEntities',
									},
									SelectTwoSideAxisLines: {
										target: 'TwoSideAxisLines',
									},
								},
							},
							TwoSideAxisLines: {
								on: {
									SelectCenterLineBetweenTwoEntities: {
										target: 'CenterLineBetweenTwoEntities',
									},
									SelectCenterLineScreenSize: {
										target: 'CenterLineScreenSize',
									},
								},
							},
						},
					},
					NearbyLinesDisabled: {
						on: {
							NearbyLinesToggle: {
								target: 'NearbyLinesEnabled',
								actions: (ctx) => (ctx.nearbyLinesEnabled = true),
							},
						},
					},
				},
			},
		},
		predictableActionArguments: true,
		preserveActionOrder: true,
	},
	{
		actions: {},
		guards: {},
	},
)