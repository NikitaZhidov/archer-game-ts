import { IGameObserver } from './IGameObserver';

export interface IGameObservable {
	readonly gameObservers: IGameObserver[];
	drawGameObservers: () => void;
	registerGameObserver: (obs: IGameObserver) => Promise<void>;
	registerGameObservers?: (observers: IGameObserver[]) => Promise<void>;
	init: () => Promise<void>;
}
