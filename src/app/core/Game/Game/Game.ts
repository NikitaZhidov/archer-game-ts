import { CollisionHandler } from '../../CollisionHandler';
import { EngineInfo } from '../../EngineInfo';
import { ICanvasSizeInfo } from '../../EngineInfo/interfaces';
import { IGameObject, IGameObserver } from '../../GameObject';
import { IMap, IMapInfo } from '../../Map/interfaces';
import { Player } from '../../Player';
import { IBonus, ICanKilled, IKiller, IPosition, IProjectile, ProjectileType } from '../../shared/interfaces';
import { IGame, IGameConfig } from '../interfaces';

export class Game implements IGame {
	private _$canvas: HTMLCanvasElement;
	private _$context: CanvasRenderingContext2D | null = null;
	private _gameConfig: IGameConfig;

	private _collisionHandler!: CollisionHandler;

	private _isInitialized = false;

	gameObservers: IGameObserver[] = [];

	private _PLAYER: Player;

	private _mapInfo!: IMapInfo;

	private _gameInterval!: NodeJS.Timer;

	private _enemies: ICanKilled[] = [];
	private _bonues: IBonus[] = [];

	private _projectiles: IProjectile[] = [];

	private _isStarted = false;

	get mapInfo() {
		return this._mapInfo;
	}

	constructor(canvasElementId: string, gameConfig: IGameConfig) {
		const $canvas = document.getElementById(canvasElementId);
		this._gameConfig = gameConfig;
		this._PLAYER = this._gameConfig.player;

		if ($canvas && $canvas instanceof HTMLCanvasElement) {
			this._$canvas = $canvas;
		} else {
			throw new Error('canvasElementId must be id of HTMLCanvasElement')
		}
	}

	private _dieMobEmit(mob: ICanKilled & IKiller) {
		this.gameObservers = this.gameObservers.filter(obs => obs !== mob);
		const mobIndex = this._enemies.indexOf(mob);
		if (mobIndex !== -1) {
			this._enemies.splice(mobIndex, 1);
		}

		this._PLAYER.killers = this._PLAYER.killers.filter(k => k !== mob);
	}

	private _diePlayerEmit(obs: Player) {
		this._PLAYER.killers = [];
		// this.gameObservers = this.gameObservers.filter(o => obs !== o);
	}

	private _dieBonusEmit(bonus: IBonus) {
		this.gameObservers = this.gameObservers.filter(obs => obs !== bonus);
		const bonusIndex = this._bonues.indexOf(bonus);
		if (bonusIndex !== -1) {
			this._bonues.splice(bonusIndex, 1);
		}
	}

	private _dieProjectileEmit(proj: IProjectile) {
		const projIndex = this._projectiles.indexOf(proj);
		if (projIndex !== -1) {
			this._projectiles.splice(projIndex, 1);
		}
		switch(proj.projectileType) {
			case ProjectileType.KillEnemy:
				this._enemies.forEach(enemy => {
					enemy.killers = enemy.killers.filter(k => k !== proj);
				})
			case ProjectileType.KillPlayer:
				this._PLAYER.killers = this._PLAYER.killers.filter(k => k !== proj);
		}
		this.gameObservers = this.gameObservers.filter(obs => obs !== proj);
	}

	private async _shootEmit(projectile: IProjectile, startPosition: IPosition) {
		this._projectiles.push(projectile);
		await this.registerProjectile(projectile, startPosition);
	}

	private async _registerGameMap(map: IMap) {
		this._mapInfo = await map.init(this._gameConfig);
		this.gameObservers.push(map);
	}

	private async registerProjectile(projectile: IProjectile, position: IPosition) {
		this._enemies.forEach((e) => e.registerKiller(projectile));
		await this.registerGameObserver(projectile, position, this._dieProjectileEmit, this._shootEmit);
	}

	async registerGameObserver(obs: IGameObject, startPosition: IPosition, dieEmit: Function, shootEmit: Function) {
		this.gameObservers.push(obs);
		await obs.init(startPosition, dieEmit.bind(this), shootEmit.bind(this));
	}

	async init() {
		const canvasSize: ICanvasSizeInfo = EngineInfo.calculateCanvasSize(this._gameConfig);
		this._$canvas.height = canvasSize.height;
		this._$canvas.width = canvasSize.width;

		this._$context = this._$canvas.getContext('2d');

		if (!this._$context) {
			throw new Error('Failed to get canvas context in Game init')
		}

		await this._registerGameMap(this._gameConfig.map);
		await this.registerGameObserver(this._PLAYER, this._mapInfo.startMapPosition, this._diePlayerEmit, this._shootEmit);

		for (let i = 0; i < this._mapInfo.emptyPlaces.length; i++) {
			const bonus = this._gameConfig.bonusCreator.createBonus();
			this._bonues.push(bonus);

			const enemy = this._gameConfig.enemyCreator.createEnemy();
			this._enemies.push(enemy)

			await this.registerGameObserver(bonus, {...this.mapInfo.emptyPlaces[i]}, this._dieBonusEmit, this._shootEmit);
			await this.registerGameObserver(enemy, {...this.mapInfo.emptyPlaces[i]}, this._dieMobEmit, this._shootEmit);

			this._PLAYER.registerKiller(enemy);
		}
		this._collisionHandler = new CollisionHandler(this._mapInfo, this._PLAYER, this._enemies, this._projectiles, this._bonues);


		this._isInitialized = true;
	}

	drawGameObservers(frame: number) {
		if (!this._$context) {
			throw new Error('Invalid canvas context in Game drawGameObservers()');
		}

		if (this._isInitialized) {
			this.gameObservers.forEach((gameObserver) => {
				this._collisionHandler.handle();
				gameObserver.draw(<CanvasRenderingContext2D>this._$context, frame);
			})
		} else {
			throw new Error("Game is not initalized");
		}
	}

	start() {
		let frame = 1;
		if (this._isStarted) {
			throw new Error('Game has already started');
		};
		this._isStarted = true;
		this._gameInterval = setInterval(() => {
			this.drawGameObservers(frame);
			frame++;
			frame = frame > EngineInfo.FPS ? 1 : frame;
		}, EngineInfo.GAME_SPEED);
	}

	stop() {
		if (!this._isStarted) {
			throw new Error('Game is not started');
		};
		this._isStarted = false;
		clearInterval(this._gameInterval);
	}

	reloadLevel() {
		this._enemies.length = 0;
		this._projectiles.length = 0;
		this._bonues.length = 0;
		this._PLAYER.killers = [];

		this._mapInfo = this._gameConfig.map.reload();

		this.gameObservers = [this._gameConfig.map, this._PLAYER];
	}
}
