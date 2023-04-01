export class DelayedLogger {
  private timerId: ReturnType<typeof setTimeout> | undefined

  log(source: string, ...args: any[]) {
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
    this.timerId = setTimeout(() => {
      console.log(source, ...args)
      this.timerId = undefined
    }, 100) // delay in milliseconds, change as needed
  }
}
