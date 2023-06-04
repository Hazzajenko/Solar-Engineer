const TAILWIND_COLOR = {
	gray: {
		50: '#F9FAFB',
		100: '#F3F4F6',
		200: '#E5E7EB',
		300: '#D1D5DB',
		400: '#9CA3AF',
		500: '#6B7280',
		600: '#4B5563',
		700: '#374151',
		800: '#1F2937',
		900: '#111827',
	},
	red: {
		50: '#FEF2F2',
		100: '#FEE2E2',
		200: '#FECACA',
		300: '#FCA5A5',
		400: '#F87171',
		500: '#EF4444',
		600: '#DC2626',
		700: '#B91C1C',
		800: '#991B1B',
		900: '#7F1D1D',
	},
	orange: {
		50: '#FFF7ED',
		100: '#FFEDD5',
		200: '#FED7AA',
		300: '#FDBA74',
		400: '#FB923C',
		500: '#F97316',
		600: '#EA580C',
		700: '#C2410C',
		800: '#9A3412',
		900: '#7C2D12',
	},
	yellow: {
		50: '#FFFBEB',
		100: '#FEF3C7',
		200: '#FDE68A',
		300: '#FCD34D',
		400: '#FBBF24',
		500: '#F59E0B',
		600: '#D97706',
		700: '#B45309',
		800: '#92400E',
		900: '#78350F',
	},
	green: {
		50: '#ECFDF5',
		100: '#D1FAE5',
		200: '#A7F3D0',
		300: '#6EE7B7',
		400: '#34D399',
		500: '#10B981',
		600: '#059669',
		700: '#047857',
		800: '#065F46',
		900: '#064E3B',
	},
	teal: {
		50: '#F0FDFA',
		100: '#CCFBF1',
		200: '#99F6E4',
		300: '#5EEAD4',
		400: '#2DD4BF',
		500: '#14B8A6',
		600: '#0D9488',
		700: '#0F766E',
		800: '#115E59',
		900: '#134E4A',
	},
	blue: {
		50: '#EFF6FF',
		100: '#DBEAFE',
		200: '#BFDBFE',
		300: '#93C5FD',
		400: '#60A5FA',
		500: '#3B82F6',
		600: '#2563EB',
		700: '#1D4ED8',
		800: '#1E40AF',
		900: '#1E3A8A',
	},
	indigo: {
		50: '#EEF2FF',
		100: '#E0E7FF',
		200: '#C7D2FE',
		300: '#A5B4FC',
		400: '#818CF8',
		500: '#6366F1',
		600: '#4F46E5',
		700: '#4338CA',
		800: '#3730A3',
		900: '#312E81',
	},
	purple: {
		50: '#F5F3FF',
		100: '#EDE9FE',
		200: '#DDD6FE',
		300: '#C4B5FD',
		400: '#A78BFA',
		500: '#8B5CF6',
		600: '#7C3AED',
		700: '#6D28D9',
		800: '#5B21B6',
		900: '#4C1D95',
	},
	pink: {
		50: '#FDF2F8',
		100: '#FCE7F3',
		200: '#FBCFE8',
		300: '#F9A8D4',
		400: '#F472B6',
		500: '#EC4899',
		600: '#DB2777',
		700: '#BE185D',
		800: '#9D174D',
		900: '#831843',
	},
} as const

export default TAILWIND_COLOR

export type TailwindColor = (typeof TAILWIND_COLOR)[keyof typeof TAILWIND_COLOR]

export type TailwindColor500s = {
	[key in keyof typeof TAILWIND_COLOR]: (typeof TAILWIND_COLOR)[key][500]
}

export const TAILWIND_COLOUR_500: TailwindColor500s = {
	gray: '#6B7280',
	red: '#EF4444',
	orange: '#F97316',
	yellow: '#F59E0B',
	green: '#10B981',
	teal: '#14B8A6',
	blue: '#3B82F6',
	indigo: '#6366F1',
	purple: '#8B5CF6',
	pink: '#EC4899',
} as const

export const TAILWIND_COLOUR_500_KEYS = Object.keys(
	TAILWIND_COLOUR_500,
) as (keyof typeof TAILWIND_COLOUR_500)[]
export const TAILWIND_COLOUR_500_VALUES = Object.values(
	TAILWIND_COLOUR_500,
) as (typeof TAILWIND_COLOUR_500)[keyof typeof TAILWIND_COLOUR_500][]

export type TailwindColor500 = (typeof TAILWIND_COLOUR_500)[keyof typeof TAILWIND_COLOUR_500]

// export const tailwindColors = Object.values(TAILWIND_COLOR)

/*export const tailwindColors500s = tailwindColors.reduce((acc, curr, index) => {
 const colourName = Object.keys(curr)[index] as keyof TailwindColor500s
 acc[colourName] = curr[500]
 return acc
 }, {} as Record<keyof TailwindColor500s, TailwindColor500s[keyof TailwindColor500s]>)*/

// tailwindColors500s.green
/*
 export const tailwindColors500s2 = tailwindColors.reduce(
 (acc, curr) => {
 // acc[curr['500']] = curr['500']
 // acc.push(curr['500'])
 acc[curr['500']] = curr[500]

 return acc
 },
 {} as {
 [key in keyof typeof TAILWIND_COLOR]: (typeof TAILWIND_COLOR)[key][500]
 },
 )

 // tailwindColors500s.
 */
