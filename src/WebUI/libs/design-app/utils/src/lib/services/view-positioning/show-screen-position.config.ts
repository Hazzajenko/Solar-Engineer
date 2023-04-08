export const ShowScreenPositionMode = {
  ShowAlways: 'showAlways',
  ShowOnlyOnChanges: 'showOnlyOnChanges',
  ShowNever: 'showNever',
}

export type ShowScreenPositionMode =
  (typeof ShowScreenPositionMode)[keyof typeof ShowScreenPositionMode]

export type ShowScreenPositionConfig = {
  mode: ShowScreenPositionMode
  onChangesTimer: number
}

export const DefaultShowScreenPositionConfig: ShowScreenPositionConfig = {
  mode: ShowScreenPositionMode.ShowOnlyOnChanges,
  onChangesTimer: 5000,
}
