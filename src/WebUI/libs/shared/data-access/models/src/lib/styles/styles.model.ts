export const StyleName = {
  BackgroundColor: 'background-color',
  // BorderColor: 'border-color',
}

export type StyleName = (typeof StyleName)[keyof typeof StyleName]

// const stylees: StyleName = 'backgroundColor'
