import { IGameConfig } from '../../core/Game';
import { Player } from '../../core/Player/Player';
import { IGameObserver } from '../../shared/interfaces';

export class Hero extends Player implements IGameObserver {
	draw() { }

	async init(gameConfig: IGameConfig) { }
}
