import { IGameConfig } from '../Game/interfaces';
import { ICanvasSizeInfo } from './interfaces';

export class EngineInfo {
	// Must be %10 === 0
	static readonly BLOCK_SIZE = 40;
	// Must be odd
	static readonly BLOCK_AREA_SIZE = 3;

	static readonly FPS = 60;

	static readonly GAME_SPEED = 1000 / EngineInfo.FPS;

	static calculateCanvasSize(gameConfig: IGameConfig): ICanvasSizeInfo {
		const multiplier = EngineInfo.BLOCK_SIZE * EngineInfo.BLOCK_AREA_SIZE;

		return {
			width: multiplier * gameConfig.widthInBlockAreas,
			height: multiplier * gameConfig.heightInBlockAreas,
		}
	}
}
