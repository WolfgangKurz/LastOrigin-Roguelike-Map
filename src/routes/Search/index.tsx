import { FunctionalComponent } from "preact";
import { Link } from "preact-router";

import { RogueFloor, RogueMap } from "@/types/Map";

import { objState } from "@/libs/State";
import { BuildAlphabetKey } from "@/libs/Functions";
import MapExplorer from "@/libs/MapExplorer";

import Loader, { GetJson } from "@/components/Loader";
import Step from "@/components/Step";
import SearchTable from "@/components/SearchTable";

import style from "./style.scss";
import { hasCell, normalizeCell, ParseCell } from "@/libs/Map";

interface RogueMapEx extends RogueMap {
	index: number;
}

const Search: FunctionalComponent = () => {
	const Steps = ["시작", "층 선택", "시작 선택", "조각 선택", "완료"];
	const nodeEntities = "boqBSaremMdptfilhk".split("");

	const currentStep = objState(0);

	const targetFloor = objState(0);
	const targetStart = objState<string>("");

	const targetList = objState<RogueMapEx[]>([]);
	const explorerObj = objState<MapExplorer>(new MapExplorer());
	const explorer = explorerObj.value;

	const updator = objState(false);

	const refresh = (): void => updator.set(!updator.value);

	return <div class="search">
		<h1>조각으로 지도 찾기</h1>

		<Step class="my-4" list={ Steps } current={ currentStep.value } />

		<div class="content pt-4">
			{ currentStep.value === 0
				? <>
					<h3 class="mb-2">어서오세요!</h3>

					<div>알고있는 구역 정보를 조합해서 일치하는 지도를 찾을 수 있습니다.</div>
					<div class="mt-5">
						<button
							class="btn btn-primary "
							onClick={ (e): void => {
								e.preventDefault();
								currentStep.set(1);
							} }
						>찾기</button>
					</div>
				</>
				: <></>
			}
			{ currentStep.value === 1
				? <>
					<h3 class="mb-2">찾으려는 층은?</h3>

					<div class="row row-cols-3 row-cols-sm-4 row-cols-md-5 mt-5">
						{ new Array(24)
							.fill(0)
							.map((_, i) => <div class="p-3">
								<button
									class={ `btn btn-${i % 5 === 4 ? "danger" : "dark"} w-100 py-3` }
									onClick={ (e): void => {
										e.preventDefault();
										targetFloor.set(i + 1);
										currentStep.set(2);
									} }
								>{ i + 1 }층</button>
							</div>)
						}
					</div>
				</>
				: <></>
			}

			{ currentStep.value >= 2
				? <Loader
					json={ `json/${targetFloor.value}` }
					loading={ <div class="text-center text-secondary">지도 데이터를 불러오고 있습니다...</div> }
					content={ (): preact.VNode => <>
						{ currentStep.value === 2
							? ((): preact.VNode => {
								const floorData = GetJson<RogueFloor>(`json/${targetFloor.value}`)
									.map((d, i) => ({ ...d, index: i }) as RogueMapEx);

								const candidates = floorData
									.map(el => MapExplorer.availableShape(el))
									.reduce((p, c) => p.includes(c) ? p : [...p, c], [] as string[]);

								return <>
									<h3 class="mb-2">시작 위치의 모양은?</h3>
									<div>시작 위치의 모양을 선택해주세요.</div>

									<div class="row row-cols-4 justify-content-center mt-5">
										{ candidates.map(c => {
											const parts = c.split(",");
											const data = "nnnnsnnnn".split("");
											if (parts.includes("l")) data[1] = "b";
											if (parts.includes("r")) data[5] = "b";
											if (parts.includes("bl")) data[3] = "b";
											if (parts.includes("br")) data[7] = "b";

											return <div class="col my-1">
												<SearchTable
													class={ style.StartSelector }
													data={ { size: [3, 3], data } }
													cursor={ [-2, -2] }
													onClick={ (): void => {
														explorer.setShape(c);
														targetList.set(floorData.filter(el => explorer.matches(el)));
														targetStart.set(c);
														currentStep.set(3);
													} }
												/>
											</div>;
										}) }
									</div>
								</>;
							})()
							: <></>
						}
						{ currentStep.value === 3
							? ((): preact.VNode => {
								return <>
									<div class="mb-3">
										현재 <strong class="text-primary">{ targetList.value.length }</strong>개의 지도 후보가 있습니다.
									</div>

									<h3 class="mb-2">조각 모양은?</h3>

									{ !explorer.last
										? <>
											<div>이동할 위치를 선택해주세요.</div>

											<div class="row row-cols-4 justify-content-center mt-5">
												{ explorer.available.map(d => {
													const data = explorer.get;
													const pos = explorer.relativePos(data);

													switch (d) {
														case "l": pos[1]--; break;
														case "r": pos[0]++; break;
														case "bl": pos[0]--; break;
														case "br": pos[1]++; break;
													}

													return <div class="col my-1">
														<SearchTable
															class={ style.StartSelector }
															data={ data }
															cursor={ pos }
															onClick={ (): void => {
																explorer.move(d);
																refresh();
															} }
														/>
													</div>;
												}) }
											</div>
										</>
										: explorer.node === "?"
											? <>
												<div>표시된 위치의 종류를 선택해주세요.</div>

												<div class="mt-5 text-center">
													<SearchTable
														class={ style.StartSelector }
														data={ explorer.get }
														cursor={ explorer.relativePos(explorer.get) }
													/>
												</div>

												<div class="mt-5 text-center">
													{ nodeEntities
														.filter(n => {
															const from = normalizeCell(ParseCell(n));
															return targetList.value.some(el => {
																const pos = explorer.relativePos(el);
																const w = el.size[0];
																const idx = pos[1] * w + pos[0];
																const parsed = normalizeCell(ParseCell(el.data[idx]));
																return parsed.join("") === from.join("");
															});
														})
														.map(n => <SearchTable
															class={ `${style.StartSelector} m-2` }
															data={ { size: [1, 1], data: [n] } }
															cursor={ [-2, -2] }
															onClick={ (): void => {
																explorer.setNode(n);
																targetList.set(targetList.value.filter(el => explorer.matches(el)));
																if (targetList.value.length <= 1)
																	currentStep.set(4);
															} }
														/>) }
												</div>
											</>
											: <>
												<div>표시된 위치의 모양을 선택해주세요.</div>

												<div class="mt-5 text-center">
													<SearchTable
														class={ style.StartSelector }
														data={ explorer.get }
														cursor={ explorer.relativePos(explorer.get) }
													/>
												</div>

												<div class="row row-cols-1 row-cols-md-3 mt-5">
													{ targetList.value.map(el => MapExplorer.availableShape(el, explorer.relativePos(el)))
														.reduce((p, c) => p.includes(c) ? p : [...p, c], [] as string[])
														.map(c => {
															const parts = c.split(",");
															const data = "nnnn!nnnn".split("");
															if (parts.includes("l")) data[1] = "b";
															if (parts.includes("r")) data[5] = "b";
															if (parts.includes("bl")) data[3] = "b";
															if (parts.includes("br")) data[7] = "b";

															return <div class="col my-1">
																<SearchTable
																	class={ style.StartSelector }
																	data={ { size: [3, 3], data } }
																	cursor={ [-2, -2] }
																	onClick={ (): void => {
																		explorer.setShape(c);
																		refresh();
																		targetList.set(targetList.value.filter(el => explorer.matches(el)));
																		if (targetList.value.length <= 1)
																			currentStep.set(4);
																	} }
																/>
															</div>;
														}) }
												</div>
											</>
									}

									<div class="mt-5">현재 후보 목록</div>
									<div class="row row-cols-3 row-cols-sm-4 mt-2">
										{ targetList.value.map(x => <div class="col">
											<a
												class={ style.badgeLink }
												href={ `/list/${targetFloor.value}/${x.index}` }
												target="_blank"
												rel="noreferrer"
											>
												<SearchTable
													key={ `search-table-candidate-${targetFloor.value}-${x.index}` }
													data={ x }
													cursor={ [-2, -2] }
												/>
												<div class="mb-4">
													<span class="badge bg-dark">
														{ targetFloor.value }-{ BuildAlphabetKey(x.index) }
													</span>
												</div>
											</a>
										</div>) }
									</div>
								</>;
							})()
							: <></>
						}
						{ currentStep.value === 4
							? <>
								<h3 class="mb-2">검색 결과</h3>
								<div class="my-2">
									<button
										class="btn btn-primary mx-1"
										onClick={ (e): void => {
											e.preventDefault();

											currentStep.set(1);

											targetFloor.set(0);
											targetStart.set("");

											targetList.set([]);
											explorerObj.set(new MapExplorer());
										} }
									>층 선택으로</button>
									<button
										class="btn btn-primary mx-1"
										onClick={ (e): void => {
											e.preventDefault();

											currentStep.set(2);

											targetStart.set("");

											targetList.set([]);
											explorerObj.set(new MapExplorer());
										} }
									>같은 층 시작 선택으로</button>
								</div>

								{ targetList.value.length === 0
									? <div class="text-center text-secondary my-5">
										일치하는 지도를 찾을 수 없습니다.
									</div>
									: <div class="text-center mt-5">
										<h2>
											<a
												href={ `/list/${targetFloor.value}/${targetList.value[0].index}` }
												target="_blank"
												rel="noreferrer"
											>
												{ targetFloor.value }-{ BuildAlphabetKey(targetList.value[0].index) }
											</a>
										</h2>

										<SearchTable data={ targetList.value[0] } cursor={ [-2, -2] } />
									</div>
								}
							</>
							: <></>
						}
					</> }
				/>
				: <></>
			}
		</div>
	</div>;
};
export default Search;
