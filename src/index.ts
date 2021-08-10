import { FireballCreator } from './app/FireballCreator/FireballCreator';
import { Game } from './app/core/Game';
import { Map } from './app/core/Map';
import { MathHelper } from './app/helpers';
import { Hero } from './app/Hero';
import { OrkCreator } from './app/OrkCreator/OrkCreator';
import { CoinsCreator } from './app/CoinsCreator/CoinsCreator';

import mapAreaImg from './assets/map/area.jpg';
import mapWallImg from './assets/map/wall.png';

import { archerSpriteInfo, coinSpriteInfo, fireballSpriteInfo, orkSpriteInfo } from './config/default-game-config';

async function start() {
	const fireballCreator = new FireballCreator(fireballSpriteInfo, {
		width: 13,
		height: 13,
		verticalOffset: 14,
		horizontalOffset: 13,
		showPolygon: false,
		showSprite: true,
	});

	await fireballCreator.init();

	const orkCreator = new OrkCreator(orkSpriteInfo, {
		width: 30,
		height: 40,
		verticalOffset: 0,
		horizontalOffset: 5,
		showSprite: true,
		showPolygon: false,
	});

	await orkCreator.init();

	const coinsCreator = new CoinsCreator(coinSpriteInfo, {
		width: 40,
		height: 40,
		horizontalOffset: 0,
		verticalOffset: 0,
		showPolygon: false,
		showSprite: true,
	});

	await coinsCreator.init();

	const game = new Game('canvas', {
		widthInBlockAreas: MathHelper.getRandomInt(1, 12),
		heightInBlockAreas: MathHelper.getRandomInt(1, 5),
		map: new Map(mapAreaImg, mapWallImg),
		player: new Hero(archerSpriteInfo, {
			height: 22,
			width: 16,
			verticalOffset: 14,
			horizontalOffset: 10,
			showPolygon: false,
			showSprite: true,
		}, fireballCreator),
		enemyCreator: orkCreator,
		bonusCreator: coinsCreator,
	});

	await game.init();

	game.start();

	// setTimeout(() => {
	// 	game.reloadLevel();
	// }, 1000)
}

start();