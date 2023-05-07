module.exports = {
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['ui-sans-serif', 'system-ui'],
				serif: ['ui-serif', 'Georgia'],
				mono: ['ui-monospace', 'SFMono-Regular'],
				display: ['Oswald'],
				body: ['"Open Sans"'],
				consolas: ['"Consolas"'],
				roboto: ['"Roboto"'],
				'cascadia-code': ['"Cascadia Code"'],
				// 'cascadia-mono': ['"Cascadia Mono"'],
				// 'cascadia-pl': ['"Cascadia PL"'],
				// 'cascadia-mono-pl': ['"Cascadia Mono PL"'],
				helvetica: ['"Helvetica"'],
				// 'helvetica-neue': ['"Helvetica Neue"'],
				// 'helvetica-std': ['"Helvetica Std"'],

				// ctx.font = '10px Roboto, sans-serif'
				// ctx.font = '10px Helvetica, sans-serif'
				// ctx.font = '10px Cascadia Code, sans-serif'
			},
			/*			spacing: {
							px: '1px',
							0: '0',
							0.5: '0.125rem',
							1: '0.25rem',
							1.5: '0.375rem',
							2: '0.5rem',
							2.5: '0.625rem',
							3: '0.75rem',
							3.5: '0.875rem',
							4: '1rem',
							5: '1.25rem',
							6: '1.5rem',
							7: '1.75rem',
							8: '2rem',
							9: '2.25rem',
							10: '2.5rem',
							11: '2.75rem',
							12: '3rem',
							14: '3.5rem',
							16: '4rem',
							20: '5rem',
							24: '6rem',
							28: '7rem',
							32: '8rem',
							36: '9rem',
							40: '10rem',
							44: '11rem',
							48: '12rem',
							52: '13rem',
							56: '14rem',
							60: '15rem',
							64: '16rem',
							72: '18rem',
							80: '20rem',
							96: '24rem',
						},*/
			colors: {
				primaryV2: {
					light: '#5eead4',
					DEFAULT: '#14b8a6',
					dark: '#0f766e',
				},
				secondaryV2: {
					light: '#bae6fd',
					DEFAULT: '#0ea5e9',
					dark: '#0369a1',
				},
				primary: {
					'50': '#eff6ff',
					'100': '#dbeafe',
					'200': '#bfdbfe',
					'300': '#93c5fd',
					'400': '#60a5fa',
					'500': '#3b82f6',
					'600': '#2563eb',
					'700': '#1d4ed8',
					'800': '#1e40af',
					'900': '#1e3a8a',
				},
				white: '#ffffff',
				black: '#000000',
				lightGlowGreen: '#b6e696',
				darkPurple: '#a95ea3',
				warmRed: '#dc3a70',
				darkBlue: '#1686cd',
				// white: '#FCF6F5FF',
				skyBlue: '#89ABE3FF',
				transparent: 'transparent',
				current: 'currentColor',
				purple: '#3f3cbb',
				midnight: '#121063',
				metal: '#565584',
				tahiti: '#3ab7bf',
				silver: '#ecebff',
				'bubble-gum': '#ff77e9',
				bermuda: '#78dcca',
			},
			translate: {
				'1/7': '14.2857143%',
				'2/7': '28.5714286%',
				'3/7': '42.8571429%',
				'4/7': '57.1428571%',
				'5/7': '71.4285714%',
				'6/7': '85.7142857%',
			},
			animation: {
				wiggle: 'wiggle 1s ease-in-out infinite',
				enter: 'enter 1s ease-in-out',
				leave: 'leave 1s ease-in-out',
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				enter: {
					'0%': { transform: 'translate-x-full' },
					'100%': { transform: 'translate-x-0' },
				},
				leave: {
					'0%': { transform: 'translate-x-0' },
					'100%': { transform: 'translate-x-full' },
				},
			},
		},
	},
	important: true,
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('flowbite/plugin'),
	],
	content: ['../../.node_modules/flowbite/**/*.js'],
}
//
// Entering: "transform transition ease-in-out duration-500 sm:duration-700"
// From: "translate-x-full"
// To: "translate-x-0"
// Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
// From: "translate-x-0"
// To: "translate-x-full"
