export const convertToObject = ({ key, list = [] }: { key: any; list: any[] }) => {
  if (!list || !list.length || !key) return undefined
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined)
  return Object.fromEntries(kvals.map((kval) => [kval, list.find((item) => item[key] === kval)]))
}
