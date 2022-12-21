export class NumberLocation {
  numberRow: number
  numberCol: number

  constructor(location: string) {
    let numberRow: number = 0
    let numberCol: number = 0
    const split = location.split('')
    split.forEach((p, index) => {
      if (p === 'c') {
        const row = location.slice(3, index)
        const col = location.slice(index + 3, location.length)
        numberRow = Number(row)
        numberCol = Number(col)
      }
    })
    this.numberRow = numberRow
    this.numberCol = numberCol
  }
}

function getLocationNumbersFromString(location: string): [number, number] {
  let numberRow: number = 0
  let numberCol: number = 0
  const split = location.split('')
  split.forEach((p, index) => {
    if (p === 'c') {
      const row = location.slice(3, index)
      const col = location.slice(index + 3, location.length)
      numberRow = Number(row)
      numberCol = Number(col)
    }
  })
  return [numberRow, numberCol]
}
