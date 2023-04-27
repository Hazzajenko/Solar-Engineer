export function shadeColor(hex: string, percent: number) {
	const num = parseInt(hex.slice(1), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) + amt;
	const G = (num >> 8 & 0x00FF) + amt;
	const B = (num & 0x0000ff) + amt
	return `#${(0x1000000 + (R < 255
		? R < 1
			? 0
			: R
		: 255) * 0x10000 + (G < 255
		? G < 1
			? 0
			: G
		: 255) * 0x100 + (B < 255
		? B < 1
			? 0
			: B
		: 255)).toString(16)
		.slice(1)}`;
}