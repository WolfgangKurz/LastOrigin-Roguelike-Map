import { FunctionalComponent } from "preact";

import { RogueMap } from "@/types/Map";

import { objState } from "@/libs/State";
import { BuildAlphabetKey } from "@/libs/Functions";
import { hasCell, ParseCell } from "@/libs/Map";

import style from "./style.scss";

interface MapTableProps {
	data: RogueMap;
	meta: string;
}

interface Color {
	bg: string;
	text: string;
}

function ConvertName (cell: string): string {
	const cells = ParseCell(cell);

	if (hasCell("b", cells)) return "";
	if (hasCell("s", cells)) return "시작";

	if (hasCell("q", cells)) return ""; // "퀘스트";

	if (hasCell("m", cells)) return ""; // "경비대";
	if (hasCell("M", cells)) return ""; // "문지기";

	if (hasCell("B", cells)) return ""; // "컨테이너";

	if (hasCell("f", cells)) return ""; // "소이탄 저장고";
	if (hasCell("i", cells)) return ""; // "냉매 보관소";
	if (hasCell("l", cells)) return ""; // "고전류 발전 시설";

	if (hasCell("d", cells)) return ""; // "혼돈 엔트로피";
	if (hasCell("p", cells)) return ""; // "고준위 방사능";
	if (hasCell("t", cells)) return ""; // "지뢰 지대";

	if (hasCell("S", cells)) return ""; // "상점";
	if (hasCell("a", cells)) return ""; // "아군";
	if (hasCell("k", cells)) return ""; // "PECS키";
	if (hasCell("h", cells)) return ""; // "공기 정화 시설";
	if (hasCell("o", cells)) return ""; // "관측소";
	if (hasCell("r", cells)) return ""; // "회복";
	if (hasCell("e", cells)) return ""; // "군수 공장";
	if (hasCell("T", cells)) return ""; // "추적자";
	return cell;
}

function DrawGrid (ctx: CanvasRenderingContext2D, w: number, h: number): void {
	const size = Math.sqrt(Math.pow(60, 2) / 2);
	const xSize = Math.sqrt(Math.pow(w * 60, 2) / 2);
	const ySize = Math.sqrt(Math.pow(h * 60, 2) / 2);

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#b3b3b3";

	ctx.fillStyle = "#000000";

	ctx.font = "18px bold SpoqaHanSans";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.beginPath();
	for (let x = 0; x <= w; x++) { // ↖ 방향
		const x1 = 0 * size + x * size;
		const y1 = 0 * size - x * size;
		const x2 = h * size + x * size;
		const y2 = h * size - x * size;

		ctx.moveTo(size + x1, xSize + y1);
		ctx.lineTo(size + x2, xSize + y2);

		if (x > 0) {
			const px = h * size + (x - 1) * size;
			const py = h * size - (x - 1) * size;
			ctx.save();
			ctx.translate(px + size + size, py + xSize);
			ctx.rotate((-45 * Math.PI / 180));
			ctx.fillText(x.toString(), 0, 0);
			ctx.fillText(x.toString(), 1, 0);
			ctx.restore();
		}
	}
	for (let y = 0; y <= h; y++) { // ↗ 방향
		const x1 = y * size + 0 * size;
		const y1 = y * size - 0 * size;
		const x2 = y * size + w * size;
		const y2 = y * size - w * size;

		ctx.moveTo(size + x1, xSize + y1);
		ctx.lineTo(size + x2, xSize + y2);

		if (y > 0) {
			const px = (y - 1) * size + -1 * size;
			const py = (y - 1) * size - -1 * size;
			ctx.save();
			ctx.translate(px + size + size, py + xSize);
			ctx.rotate((-45 * Math.PI / 180));
			ctx.fillText(BuildAlphabetKey(y - 1), 0, 0);
			ctx.fillText(BuildAlphabetKey(y - 1), 1, 0);
			ctx.restore();
		}
	}
	ctx.stroke();
}

