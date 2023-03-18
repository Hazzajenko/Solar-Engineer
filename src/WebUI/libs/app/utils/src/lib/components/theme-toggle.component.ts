import { Component, OnDestroy, OnInit } from '@angular/core'

import { ThemeService } from '../services'
import { Subscription } from 'rxjs'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-theme-toggle',
  templateUrl: 'theme-toggle.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription | undefined = undefined

  constructor(readonly themeService: ThemeService) {}

  ngOnInit(): void {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) &&
        'matchMedia' in window &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.themeService.setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      this.themeService.setTheme('light')
      document.documentElement.classList.remove('dark')
    }

    this.themeSubscription = this.themeService.$theme.asObservable().subscribe((theme) => {
      localStorage.setItem('color-theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe()
  }
}
