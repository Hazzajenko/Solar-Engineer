/*
import { Component, Input } from '@angular/core'

interface Theme {
  value: string
  name: string
  icon: any
}

@Component({
  selector: 'app-listbox',
  template: `
    <div [ngSwitch]='isOpen'>
      <button
        class='flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5'
        (click)='toggle()'
        [attr.aria-label]='selectedTheme?.name'
      >
        <app-light-icon
          class='hidden h-4 w-4 fill-sky-400'
          [class.block]="selectedTheme?.value === 'light'"
        ></app-light-icon>
        <app-dark-icon
          class='hidden h-4 w-4 fill-sky-400'
          [class.block]="selectedTheme?.value === 'dark'"
        ></app-dark-icon>
        <app-light-icon
          class='hidden h-4 w-4 fill-slate-400'
          [class.block]="selectedTheme?.value === 'system' && !isDarkMode"
        ></app-light-icon>
        <app-dark-icon
          class='hidden h-4 w-4 fill-slate-400'
          [class.block]="selectedTheme?.value === 'system' && isDarkMode"
        ></app-dark-icon>
      </button>
      <div
        *ngSwitchCase='true'
        class='absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5'
      >
        <div
          *ngFor='let theme of themes'
          class='flex cursor-pointer select-none items-center rounded-[0.625rem] p-1'
          [class.text-sky-500]='selectedTheme?.value === theme.value'
          [class.text-slate-900]='isActive(theme)'
          [class.dark:text-white]='isActive(theme) && isDarkMode'
          [class.text-slate-700]='!isActive(theme) && selectedTheme?.value !== theme.value'
          [class.dark:text-slate-400]='!isActive(theme) && isDarkMode && selectedTheme?.value !== theme.value'
          [class.bg-slate-100]='isActive(theme)'
          [class.dark:bg-slate-900
        /40]="isActive(theme) && isDarkMode"
        (click)="select(theme)"
        >
        <div
          class='rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5'
        >
          <app-dynamic-icon
            [icon]='theme.icon'
            class='h-4 w-4'
            [class.fill-sky-400]='selectedTheme?.value === theme.value'
            [class.dark:fill-sky-400]='selectedTheme?.value === theme.value && isDarkMode'
            [class.fill-slate-400]='selectedTheme?.value !== theme.value'
          ></app-dynamic-icon>
        </div>
        <div class='ml-3'>{{ theme.name }}</div>
      </div>
    </div>
    </div>
  `,
  standalone: true,
})
export class ListboxComponent {
  @Input() themes: Theme[] = []
}
*/
