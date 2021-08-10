
import { ImgLoader } from '../../../helpers';
import { EngineInfo } from '../../EngineInfo';
import { IGameConfig } from '../../Game';
import { MapGenerator } from '../helpers';
import { IMap, IMapInfo } from '../interfaces';

export enum MapBlockPosition {
	DownWall,
	UpWall,
	UpDownWall,
	UpDownWallWithWalls,
	Area,
}

export class Map implements IMap {

	private _areaTextureUrl: string = '';
	private _wallTextureUrl: string = '';

	private _areaTexture!: CanvasImageSource;
	private _wallTexture!: CanvasImageSource;

	private _mapInfo: IMapInfo = {
		map: [],
		startMapPosition: {
			x: 0,
			y: 0,
		},
		endMapPosition: {
			x: 20,
			y: 20,
		},
		mapSize: { heightInBlocks: 0, widthInBlocks: 0 },
		emptyPlaces: [],
	}

	get map(): boolean[][] {
		return this._mapInfo.map.map((copy) => copy.map((c) => c));
	}

	constructor(areaTextureUrl: string, wallTextureUrl: string) {
		this._areaTextureUrl = areaTextureUrl;
		this._wallTextureUrl = wallTextureUrl;
	}

	reload(): IMapInfo {
		this._mapInfo = MapGenerator.generateMap(this._mapInfo.mapSize);
		return this._mapInfo;
	}

	async init(gameConfig: IGameConfig) {
		try {
			this._mapInfo.mapSize.heightInBlocks = gameConfig.heightInBlockAreas * EngineInfo.BLOCK_AREA_SIZE;
			this._mapInfo.mapSize.widthInBlocks = gameConfig.widthInBlockAreas * EngineInfo.BLOCK_AREA_SIZE;

			this._mapInfo = MapGenerator.generateMap(this._mapInfo.mapSize);

			this._areaTexture = await ImgLoader.load(this._areaTextureUrl);
			this._wallTexture = await ImgLoader.load(this._wallTextureUrl);

			return this._mapInfo;
		} catch (e) {
			throw new Error('Map initialize error');
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		if (!this._mapInfo.mapSize) {
			throw new Error('Map is not initialized');
		}

		for (let i = 0; i < this._mapInfo.mapSize.widthInBlocks; i++) {
			for (let j = 0; j < this._mapInfo.mapSize.heightInBlocks; j++) {
				ctx.drawImage(this._areaTexture, EngineInfo.BLOCK_SIZE * i, EngineInfo.BLOCK_SIZE * j);
				if (this.map[i][j] === true) {
					ctx.drawImage(this._wallTexture, EngineInfo.BLOCK_SIZE * i, EngineInfo.BLOCK_SIZE * j);
				}
			}
		}
	}
}