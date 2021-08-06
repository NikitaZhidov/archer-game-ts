import { IGameConfig } from '../../core/Game';

export interface IGameObserver {
	draw: (ctx: CanvasRenderingContext2D) => void;
	init: (gameConfig: IGameConfig) => Promise<void>;
}
