import { Component } from '@angular/core'
import { themes } from './themes'
import { convertToObject } from '@shared/utils'
import { CommonModule } from '@angular/common'
import { IconThemeComponent } from './icon-theme.component'

@Component({
  selector: 'app-select-theme',
  templateUrl: 'select-theme.component.html',
  standalone: true,
  imports: [CommonModule, IconThemeComponent],
})
export class SelectThemeComponent {
  themes = themes
  themesObject = convertToObject({ key: 'name', list: themes })

  // themes = convertToObject({ key: 'name', list: themes })
  selectedTheme = this.themesObject['Dark']
  activeTheme = this.themesObject['Dark']
  isDarkMode = true

  constructor() {
    this.isDarkMode = this.activeTheme.name === 'Dark'
    const themeValue = (window.localStorage as any).theme ?? 'system'
    console.log('themeValue', themeValue)
    const colorTheme = localStorage.getItem('color-theme')
    console.log('colorTheme', colorTheme)

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
    console.log('isDarkMode', isDarkMode)
    const isDarkMode2 =
      !('color-theme' in localStorage) &&
      'matchMedia' in window &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log('isDarkMode2', isDarkMode2)
  }
}
