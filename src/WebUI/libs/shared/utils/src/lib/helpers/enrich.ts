export const enrich =
  ({ match, extract = [], source = [] }: { match: any; extract: any[]; source: any[] }) =>
  (inputObj: any) => {
    if (!match) return inputObj
    if (!extract?.length) return inputObj
    if (!source) return inputObj
    if (!source?.length) return inputObj
    const matchingItem = source.find((s) => s[match.sourceKey] === inputObj[match.inputKey])
    if (!matchingItem) return inputObj
    return extract.reduce((acc, key) => {
      return {
        ...acc,
        [key]: matchingItem[key],
      }
    }, inputObj)
  }
