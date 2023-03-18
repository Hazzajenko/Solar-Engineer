import { inject, Pipe, PipeTransform } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
  name: 'toSafeHtml',
  standalone: true,
})
export class ToSafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer)

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
