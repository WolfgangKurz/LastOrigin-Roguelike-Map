import { FunctionalComponent } from "preact";

import { RogueMap } from "@/types/Map";
import { BuildAlphabetKey } from "@/libs/Functions";

import style from "./style.scss";

interface MapTableProps {
	data: RogueMap;
}

const alphabetTable = "ABCDEFGHIJKLMNOPQTSTUVWXYZ";

function ConvertName (cell: string): string {
	switch (cell) {
		case "s":
			return "시작";
		default:
			if (/^q[0-9]$/.test(cell))
				return ""; // "퀘스트";

			else if (/^m[0-9a-z]$/.test(cell))
				return ""; // "경비대";
			else if (/^M[0-9a-z]$/.test(cell))
				return ""; // "문지기";

			else if (/^B[0-9]$/.test(cell))
				return ""; // "컨테이너";

			else if (/^f[0-9]$/.test(cell))
				return ""; // "소이탄 저장고";
			else if (/^i[0-9]$/.test(cell))
				return ""; // "냉매 보관소";
			else if (/^l[0-9]$/.test(cell))
				return ""; // "고전류 발전 시설";

			else if (/^d[0-9]$/.test(cell))
				return ""; // "혼돈 엔트로피";
			else if (/^p[0-9]$/.test(cell))
				return ""; // "고준위 방사능";
			else if (/^t[0-9]$/.test(cell))
				return ""; // "지뢰 지대";

			else if (/^S[0-9a-z]$/.test(cell))
				return ""; // "상점";
			else if (/^a[0-9]$/.test(cell))
				return ""; // "아군";
			else if (/^k[0-9]$/.test(cell))
				return ""; // "PECS키";
			else if (/^h[0-9]$/.test(cell))
				return ""; // "공기 정화 시설";
			else if (/^o[0-9]$/.test(cell))
				return ""; // "관측소";
			else if (/^r[0-9]$/.test(cell))
				return ""; // "회복";
			else if (/^e[0-9]$/.test(cell))
				return ""; // "군수 공장";
			else if (/^T[0-9a-z]$/.test(cell))
				return ""; // "추적자";
	}
	return cell;
}

const MapTable: FunctionalComponent<MapTableProps> = (props) => {
	const { size: [width, height], data } = props.data;

	const table: string[][] = [];
	for (let j = 0; j < height; j++) {
		table[j] = [];
		for (let i = 0; i < width; i++)
			table[j][i] = data[j * width + i];
	}

	return <table class={ style.MapTable }>
		<tbody>
			{ table.map((row, y) => <tr>
				<td data-type="grid">{ alphabetTable[y] }</td>
				{ row.map(col => <td data-type={ col }>
					<span>{ ConvertName(col) }</span>
				</td>) }
			</tr>) }
			<tr>
				{ new Array(width + 1)
					.fill(0)
					.map((_, x) => <td data-type="grid">{ x === 0 ? <></> : x }</td>)
				}
			</tr>
		</tbody>
	</table>;
};
export default MapTable;
