import { inject, Injectable } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

/*@Injectable({
  providedIn: 'root',
})*/
export class StringBuilder {
  private sanitizer = inject(DomSanitizer)
  private buffer: string[]

  constructor() {
    this.buffer = []
  }

  public append(value: string): void {
    this.buffer.push(value)
  }

  public appendLine(value: string): void {
    this.buffer.push(value + '\n')
  }

  public toString(): string {
    return this.buffer.join('')
  }

  /*  toHtmlString(): string {
      return this.buffer.map((value) => value.replace(/\n/g, '<br>')).join('')
    }*/
  public toHtmlString(): SafeHtml {
    const html = this.buffer.map((value) => value.replace(/\n/g, '<br>')).join('')
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
