import { Game } from './app/core/Game';
import { Map } from './app/Map';

import mapAreaImg from './assets/map/area.jpg';
import mapWallImg from './assets/map/wall.jpg';

async function start() {
	const game = new Game('canvas', {
		widthInBlocks: 8,
		heightInBlocks: 5,
		map: new Map(mapAreaImg, mapWallImg),
	});

	await game.init();

	game.start();
}

start();