import { IGameObserver } from './IGameObserver';

export interface IGameObservable {
	readonly gameObservers: IGameObserver[];
	drawGameObservers: (frame: number) => void;
	init: () => Promise<void>;
}
