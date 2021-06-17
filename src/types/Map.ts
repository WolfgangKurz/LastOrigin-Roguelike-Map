export interface RogueMap {
	size: [number, number];
	data: string[];
}

export interface RogueFloor {
	count: number;
	list: RogueMap[];
}
