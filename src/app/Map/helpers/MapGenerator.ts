import { EngineInfo } from '../../core/EngineInfo';
import { MathHelper } from '../../helpers';
import { IBlock } from '../../shared/interfaces';
import { IMapSize } from '../interfaces';

export class MapGenerator {
	private static BLOCKS_FROM_BORDER_TO_CENTER = Math.floor(EngineInfo.BLOCK_AREA_SIZE / 2);
	private static ADDITIONAL_GENERATE_REMOVE_WALL_CHANCE = 0.35;

	static generateMap(mapSize: IMapSize): boolean[][] {
		const map: boolean[][] = [];

		this._initMap(map, mapSize);

		const beginBlock: IBlock = MapGenerator._getRandomBeginBlock(mapSize);

		map[beginBlock.x][beginBlock.y] = false;

		MapGenerator._generateDfs(beginBlock, map, mapSize);

		MapGenerator._additionalGenerate(map, mapSize);

		return map;
	}

	private static _generateDfs(
		currentBlock: IBlock,
		map: boolean[][],
		mapSize: IMapSize,
	) {
		for (const block of MapGenerator._getAdjacentVertices(currentBlock, mapSize)) {
			if (!MapGenerator._isVisitedBlock(block, map)) {
				MapGenerator._connectBlocks(currentBlock, block, map);
				MapGenerator._generateDfs(block, map, mapSize);
			}
		}
	}

	private static _initMap(map: boolean[][], mapSize: IMapSize) {
		for (let i = 0; i < mapSize.width; i++) {
			map[i] = [];
			for (let j = 0; j < mapSize.height; j++) {
				map[i][j] = true;
			}
		}
	}

	private static _getRandomBeginBlock(mapSize: IMapSize): IBlock {
		const COUNT_BLOCKS_AREA_IN_ROW = mapSize.width / EngineInfo.BLOCK_AREA_SIZE;

		let blockAreaNum = MathHelper.getRandomInt(0, COUNT_BLOCKS_AREA_IN_ROW);

		const x = blockAreaNum > 0
			? blockAreaNum * EngineInfo.BLOCK_AREA_SIZE - MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER
			: MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER;

		const beginBlock: IBlock = {
			x,
			y: MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER,
		};

		return beginBlock
	}

	private static _getAdjacentVertices(block: IBlock, mapSize: IMapSize): IBlock[] {
		const adjacentVertices: IBlock[] = [];

		const minX = 0;
		const maxX = mapSize.width - 1;
		const minY = 0;
		const maxY = mapSize.height - 1;

		const validateBlock = (blockForCheck: IBlock): boolean => {
			return blockForCheck.x >= minX && blockForCheck.y >= minY &&
				blockForCheck.x <= maxX && blockForCheck.y <= maxY
		}

		const topBlock = {
			x: block.x,
			y: block.y - 2 * MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER,
		}

		const rightBlock = {
			x: block.x + 2 * MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER,
			y: block.y,
		}

		const bottomBlock = {
			x: block.x,
			y: block.y + 2 * MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER,
		}

		const leftBlock = {
			x: block.x - 2 * MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER,
			y: block.y,
		}

		if (validateBlock(topBlock)) adjacentVertices.push(topBlock);
		if (validateBlock(rightBlock)) adjacentVertices.push(rightBlock);
		if (validateBlock(bottomBlock)) adjacentVertices.push(bottomBlock);
		if (validateBlock(leftBlock)) adjacentVertices.push(leftBlock);

		return adjacentVertices.sort(MathHelper.randomSort);
	}

	private static _isVisitedBlock(block: IBlock, map: boolean[][]) {
		return !map[block.x][block.y];
	}

	private static _connectBlocks(from: IBlock, to: IBlock, map: boolean[][]) {
		map[to.x][to.y] = false;
		switch (true) {
			case (from.x === to.x): {
				const x = from.x = to.x;
				if (from.y > to.y) {
					for (let i = 1; i <= MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER; i++) {
						map[x][from.y - i] = false;
						map[x][to.y + i] = false;
					}
				} else {
					for (let i = 1; i <= MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER; i++) {
						map[x][from.y + i] = false;
						map[x][to.y - i] = false;
					}
				}
				break;
			}
			case (from.y === to.y): {
				const y = from.y = to.y;
				if (from.x > to.x) {
					for (let i = 1; i <= MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER; i++) {
						map[from.x - i][y] = false;
						map[to.x + i][y] = false;
					}
				} else {
					for (let i = 1; i <= MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER; i++) {
						map[from.x + i][y] = false;
						map[to.x - i][y] = false;
					}
				}
				break;
			}
			default:
				break;
		}
	}

	private static _additionalGenerate(map: boolean[][], mapSize: IMapSize) {
		for (let i = 0; i < mapSize.width; i++) {
			for (let j = 0; j < mapSize.height; j++) {
				if (
					MathHelper.getRandomTrue(MapGenerator.ADDITIONAL_GENERATE_REMOVE_WALL_CHANCE)
					&& !MapGenerator._isVisitedBlock({ x: i, y: j }, map)
				) {
					map[i][j] = false;
				}
			}
		}
	}
}
