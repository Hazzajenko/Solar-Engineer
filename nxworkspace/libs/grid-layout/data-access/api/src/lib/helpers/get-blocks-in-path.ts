export function getLocationsFrom2(locationOne: string, locationTwo: string): string[] {
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

  if (numberOneCol === numberTwoCol) {
    let goingUp: boolean
    goingUp = numberOneRow > numberTwoRow

    const directionBlocks = goingUp ? numberOneRow - numberTwoRow : numberTwoRow - numberOneRow

    let locationStrings: string[] = []

    for (let i = 0; i < directionBlocks; i++) {
      let customIndex = i * (goingUp ? -1 : 1)
      locationStrings[i] = `row${numberOneRow! + customIndex}col${numberOneCol}`
    }
    locationStrings.push(locationOne)
    locationStrings.push(locationTwo)
    return locationStrings
  } else if (numberOneRow === numberTwoRow) {
    let goingLeft: boolean
    goingLeft = numberOneCol > numberTwoCol

    const directionBlocks = goingLeft ? numberOneCol - numberTwoCol : numberTwoCol - numberOneCol

    let locationStrings: string[] = []

    for (let i = 0; i < directionBlocks; i++) {
      let customIndex = i * (goingLeft ? -1 : 1)
      locationStrings[i] = `row${numberOneRow}col${numberOneCol! + customIndex}`
    }
    locationStrings.push(locationOne)
    locationStrings.push(locationTwo)
    return locationStrings
  }
  return []
}
