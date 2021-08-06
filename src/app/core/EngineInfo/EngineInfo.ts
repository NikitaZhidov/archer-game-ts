import { IGameConfig } from '../Game/interfaces';
import { ICanvasSizeInfo } from './interfaces';

export class EngineInfo {
	static readonly BLOCK_SIZE = 40;
	static readonly BLOCK_AREA_SIZE = 3;

	static calculateCanvasSize(gameConfig: IGameConfig): ICanvasSizeInfo {
		const multiplier = EngineInfo.BLOCK_SIZE * EngineInfo.BLOCK_AREA_SIZE;

		return {
			width: multiplier * gameConfig.widthInBlocks,
			height: multiplier * gameConfig.heightInBlocks,
		}
	}
}
