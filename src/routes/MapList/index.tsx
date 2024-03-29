import { FunctionalComponent } from "preact";
import { route } from "preact-router";

import { RogueFloor } from "@/types/Map";

import { objState } from "@/libs/State";
import { BuildAlphabetKey, SafeInteger } from "@/libs/Functions";

import Loader, { GetJson } from "@/components/Loader";
import MapTable from "@/components/MapTable";

import style from "./style.scss";

interface MapListProps {
	floorId?: string;
	mapId?: string;
}

const MapList: FunctionalComponent<MapListProps> = (props) => {
	const selectedMapIndex = objState<number>(props.mapId ? SafeInteger(props.mapId) : 0);
	const floorCount = objState<number>(0);

	if (props.floorId) {
		return <>
			<h1>{ props.floorId }층 지도</h1>
			<h4>총 {floorCount.value} 스테이지</h4>

			<div class="mb-3 text-start">
				<button
					class="btn btn-dark"
					onClick={ (e): void => {
						e.preventDefault();
						route("/list");
					} }>뒤로가기</button>
			</div>
			<div class="list">
				<Loader json={ `json/${props.floorId}` } content={ (): preact.VNode => {
					const ret = GetJson<RogueFloor>(`json/${props.floorId}`);
					const data = ret.list;
					floorCount.set(ret.count);

					return <>
						<div class="mb-4">
							{ data.map((x, i) => <button
								class={ `m-1 btn btn-outline-danger ${selectedMapIndex.value === i ? "active" : ""}` }
								onClick={ (e): void => {
									e.preventDefault();
									selectedMapIndex.set(i);
									route(`/list/${props.floorId}/${i}`);
								} }
							>{ BuildAlphabetKey(i) }</button>) }
						</div>

						<h3>{ props.floorId }층 - { BuildAlphabetKey(selectedMapIndex.value) }</h3>
						<div class={ style.MapTableWrapper }>
							<button
								class="btn btn-secondary"
								disabled={ selectedMapIndex.value <= 0 }
								onClick={ (e): void => {
									e.preventDefault();
									route(`/list/${props.floorId}/${selectedMapIndex.value - 1}`);
									selectedMapIndex.set(selectedMapIndex.value - 1);
								} }
							>◀</button>

							<div class={ style.MapCell }>
								<MapTable
									key={ `map-list-${props.floorId}-${selectedMapIndex.value}` }
									data={ data[selectedMapIndex.value] }
									meta={ [
										`${props.floorId}층 - ${BuildAlphabetKey(selectedMapIndex.value)}`,
										`${data[selectedMapIndex.value].size[0]} x ${data[selectedMapIndex.value].size[1]}`,
									].join("\n") }
								/>
							</div>

							<button
								class="btn btn-secondary"
								disabled={ selectedMapIndex.value >= data.length - 1 }
								onClick={ (e): void => {
									e.preventDefault();
									route(`/list/${props.floorId}/${selectedMapIndex.value + 1}`);
									selectedMapIndex.set(selectedMapIndex.value + 1);
								} }
							>▶</button>
						</div>
					</>;
				} } />
			</div>
		</>;
	}

	return <div class="map-list">
		<h1>전체 지도 목록</h1>

		<div class="row row-cols-3 row-cols-sm-4 row-cols-md-5">
			{ new Array(24)
				.fill(0)
				.map((_, i) => <div class="p-3">
					<button
						class={ `btn btn-${i % 5 === 4 ? "danger" : "dark"} w-100 py-3` }
						onClick={ (e): void => {
							e.preventDefault();
							selectedMapIndex.set(0);
							route(`/list/${i + 1}`);
						} }
					>{ i + 1 }층</button>
				</div>)
			}
		</div>
	</div>;
};
export default MapList;
