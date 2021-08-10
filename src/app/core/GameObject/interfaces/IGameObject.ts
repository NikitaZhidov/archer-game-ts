import { IGameObserver } from '.';
import { Direction } from '../../EngineInfo/interfaces';
import { MobSpeed } from '../../MobSpeed/MobSpeed';
import { IPosition, IProjectile, ISize, ISpeed } from '../../shared/interfaces';

export interface IGameObject extends IGameObserver {
	init: (
        startPosition: IPosition,
        dieEmit: (obs: IGameObserver) => void,
        shootEmit: (projectile: IProjectile, position: IPosition) => Promise<void>
    ) => Promise<void>;

	readonly position: IPosition;
    readonly size: ISize;
    direction: Direction;
    speedAbsValue: MobSpeed;
    speed: ISpeed;
    dieEmit: Function;
    shootEmit: Function;
    inverseDirection: () => void;
}