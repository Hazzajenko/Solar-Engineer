export type SelectedEntity = {
  id: string
  type: SelectedType
}

export const SELECTED_TYPE = {
  Panel: 'panel',
  String: 'string',
}

export type SelectedType = (typeof SELECTED_TYPE)[keyof typeof SELECTED_TYPE]
