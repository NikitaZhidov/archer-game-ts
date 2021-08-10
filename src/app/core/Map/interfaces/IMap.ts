import { IGameConfig } from "../../Game";
import { IGameObserver } from "../../GameObject";
import { IMapInfo } from "./IMapInfo";

export interface IMap extends IGameObserver{
	init: (gameConfig: IGameConfig) => Promise<IMapInfo>;
	reload: () => IMapInfo;
	readonly map: boolean[][];
}
