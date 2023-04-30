import { Config } from './config.xstate'
import { createMachine, interpret } from 'xstate'

export const DragBoxMachine = createMachine(
	{
		/** @xstate-layout N4IgpgJg5mDOIC5QDkwHcAEBZAhgYwAsBLAOzADoBlAFxwCdqBiG+6jAETpygwCEB7AB4BtAAwBdRKAAO-WEWpF+JKSEGIAjAHYALABoQAT0QAmAMxmAvpYOpMuQqQosGzWgwwBBQUVgYAMk4cXDwCIhKqsvKKyqrqCNr6RppmJta26Nj4xGTknNx8QhgubJRgTABKcOVikkggUQpKKvXxZqKi5ACsZhomXQbGCQAcJt3pIHZZjrnevgFB+aFFJcXljFWwNRH1jTEtoG0d3b39g4jDGuMTJPwQcKpTDjlgkXJNsa2IALQAbOcIP4TJ7ZJxUdzUN7RZpxRA6EwAgCcZnIoi6wMyzzBS0KgmKELWkN2732sIQOmOpwGyQSiKuomGFiZzIsGgx9lBsx8fkCZGCBTC+NYhKhHwOajhlL61KGiM6DJZiqs1ksQA */
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
	/*   {
      actions: {
        sayHello: (context, event) => {
          console.log('Toggled!', context, event)
        },
      },
    }, */
).withConfig(Config)
/* .withConfig({
  actions: {
    sayHello: (context, event) => {
      console.log('Toggled!', context, event)
    },
  },
}) */

export const DragBoxMachineService = interpret(DragBoxMachine).onTransition((state) => {
	console.log(state.value)
})
