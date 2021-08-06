import { IMap } from '../../../Map/interfaces';
import { IGameObserver } from '../../../shared/interfaces';

export interface IGameConfig {
	widthInBlocks: number;
	heightInBlocks: number;
	map: IMap & IGameObserver,
}