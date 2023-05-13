export {}

declare global {
  interface String {
    toPascalCase(): string
  }
}

String.prototype.toPascalCase = function (this: string): string {
  const words = this.split(/[\W_]+/)
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  return capitalizedWords.join('')
}