function DrawRotatedRectangle (ctx: CanvasRenderingContext2D, cell: string, x: number, y: number, w: number, h: number): void {
	// 0,0 => 좌측
	const size = Math.sqrt(Math.pow(60, 2) / 2);
	const xSize = Math.sqrt(Math.pow(w * 60, 2) / 2);
	const ySize = Math.sqrt(Math.pow(h * 60, 2) / 2);

	const px = y * size + x * size;
	const py = y * size - x * size;

	let color: Color = {
		bg: "#878787",
		text: "#000000",
	};

	if (cell === "n") { // 빈 칸
		ctx.save();
		ctx.translate(size + px, xSize + py);

		ctx.fillStyle = "#a6a6a6";
		ctx.textAlign = "center";

		ctx.font = "11px bold SpoqaHanSans";
		ctx.textBaseline = "bottom";
		ctx.fillText(`${BuildAlphabetKey(y)}${x + 1}`, size, size - 10);

		ctx.restore();
		return;
	}

	const cells = ParseCell(cell);

	if (hasCell("s,o", cells))
		color = { bg: "#0d6efd", text: "#FFFFFF" }; // primary
	else if (hasCell("q,B,S,a,r,e", cells))
		color = { bg: "#198754", text: "#FFFFFF" }; // success
	else if (hasCell("m,M", cells))
		color = { bg: "#dc3545", text: "#FFFFFF" }; // danger
	else if (hasCell("d,p", cells))
		color = { bg: "#6e196e", text: "#FFFFFF" }; // dark-alt
	else if (hasCell("t,f,i,l", cells))
		color = { bg: "#212529", text: "#FFFFFF" }; // dark
	else if (hasCell("h,k", cells))
		color = { bg: "#ffc107", text: "#000000" }; // warning
	else if (hasCell("b,T", cells))
		color = { bg: "#878787", text: "#FFFFFF" }; // gray

	ctx.fillStyle = color.bg;

	ctx.save();
	ctx.translate(size + px, xSize + py);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(size, -size);
	ctx.lineTo(size * 2, 0);
	ctx.lineTo(size, size);
	ctx.lineTo(0, 0);
	ctx.fill();

	ctx.fillStyle = color.text;
	ctx.textAlign = "center";

	ctx.font = "11px bold SpoqaHanSans";
	ctx.textBaseline = "bottom";
	ctx.fillText(`${BuildAlphabetKey(y)}${x + 1}`, size, size - 10);

	ctx.font = "14px bold SpoqaHanSans";
	ctx.textBaseline = "middle";
	ctx.fillText(ConvertName(cell), size, 0);
	ctx.restore();
}

function DrawNodeImage (ctx: CanvasRenderingContext2D, cell: string, x: number, y: number, w: number, h: number, sprite: HTMLImageElement): void {
	// 0,0 => 좌측
	const size = Math.sqrt(Math.pow(60, 2) / 2);
	const xSize = Math.sqrt(Math.pow(w * 60, 2) / 2);
	const ySize = Math.sqrt(Math.pow(h * 60, 2) / 2);

	const px = y * size + x * size;
	const py = y * size - x * size;

	ctx.save();
	ctx.translate(size + px + (size * 2) / 2 - 30, xSize + py - size + 4);

	const cells = ParseCell(cell);

	// case "n": // 도달 불가
	// case "b": // 빈 노드

	// case "s": // 시작 노드
	if (hasCell("o", cells)) // 관측소
		ctx.drawImage(sprite, 0, 128, 64, 64, 0, 0, 60, 60);

	else if (hasCell("q", cells)) // 퀘스트
		ctx.drawImage(sprite, 64, 128, 64, 64, 0, 0, 60, 60);
	else if (hasCell("B", cells)) // 컨테이너
		ctx.drawImage(sprite, 192, 0, 64, 64, 0, 0, 60, 60);
	else if (hasCell("S", cells)) // 상점
		ctx.drawImage(sprite, 192, 192, 64, 64, 0, 0, 60, 60);
	else if (hasCell("a", cells)) // 아군 획득
		ctx.drawImage(sprite, 0, 0, 64, 64, 0, 0, 60, 60);
	else if (hasCell("r", cells)) // 회복 스테이션
		ctx.drawImage(sprite, 128, 192, 64, 64, 0, 0, 60, 60);
	else if (hasCell("e", cells)) // 군수 공장
		ctx.drawImage(sprite, 64, 0, 64, 64, 0, 0, 60, 60);

	else if (hasCell("m", cells)) // 경비대
		ctx.drawImage(sprite, 128, 64, 64, 64, 0, 0, 60, 60);
	else if (hasCell("M", cells)) // 문지기
		ctx.drawImage(sprite, 192, 64, 64, 64, 0, 0, 60, 60);

	else if (hasCell("d", cells)) // 혼돈 엔트로피
		ctx.drawImage(sprite, 192, 128, 64, 64, 0, 0, 60, 60);
	else if (hasCell("p", cells)) // 고준위 방사능
		ctx.drawImage(sprite, 64, 192, 64, 64, 0, 0, 60, 60);
	else if (hasCell("t", cells)) // 지뢰 지대
		ctx.drawImage(sprite, 128, 128, 64, 64, 0, 0, 60, 60);
	else if (hasCell("f", cells)) // 소이탄 저장고
		ctx.drawImage(sprite, 0, 192, 64, 64, 0, 0, 60, 60);
	else if (hasCell("i", cells)) // 냉매 보관소
		ctx.drawImage(sprite, 128, 0, 64, 64, 0, 0, 60, 60);
	else if (hasCell("l", cells)) // 고전류 발전시설
		ctx.drawImage(sprite, 0, 64, 64, 64, 0, 0, 60, 60);

	else if (hasCell("h", cells)) // 공기 정화 시설
		ctx.drawImage(sprite, 256, 0, 64, 64, 0, 0, 60, 60);
	else if (hasCell("k", cells)) // PECS키
		ctx.drawImage(sprite, 64, 64, 64, 64, 0, 0, 60, 60);

	else if (hasCell("T", cells)) // 추적자
		ctx.drawImage(sprite, 256, 64, 41, 40, 10, 10, 41, 40);

	ctx.restore();
}

