import { BehaviorSubject } from 'rxjs'
import { createMachine, interpret } from 'xstate'

export const DragBoxMachine = createMachine(
	{
		tsTypes: {} as import('./drag-box.xstate.typegen').Typegen0,
		id: 'New Machine',
		initial: 'Start',
		states: {
			Start: {
				on: {
					'Start Drag Box': {
						target: 'Drag Box Start Set',
						actions: ['sayHello'],
					},
					'Start Axis Line Drag Box': {
						target: 'Axis Line Drag Box Start Set',
					},
				},
			},
			'Drag Box Start Set': {
				on: {
					Reset: {
						target: 'Start',
					},
				},
			},
			'Axis Line Drag Box Start Set': {
				on: {
					Reset: {
						target: 'Start',
					},
				},
			},
		},
		schema: {
			events: {} as
				| {
						type: 'Start Drag Box'
				  }
				| {
						type: 'Start Axis Line Drag Box'
				  }
				| {
						type: 'Reset'
				  },
		},
		predictableActionArguments: true,
		preserveActionOrder: true,
	},
	{
		actions: {
			sayHello: (context, event) => {
				console.log('Toggled!', context, event)
			},
		},
	},
)

export const dragBoxMachineState = new BehaviorSubject(DragBoxMachine.initialState)
export type DragBoxMachineState = typeof dragBoxMachineState.value

export const getDragBoxMachineState = () => dragBoxMachineState.value
export const getDragBoxMachineState$ = dragBoxMachineState as {
	value: typeof dragBoxMachineState.value
	subscribe: typeof dragBoxMachineState.subscribe
}
export const DragBoxMachineService = interpret(DragBoxMachine).onTransition((state) => {
	console.log(state.value)
	dragBoxMachineState.next(state)
})

DragBoxMachineService.start()

getDragBoxMachineState$.subscribe((state) => {
	console.log(state)
})

createMachine(
	{
		initial: 'begging',
		states: {
			begging: {
				on: {
					'gets treat': {
						actions: 'makeHappySnufflingSound',
					},
				},
			},
		},
	},
	{
		actions: {
			makeHappySnufflingSound: () => {
				console.log('Snuffle snuffle snuffle')
			},
		},
	},
)
