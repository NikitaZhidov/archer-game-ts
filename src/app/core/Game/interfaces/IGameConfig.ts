import { IEnemyCreator } from '../../EnemyCreator';
import { IMap } from '../../Map/interfaces';
import { Player } from '../../Player/Player';
import { IBonusCreator } from '../../shared/interfaces';

export interface IGameConfig {
	widthInBlockAreas: number;
	heightInBlockAreas: number;
	map: IMap;
	player: Player;
	enemyCreator: IEnemyCreator;
	bonusCreator: IBonusCreator;
}