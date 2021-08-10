import { IPosition } from "../../shared/interfaces";
import { IMapSize } from "./IMapSize";

export interface IMapInfo {
	readonly map: boolean[][];
	readonly mapSize: IMapSize;
	startMapPosition: IPosition;
	endMapPosition: IPosition;
	emptyPlaces: IPosition[];
}
