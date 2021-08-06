import { EngineInfo } from '../../core/EngineInfo';
import { IGameConfig } from '../../core/Game';
import { ImgLoader } from '../../helpers';
import { IGameObserver } from '../../shared/interfaces';
import { MapGenerator } from '../helpers';
import { IMap, IMapSize } from '../interfaces';

export class Map implements IGameObserver, IMap {
	private _mapSize: IMapSize = { height: 0, width: 0 };

	private _areaTextureUrl: string = '';
	private _wallTextureUrl: string = '';

	private _areaTexture!: CanvasImageSource;
	private _wallTexture!: CanvasImageSource;

	private _map: boolean[][] = [];

	get map(): boolean[][] {
		return this._map.map((copy) => copy.map((c) => c));
	}

	constructor(areaTextureUrl: string, wallTextureUrl: string) {
		this._areaTextureUrl = areaTextureUrl;
		this._wallTextureUrl = wallTextureUrl;
	}

	async init(gameConfig: IGameConfig) {
		try {
			this._mapSize.height = gameConfig.heightInBlocks * EngineInfo.BLOCK_AREA_SIZE;
			this._mapSize.width = gameConfig.widthInBlocks * EngineInfo.BLOCK_AREA_SIZE;

			this._map = MapGenerator.generateMap(this._mapSize);

			this._areaTexture = await ImgLoader.load(this._areaTextureUrl);
			this._wallTexture = await ImgLoader.load(this._wallTextureUrl);
		} catch (e) {
			console.log(e);
			console.log(e);
			throw new Error('Map initialize error');
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (!this._mapSize) {
			throw new Error('Map is not initialized');
		}

		for (let i = 0; i < this._mapSize.width; i++) {
			for (let j = 0; j < this._mapSize.height; j++) {
				if (this.map[i][j] === false) {
					ctx.drawImage(this._areaTexture, EngineInfo.BLOCK_SIZE * i, EngineInfo.BLOCK_SIZE * j);
				}
				if (this.map[i][j] === true) {
					ctx.drawImage(this._wallTexture, EngineInfo.BLOCK_SIZE * i, EngineInfo.BLOCK_SIZE * j);
				}
			}
		}
	}
}