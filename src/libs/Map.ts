export function hasCell (type: string, from: string[]): boolean {
	const types = type.split(",");
	return types.some(x => from.some(y => y.startsWith(x)));
}

export function ParseCell (cell: string): string[] {
	if (!cell) return [];

	return [cell];

	// const ret: string[] = [];
	// const buffer: string[] = [];
	// let cnt = 0;

	// for (let i = 0; i < cell.length; i++) {
	// 	const c = cell[i];

	// 	if (cnt > 0) {
	// 		buffer.push(c);
	// 		cnt--;

	// 		if (cnt === 0)
	// 			ret.push(buffer.splice(0, buffer.length).join(""));
	// 		continue;
	// 	}

	// 	switch (c) {
	// 		default:
	// 		case "s":
	// 		case "b":
	// 		case "n":
	// 			ret.push(c);
	// 			break;

	// 		case "o":
	// 		case "q":
	// 		case "B":
	// 		case "S":
	// 		case "a":
	// 		case "r":
	// 		case "e":
	// 		case "m":
	// 		case "M":
	// 		case "d":
	// 		case "p":
	// 		case "t":
	// 		case "f":
	// 		case "i":
	// 		case "l":
	// 		case "h":
	// 		case "k":
	// 			buffer.push(c);
	// 			cnt = 1;
	// 	}
	// }
	// if (buffer.length > 0)
	// 	ret.push(buffer.join(""));
	// return ret;
}

export function normalizeCell (cells: string[]): string[] {
	const ret: string[] = [];
	cells.forEach(x => {
		const c = x[0];
		if (c === "T") {
			ret.push("b");
			return;
		}
		ret.push(c);
	});
	return ret
		.reduce((p, c) => p.includes(c) ? p : [...p, c], [] as string[])
		.sort();
}
