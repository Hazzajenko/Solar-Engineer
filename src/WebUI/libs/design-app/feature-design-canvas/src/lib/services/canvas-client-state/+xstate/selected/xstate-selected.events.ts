export type XStateSelectedEvent =
  | {
      type: 'ClickElsewhere'
      payload: null
    }
  | {
      type: 'CancelSelected'
      payload: null
    }
  | {
      type: 'ClickOnEntity'
      payload: {
        id: string
      }
    }
  | {
      type: 'SelectedMultipleEntities'
      payload: {
        ids: string[]
      }
    }
  | {
      type: 'ClickedOnDifferentEntity'
      payload: {
        id: string
      }
    }
  | {
      type: 'AddEntityToMultipleSelected'
      payload: {
        id: string
      }
    }
