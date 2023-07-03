import { Injectable, signal } from '@angular/core'

export type Theme = 'dark' | 'light'

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	theme = signal<Theme>('light')

	setTheme(theme: Theme) {
		this.theme.set(theme)
	}

	toggleTheme() {
		this.theme.set(this.theme() === 'dark' ? 'light' : 'dark')
	}
}
