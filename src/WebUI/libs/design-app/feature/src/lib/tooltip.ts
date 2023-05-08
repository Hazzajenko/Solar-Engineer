export const createTooltipTemplate = (tooltip: string) => {
	return `<div class='absolute z-50 w-64 p-4 bg-white rounded shadow-xl'>
			<div class='flex flex-col'>
				<div class='flex flex-row justify-between'>
					<div class='flex flex-col'>
						<div class='text-sm font-semibold text-gray-800'>${tooltip}</div>
						<div class='text-xs text-gray-500'>${tooltip}</div>
					</div>
				</div>
			</div>
		</div>`
}

// const tooltip = 'tooltip'
export const createTooltipHtmlV2 = (tooltip: string) =>
	[
		"<div class='absolute z-50 w-min-fit p-2 bg-white rounded shadow-xl left-5'>" /*		"<div class='flex flex-col'>",
	 "<div class='flex flex-row justify-between'>",
	 "<div class='flex flex-col'>",*/,
		`<div class='text-sm font-semibold text-gray-800'>${tooltip}</div>`,
		`<!--<div class='text-xs text-gray-500'>${tooltip}</div>-->` /*		'</div>',
	 '</div>',
	 '</div>',*/,
		'</div>', // '</div>',
	].join(' ')
