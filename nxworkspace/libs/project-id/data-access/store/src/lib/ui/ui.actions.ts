import { createActionGroup, emptyProps } from '@ngrx/store'

export const UiActions = createActionGroup({
  source: 'Ui Store',
  events: {
    'Toggle Keymap': emptyProps(),
    'Turn Keymap On': emptyProps(),
    'Turn Keymap Off': emptyProps(),
  },
})
