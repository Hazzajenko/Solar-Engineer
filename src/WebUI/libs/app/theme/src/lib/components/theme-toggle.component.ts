import { Component, effect, inject, OnInit } from '@angular/core'

import { ThemeService } from '../services'
import { CommonModule } from '@angular/common'

@Component({
	selector: 'theme-toggle',
	templateUrl: 'theme-toggle.component.html',
	standalone: true,
	imports: [CommonModule],
})
export class ThemeToggleComponent implements OnInit {
	private _themeService = inject(ThemeService)
	private _themeChangeEffect = effect(() => {
		const theme = this._themeService.theme()
		if (theme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
		localStorage.setItem('color-theme', theme)
	})

	theme = this._themeService.theme

	ngOnInit(): void {
		if (
			localStorage.getItem('color-theme') === 'dark' ||
			(!('color-theme' in localStorage) &&
				'matchMedia' in window &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			this._themeService.setTheme('dark')
			document.documentElement.classList.add('dark')
		} else {
			this._themeService.setTheme('light')
			document.documentElement.classList.remove('dark')
		}
	}

	toggleTheme() {
		this._themeService.toggleTheme()
	}
}
