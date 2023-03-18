import { inject, Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
  name: 'lineBreaksToHtml',
  standalone: true,
})
export class LineBreaksToHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer)

  transform(value: string): SafeHtml {
    const html = value.replace(/\n/g, '<br>')
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
