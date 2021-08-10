import { IGameObject } from "../../GameObject";
import { IMapInfo } from "../../Map/interfaces";
import { Player } from "../../Player";
import { IBonus, ICanKilled, IProjectile } from "../../shared/interfaces";
import { CollisionHelper } from "../CollisionHelper/CollisionHelper";

export class CollisionHandler {
    private _mapInfo: IMapInfo;
    private _player: Player;
    private _projectiles: IProjectile[];
    private _bonuses: IBonus[];

    private _mobs: ICanKilled[] = [];

    constructor(
        mapInfo: IMapInfo,
        player: Player,
        mobs: ICanKilled[],
        projectiles: IProjectile[],
        bonuses: IBonus[],
    ) {
        this._mapInfo = mapInfo;
        this._player = player;
        this._projectiles = projectiles;
        this._mobs = mobs;
        this._bonuses = bonuses;
    }

    handle() {
        CollisionHelper.handleBetweenMobs(this._mobs);
        CollisionHelper.handleBetweenPlayerAndMap(this._player, this._mapInfo);
        CollisionHelper.handleBetweenMobsAndMap(this._mobs, this._mapInfo);
        CollisionHelper.handlePlayerKillers(this._player);
        CollisionHelper.handleMobsKillers(this._mobs);
        CollisionHelper.handleBetweenProjectilesAndMap(this._projectiles, this._mapInfo);
        CollisionHelper.handleBetweenPlayerAndBonuses(this._player, this._bonuses);
    }
}