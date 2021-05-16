export function FormatNumber (num: number): string {
	if (num === 0) return num.toString();

	const reg = /(^[+-]?\d+)(\d{3})/;
	let n = num.toString();
	while (reg.test(n)) n = n.replace(reg, "$1,$2");

	return n;
}

export function Extend (): void {
	if (!Array.prototype.gap) {
		Array.prototype.gap = function <T> (this: T[], e: T): T[] {
			const ret: T[] = [];
			this.forEach((x, i) => {
				if (i > 0) ret.push(e);
				ret.push(x);
			});
			return ret;
		};
	}
}

const alphabetTable = "ABCDEFGHIJKLMNOPQTSTUVWXYZ";
export function BuildAlphabetKey (index: number): string {
	const list: string[] = [];
	while (index >= alphabetTable.length) {
		const offset = index % alphabetTable.length;
		list.push(alphabetTable[offset]);
		index = Math.floor(index / alphabetTable.length);
	}
	list.push(alphabetTable[index]);
	return list.reverse().join("");
}

export function SafeInteger (value: string | number, def: number = 0): number {
	if (typeof value === "string") {
		const v = parseInt(value, 10);
		if (isNaN(v)) return def;
		return v;
	}
	if (isNaN(value)) return def;
	return value;
}
