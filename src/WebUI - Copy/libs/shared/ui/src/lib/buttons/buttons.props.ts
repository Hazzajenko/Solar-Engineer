export type ButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const buttonSizeClasses: Record<ButtonSizes, string> = {
  xs: ' rounded py-1 px-2 text-xs',
  sm: ' rounded py-1 px-2 text-sm',
  md: ' rounded-md py-2 px-3 text-sm',
  lg: ' rounded-md py-2.5 px-3.5 text-sm',
  xl: ' rounded-md py-3 px-4 text-sm',
}

export type LightOrDark = 'light' | 'dark'
/*export const lightOrDarkClasses: Record<LightOrDark, string> = {
 light: ' bg-white/10 hover:bg-white/20'
 // light: ' text-gray-700 bg-gray-100 hover:bg-gray-200',
 // dark: ' text-gray-100 bg-gray-700 hover:bg-gray-600',
 }*/
export type DarkClasses = 'Primary' | 'Secondary'
export const darkClasses: Record<DarkClasses, string> = {
  Primary:
    ' bg-indigo-500 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  Secondary: ' bg-white/10 hover:bg-white/20',
}

export type LightClasses = 'Primary' | 'Secondary'
export const lightClasses: Record<LightClasses, string> = {
  Primary:
    ' bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
  Secondary: ' bg-white/10  text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50',
}

export type ButtonClasses = 'Primary' | 'Secondary'
export const buttonClasses: Record<ButtonClasses, string> = {
  Primary:
    ' font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-indigo-500',
  Secondary:
    ' font-semibold shadow-sm bg-white/10 text-gray-900 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
}

export const activeButtonClasses: Record<ButtonClasses, string> = {
  Primary:
    ' active:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:active:bg-indigo-600 dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-indigo-600',
  Secondary:
    ' active:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 dark:active:bg-white/30 dark:focus-visible:outline dark:focus-visible:outline-2 dark:focus-visible:outline-offset-2 dark:focus-visible:outline-white/20',
}
// bg-white py-2.5 px-3.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
// bg-indigo-600
// hover:bg-indigo-500
// focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
// bg-indigo-500
// hover:bg-indigo-400
// bg-indigo-500
// bg-white/10
// hover:bg-white/20
