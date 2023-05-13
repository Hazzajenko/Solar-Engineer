import { Component, inject, Input } from '@angular/core'
import { convertToObject } from '@shared/utils'
import { themes } from './themes'
import { HttpClient } from '@angular/common/http'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { map, Observable } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-icon-theme',
  template: `
    <!--    <div [innerHTML]="themes['Dark'].icon | toSafeHtml"></div>-->
    <!--    <div [innerHTML]="icon | toSafeHtml"></div>-->
    <div [innerHTML]="svgIcon$ | async"></div>

    <!--    <div [innerHTML]="svgIcon"></div>-->
  `,
  standalone: true,
  imports: [AsyncPipe],
})
export class IconThemeComponent {
  private http = inject(HttpClient)
  private sanitizer = inject(DomSanitizer)
  themes = convertToObject({ key: 'name', list: themes })
  selectedTheme = this.themes['Dark']
  svgIcon$: Observable<SafeHtml> = this.initIcon(this.selectedTheme.name)

  @Input() set theme(value: 'Dark' | 'Light' | 'System') {
    this.selectedTheme = this.themes[value]
    this.svgIcon$ = this.initIcon(this.selectedTheme.name)
  }

  initIcon(themeName: string) {
    return (this.svgIcon$ = this.http
      .get(`assets/themes/${themeName.toLowerCase()}-icon.svg`, {
        responseType: 'text',
      })
      .pipe(map((value) => this.sanitizer.bypassSecurityTrustHtml(value))))
  }
}
