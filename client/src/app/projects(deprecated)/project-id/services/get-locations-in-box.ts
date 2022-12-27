export function getLocationsInBox(locationOne: string, locationTwo: string): string[] {
  let numberOneRow: number = 0
  let numberOneCol: number = 0

  const splitOne = locationOne.split('')
  splitOne.forEach((p, index) => {
    if (p === 'c') {
      const row = locationOne.slice(3, index)
      const col = locationOne.slice(index + 3, locationOne.length)
      numberOneRow = Number(row)
      numberOneCol = Number(col)
    }
  })
  let numberTwoRow: number = 0
  let numberTwoCol: number = 0
  const splitTwo = locationTwo.split('')
  splitTwo.forEach((p, index) => {
    if (p === 'c') {
      const row = locationTwo.slice(3, index)
      const col = locationTwo.slice(index + 3, locationTwo.length)
      numberTwoRow = Number(row)
      numberTwoCol = Number(col)
    }
  })
  let locationStrings: string[] = []
  let goingUp: boolean
  goingUp = numberOneRow > numberTwoRow

  const yDirectionBlocks = goingUp
    ? numberOneRow - numberTwoRow + 1
    : numberTwoRow - numberOneRow + 1

  let goingLeft: boolean
  goingLeft = numberOneCol > numberTwoCol
  const xDirectionBlocks = goingLeft
    ? numberOneCol - numberTwoCol + 1
    : numberTwoCol - numberOneCol + 1

  for (let i = 0; i < xDirectionBlocks; i++) {
    let xCustomIndex = i * (goingLeft ? -1 : 1)
    if (i === 0) {
      console.log(`row${numberOneRow}col${numberOneCol! + xCustomIndex}`)
    }
    locationStrings.push(`row${numberOneRow}col${numberOneCol! + xCustomIndex}`)
    for (let a = 0; a < yDirectionBlocks; a++) {
      let yCustomIndex = a * (goingUp ? -1 : 1)
      locationStrings.push(`row${numberOneRow! + yCustomIndex}col${numberOneCol! + xCustomIndex}`)
    }
  }
  return locationStrings
}