const MapTable: FunctionalComponent<MapTableProps> = (props) => {
	if (!props.data) return <></>;

	const { size: [mW, mH], data } = props.data;
	const result = objState("");

	const table: string[][] = [];
	for (let j = 0; j < mH; j++) {
		table[j] = [];
		for (let i = 0; i < mW; i++)
			table[j][i] = data[j * mW + i];
	}

	const size = Math.sqrt(Math.pow((mW + 1) * 60, 2) / 2) + Math.sqrt(Math.pow((mH + 1) * 60, 2) / 2);

	const canvas = document.createElement("canvas");
	if (!canvas) return <></>;

	canvas.width = size;
	canvas.height = size;

	if (!result.value) {
		new Promise<string>((resolve) => {
			const sprite = new Image();
			sprite.addEventListener("load", () => {
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.imageSmoothingEnabled = true;
					ctx.clearRect(0, 0, size, size);

					ctx.textBaseline = "top";
					ctx.font = "14px sans-serif";
					props.meta.split("\n")
						.forEach((row, i) => {
							ctx.fillStyle = "#FFF";
							ctx.fillText(row, 9, 9 + i * 20);
							ctx.fillText(row, 10, 9 + i * 20);
							ctx.fillText(row, 11, 9 + i * 20);
							ctx.fillText(row, 9, 10 + i * 20);
							ctx.fillText(row, 11, 10 + i * 20);
							ctx.fillText(row, 9, 11 + i * 20);
							ctx.fillText(row, 10, 11 + i * 20);
							ctx.fillText(row, 11, 11 + i * 20);

							ctx.fillStyle = "#000";
							ctx.fillText(row, 10, 10 + i * 20);
						});

					{ // Grid background
						const size = Math.sqrt(Math.pow(60, 2) / 2);
						const xSize = Math.sqrt(Math.pow(mW * 60, 2) / 2);

						ctx.fillStyle = "#FFF";
						ctx.save();
						ctx.translate(size, xSize);
						ctx.beginPath();
						ctx.moveTo(-size, size); // -1 0
						ctx.lineTo(mW * size, -mW * size); // w 0
						ctx.lineTo((mH + 1) * size + mW * size, (mH + 1) * size - mW * size); // w h+1
						ctx.lineTo((mH + 1) * size - size, (mH + 1) * size + size); // -1 h+1
						ctx.lineTo(-size, size);
						ctx.fill();
						ctx.restore();
					}

					table.forEach((row, y) => {
						row.forEach((col, x) => {
							DrawRotatedRectangle(ctx, col, x, y, mW, mH);
						});
					});
					DrawGrid(ctx, mW, mH);

					table.forEach((row, y) => {
						row.forEach((col, x) => {
							DrawNodeImage(ctx, col, x, y, mW, mH, sprite);
						});
					});

					canvas.toBlob((blob) => {
						const url = URL.createObjectURL(blob);
						resolve(url);
					});
				} // ctx
			});
			sprite.src = "/assets/icons/sprite.png";
		}).then(x => result.set(x));
	}

	if (!result.value) return <></>;
	return <img
		class={ style.MapTable }
		src={ result.value }
		onLoad={ (): void => URL.revokeObjectURL(result.value) }
	/>;
};
export default MapTable;
