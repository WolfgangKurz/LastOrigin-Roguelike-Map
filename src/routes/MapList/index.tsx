import Loader, { GetJson } from "@/components/Loader";
import MapTable from "@/components/MapTable";
import { BuildAlphabetKey, SafeInteger } from "@/libs/Functions";
import { objState } from "@/libs/State";
import { RogueFloor } from "@/types/Map";
import { FunctionalComponent } from "preact";
import { route } from "preact-router";

interface MapListProps {
	floorId?: string;
	mapId?: string;
}

const MapList: FunctionalComponent<MapListProps> = (props) => {
	const selectedMapIndex = objState<number>(props.mapId ? SafeInteger(props.mapId) : 0);

	if (props.floorId) {
		return <>
			<h1>{ props.floorId }층 지도</h1>

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
					const data = GetJson<RogueFloor>(`json/${props.floorId}`);

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
						<div style="margin-top:7em">
							<MapTable data={ data[selectedMapIndex.value] } />
						</div>
					</>;
				} } />
			</div>
		</>;
	}

	return <div class="map-list">
		<h1>전체 지도 목록</h1>

		<div class="row row-cols-4 row-cols-sm-5">
			{ new Array(24)
				.fill(0)
				.map((_, i) => <div class="p-3">
					<button
						class="btn btn-dark w-100 py-3"
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
