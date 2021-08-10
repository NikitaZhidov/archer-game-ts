import { IGameObservable } from "../../GameObject";
import { IMapInfo } from "../../Map/interfaces";

export interface IGame extends IGameObservable {
	init: () => Promise<void>;
	start: () => void;
	stop: () => void;

	readonly mapInfo: IMapInfo;
}
