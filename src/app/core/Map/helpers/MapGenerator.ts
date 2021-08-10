import { MathHelper } from '../../../helpers';
import { EngineInfo } from '../../EngineInfo';
import { IPosition } from '../../shared/interfaces';
import { IMapInfo, IMapSize } from '../interfaces';

interface IBlock {
	i: number;
	j: number;
}

export class MapGenerator {
	private static BLOCKS_FROM_BORDER_TO_CENTER = Math.floor(EngineInfo.BLOCK_AREA_SIZE / 2);
	private static ADDITIONAL_GENERATE_REMOVE_WALL_CHANCE = 0.35;

	static generateMap(mapSize: IMapSize): IMapInfo {
		const map: boolean[][] = [];

		MapGenerator._initMap(map, mapSize);

		const beginBlock: IPosition = MapGenerator._getRandomBeginBlock(mapSize);

		map[beginBlock.x][beginBlock.y] = false;

		MapGenerator._generateDfs(beginBlock, map, mapSize);

		const emptyBlocks: IBlock[] = MapGenerator._additionalGenerate(map, mapSize);

		const emptyPlaces: IPosition[] = MapGenerator._getEmptyPlaces(mapSize, emptyBlocks);

		return {
			map,
			startMapPosition: {
				x: beginBlock.x * EngineInfo.BLOCK_SIZE,
				y: beginBlock.y * EngineInfo.BLOCK_SIZE,
			},
			endMapPosition: beginBlock,
			mapSize,
			emptyPlaces,
		};
	}

	private static _generateDfs(
		currentBlock: IPosition,
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
		for (let i = 0; i < mapSize.widthInBlocks; i++) {
			map[i] = [];
			for (let j = 0; j < mapSize.heightInBlocks; j++) {
				map[i][j] = true;
			}
		}
	}

	private static _getRandomBeginBlock(mapSize: IMapSize): IPosition {
		const COUNT_BLOCKS_AREA_IN_ROW = mapSize.widthInBlocks / EngineInfo.BLOCK_AREA_SIZE;

		let blockAreaNum = MathHelper.getRandomInt(0, COUNT_BLOCKS_AREA_IN_ROW);

		const x = blockAreaNum > 0
			? blockAreaNum * EngineInfo.BLOCK_AREA_SIZE - MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER
			: MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER;

		const beginBlock: IPosition = {
			x,
			y: MapGenerator.BLOCKS_FROM_BORDER_TO_CENTER,
		};

		return beginBlock
	}

	private static _getAdjacentVertices(block: IPosition, mapSize: IMapSize): IPosition[] {
		const adjacentVertices: IPosition[] = [];

		const minX = 0;
		const maxX = mapSize.widthInBlocks - 1;
		const minY = 0;
		const maxY = mapSize.heightInBlocks - 1;

		const validateBlock = (blockForCheck: IPosition): boolean => {
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

	private static _isVisitedBlock(block: IPosition, map: boolean[][]) {
		return !map[block.x][block.y];
	}

	private static _connectBlocks(from: IPosition, to: IPosition, map: boolean[][]) {
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

	private static _additionalGenerate(map: boolean[][], mapSize: IMapSize): IBlock[] {
		const emptyBlocks: IBlock[] = [];
		const startEmptyBlocksRow = Math.ceil(EngineInfo.BLOCK_AREA_SIZE/2);

		for (let i = 0; i < mapSize.widthInBlocks; i++) {
			for (let j = 0; j < mapSize.heightInBlocks; j++) {
				if (j >= startEmptyBlocksRow && map[i][j] === false) {
					emptyBlocks.push({i, j})
				}
				if (
					MathHelper.getRandomBoolean(MapGenerator.ADDITIONAL_GENERATE_REMOVE_WALL_CHANCE)
					&& !MapGenerator._isVisitedBlock({ x: i, y: j }, map)
				) {
					map[i][j] = false;
				}
			}
		}

		return emptyBlocks;
	}

	private static _getEmptyPlaces(mapSize: IMapSize, emptyBlocks: IBlock[]): IPosition[] {
		const countEmptyPlacesMax = Math.floor((mapSize.heightInBlocks * mapSize.widthInBlocks) / ((EngineInfo.BLOCK_AREA_SIZE ** 2) * 4)) || 1;
		const countEmptyPlaces = Math.min(countEmptyPlacesMax, emptyBlocks.length);

		const emptyPlaces: IPosition[] = [];

		let currentEmptyBlocks: IBlock[] = JSON.parse(JSON.stringify(emptyBlocks));

		for (let i = 0; i < countEmptyPlaces; i++) {
			let emptyBlockIndex = MathHelper.getRandomInt(0, currentEmptyBlocks.length);
			const block = currentEmptyBlocks[emptyBlockIndex];
			emptyPlaces.push({
				x: block.i * EngineInfo.BLOCK_SIZE,
				y: block.j * EngineInfo.BLOCK_SIZE,
			})
			currentEmptyBlocks = currentEmptyBlocks.filter((_, i) => i !== emptyBlockIndex);
		}

		return emptyPlaces;
	}
}
