import { IGameObservable, IGameObserver } from '../../../shared/interfaces';
import { EngineInfo } from '../../EngineInfo';
import { ICanvasSizeInfo } from '../../EngineInfo/interfaces';
import { IGame, IGameConfig } from '../interfaces';

export class Game implements IGameObservable, IGame {
	private _$canvas: HTMLCanvasElement;
	private _$context: CanvasRenderingContext2D | null = null;
	private _gameConfig: IGameConfig;

	readonly gameObservers: IGameObserver[] = [];

	constructor(canvasElementId: string, gameConfig: IGameConfig) {
		const $canvas = document.getElementById(canvasElementId);
		this._gameConfig = gameConfig

		if ($canvas && $canvas instanceof HTMLCanvasElement) {
			this._$canvas = $canvas;
		} else {
			throw new Error('canvasElementId must be id of HTMLCanvasElement')
		}
	}

	async init() {
		const canvasSize: ICanvasSizeInfo = EngineInfo.calculateCanvasSize(this._gameConfig);
		this._$canvas.height = canvasSize.height;
		this._$canvas.width = canvasSize.width;

		this._$context = this._$canvas.getContext('2d');

		if (!this._$context) {
			throw new Error('Failed to get canvas context in Game init')
		}

		await this.registerGameObserver(this._gameConfig.map);
	}

	async registerGameObserver(obs: IGameObserver) {
		this.gameObservers.push(obs);
		await obs.init(this._gameConfig);
	}

	async registerGameObservers(observers: IGameObserver[]) {
		for (let i = 0; i < observers.length; i++) {
			await this.registerGameObserver(observers[i]);
		}
	}

	drawGameObservers() {
		if (this._$context) {
			this.gameObservers.forEach((gameObserver) => {
				gameObserver.draw(<CanvasRenderingContext2D>this._$context);
			})
		} else {
			throw new Error("Context is null in Game drawGameObservers()")
		}
	}

	start() {
		this.drawGameObservers();
	}

	stop() {

	}
}
