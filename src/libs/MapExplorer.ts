import { RogueMap } from "@/types/Map";
import { hasCell, normalizeCell, ParseCell } from "./Map";

export default class MapExplorer {
	private data: Record<number, Record<number, string>> = {};
	private cursor: [number, number] = [0, 0];
	private lastMove: "l" | "r" | "bl" | "br" | "" = "";

	public static availableShape (el: RogueMap, offset?: [number, number]): string {
		let x: number;
		let y: number;

		const [_w, _h] = el.size;
		if (!offset) {
			const startOffset = el.data.findIndex(r => r === "s");

			x = startOffset % _w;
			y = Math.floor(startOffset / _w);
		} else {
			x = offset[0];
			y = offset[1];
		}

		const list: string[] = [];
		if (y > 0) {
			const left = el.data[(y - 1) * _w + x];
			if (left !== "n") list.push("l");
		}
		if (x < _w - 1) {
			const right = el.data[y * _w + (x + 1)];
			if (right !== "n") list.push("r");
		}
		if (x > 0) {
			const bleft = el.data[y * _w + (x - 1)];
			if (bleft !== "n") list.push("bl");
		}
		if (y < _h - 1) {
			const bright = el.data[(y + 1) * _w + x];
			if (bright !== "n") list.push("br");
		}
		return list.join(",");
	}

	constructor () {
		this.set(0, 0, "s");
	}

	public get pos () {
		return this.cursor;
	}

	public relativePos (el: RogueMap): [number, number] {
		const startOffset = el.data.findIndex(r => r === "s");
		const [_w, _h] = el.size;

		const x = startOffset % _w;
		const y = Math.floor(startOffset / _w);

		const [cx, cy] = this.cursor;
		console.log(cx, cy, x, y);
		return [cx + x, cy + y];
	}

	public get node (): string {
		return this.data[this.cursor[1]][this.cursor[0]];
	}

	public get last (): string {
		return this.lastMove;
	}

	public get available (): Array<"l" | "r" | "bl" | "br"> {
		const [x, y] = this.cursor;
		const list: Array<"l" | "r" | "bl" | "br"> = [];

		if (this.cellAvailable(x, y - 1)) list.push("l");
		if (this.cellAvailable(x + 1, y)) list.push("r");
		if (this.cellAvailable(x - 1, y)) list.push("bl");
		if (this.cellAvailable(x, y + 1)) list.push("br");
		return list;
	}

	private cellAvailable (x: number, y: number): boolean {
		if ((y in this.data) && (x in this.data[y])) {
			const cell = this.data[y][x];
			return (typeof cell !== "undefined" && cell !== "n");
		}
		return false;
	}

	public matches (el: RogueMap): boolean {
		const startOffset = el.data.findIndex(r => r === "s");
		const [_w, _h] = el.size;

		const x = startOffset % _w;
		const y = Math.floor(startOffset / _w);

		for (const dy in this.data) {
			for (const dx in this.data[dy]) {
				const dix = parseInt(dx, 10);
				const diy = parseInt(dy, 10);
				const cell = this.data[dy][dx];
				if (dix + x < 0 || diy + y < 0 || dix + x >= _w || diy + y >= _h) {
					if (cell === "n") continue;
					return false;
				}

				const index = (diy + y) * el.size[0] + (dix + x);

				const p1 = ParseCell(cell);
				const p2 = ParseCell(el.data[index]);

				if (hasCell("?", p1) && !hasCell("n", p2)) continue; // any 타입, n 만 아니면 됨

				if (hasCell("n", p1) || hasCell("n", p2)) { // n 이 있을거면 둘 다 있던가 없을거면 둘 다 없던가
					if (hasCell("n", p1) && hasCell("n", p2)) continue;
					return false;
				}

				const n1 = normalizeCell(p1).join("");
				const n2 = normalizeCell(p2).join("");
				if (n1 === n2) continue;
				return false;
			}
		}
		return true;
	}

	public setShape (shape: string): void {
		const parts = shape.split(",");
		this.lastMove = "";

		const [x, y] = this.cursor;
		if (parts.includes("l"))
			this.set(x, y - 1, "?");
		else
			this.set(x, y - 1, "n");

		if (parts.includes("r"))
			this.set(x + 1, y, "?");
		else
			this.set(x + 1, y, "n");

		if (parts.includes("bl"))
			this.set(x - 1, y, "?");
		else
			this.set(x - 1, y, "n");

		if (parts.includes("br"))
			this.set(x, y + 1, "?");
		else
			this.set(x, y + 1, "n");
	}

	public move (dir: "l" | "r" | "bl" | "br") {
		this.lastMove = dir;
		switch (dir) {
			case "l": this.cursor[1]--; break;
			case "r": this.cursor[0]++; break;
			case "bl": this.cursor[0]--; break;
			case "br": this.cursor[1]++; break;
		}
	}

	public setNode (node: string): void {
		const [x, y] = this.cursor;
		this.set(x, y, node);
	}

	public get get (): RogueMap {
		const lowestX = Object.values(this.data)
			.reduce((p, c) => Math.min(p, Object.keys(c).reduce((p1, c1) => Math.min(p1, parseInt(c1, 10)), 0)), 0);
		const highestX = Object.values(this.data)
			.reduce((p, c) => Math.max(p, Object.keys(c).reduce((p1, c1) => Math.max(p1, parseInt(c1, 10)), 0)), 0);

		const lowestY = Object.keys(this.data)
			.reduce((p, c) => Math.min(p, parseInt(c, 10)), 0);
		const highestY = Object.keys(this.data)
			.reduce((p, c) => Math.max(p, parseInt(c, 10)), 0);

		const w = highestX - lowestX + 1;
		const h = highestY - lowestY + 1;
		const arr = new Array(w * h);
		for (let i = lowestX; i <= highestX; i++) {
			for (let j = lowestY; j <= highestY; j++) {
				const index = (j - lowestY) * w + (i - lowestX);
				arr[index] = this.data[j][i] || "n";
			}
		}

		return {
			size: [w, h],
			data: arr,
		};
	}

	private set (x: number, y: number, cell: string) {
		if (!(y in this.data))
			this.data[y] = {};

		if (!(x in this.data[y]) || this.data[y][x] === "n" || this.data[y][x] === "?") // 없을 때에만
			this.data[y][x] = cell;
	}
}
