// https://stackoverflow.com/questions/66123016/interpolate-between-two-colours-based-on-a-percentage-value
export function interpolate(color1, color2, percent) {
	// Convert the hex colors to RGB values
	const r1 = parseInt(color1.substring(1, 3), 16);
	const g1 = parseInt(color1.substring(3, 5), 16);
	const b1 = parseInt(color1.substring(5, 7), 16);

	const r2 = parseInt(color2.substring(1, 3), 16);
	const g2 = parseInt(color2.substring(3, 5), 16);
	const b2 = parseInt(color2.substring(5, 7), 16);

	// Interpolate the RGB values
	const r = Math.round(r1 + (r2 - r1) * percent);
	const g = Math.round(g1 + (g2 - g1) * percent);
	const b = Math.round(b1 + (b2 - b1) * percent);

	// Convert the interpolated RGB values back to a hex color
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export default { interpolate };
