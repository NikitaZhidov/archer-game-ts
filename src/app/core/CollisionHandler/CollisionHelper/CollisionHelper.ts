import { MathHelper } from "../../../helpers";
import { EngineInfo } from "../../EngineInfo";
import { Direction } from "../../EngineInfo/interfaces";
import { IGameObject } from "../../GameObject";
import { IMap, IMapInfo } from "../../Map/interfaces";
import { Player } from "../../Player";
import { IBonus, ICanKilled, IPosition, IProjectile } from "../../shared/interfaces";

interface MapBlockCoords {
    x: number;
    y: number;
}

export class CollisionHelper {
    private static _mobCanMoveOffset = 1;

    static handleBetweenPlayerAndMap(player: IGameObject, mapInfo: IMapInfo): void {

        if (!CollisionHelper._canMobMoveDown(player, mapInfo) && player.speed.dy > 0) {
            player.position.y -= player.speed.dy;
        }

        if (!CollisionHelper._canMobMoveUp(player, mapInfo) && player.speed.dy < 0) {
            player.position.y -= player.speed.dy
        }

        if (!CollisionHelper._canMobMoveRight(player, mapInfo) && player.speed.dx > 0) {
            player.position.x -= player.speed.dx
        }

        if (!CollisionHelper._canMobMoveLeft(player, mapInfo) && player.speed.dx < 0) {
            player.position.x -= player.speed.dx;
        }
    }


    static handleBetweenMobsAndMap(mobs: IGameObject[], mapInfo: IMapInfo) {
        mobs.forEach((mob) => {
                if (CollisionHelper._detectBetwenObjectAndMap(mob, mapInfo)) {
                    mob.speed.dx = 0;
                    mob.speed.dy = 0;

                    const dir = MathHelper.getRandomDirection();
                    mob.direction = dir;
                    const mobSpeed = MathHelper.getSpeedByDirection(dir, mob.speedAbsValue);
                    mob.speed.dy = mobSpeed.dy;
                    mob.speed.dx = mobSpeed.dx;
                }
            }
        )
    }

    static handleBetweenMobs(mobs: IGameObject[]) {
        mobs.forEach((mob) => {
            const otherMobs: IGameObject[] = mobs.filter(m => mob !== m);
            otherMobs.forEach((otherMob) => {
                if (CollisionHelper._detectBetweenGameObjects(mob, otherMob)) {
                    mob.inverseDirection();
                    otherMob.inverseDirection();
                }
            });
        });
    }

    static handleBetweenProjectilesAndMap(projectiles: IProjectile[], mapInfo: IMapInfo) {
        projectiles.forEach(proj => {
            if (CollisionHelper._detectBetwenObjectAndMap(proj, mapInfo)) {
                proj.die();
            }
        });
    }

    static handlePlayerKillers(player: Player) {
        player.killers.forEach((killer) => {
            if (this._detectBetweenGameObjects(player, killer)) {
                player.die();
            }
        });
    }

    static handleMobsKillers(mobs: ICanKilled[]) {
        mobs.forEach((mob) => {
            mob.killers.forEach((killer) => {
                if (this._detectBetweenGameObjects(killer, mob)) {
                    mob.die();
                    killer.dieEmit(killer);
                }
            });
        });
    }

    static handleBetweenPlayerAndBonuses(player: Player, bonuses: IBonus[]) {
        bonuses.forEach((b) => {
            if (CollisionHelper._detectBetweenGameObjects(player, b)) {
                b.remove();
            }
        });
    }

    private static _detectBetwenObjectAndMap(obj: IGameObject, mapInfo: IMapInfo) {
        return obj.direction === Direction.UP && !CollisionHelper._canMobMoveUp(obj, mapInfo) ||
               obj.direction === Direction.LEFT && !CollisionHelper._canMobMoveLeft(obj, mapInfo) ||
               obj.direction === Direction.RIGHT && !CollisionHelper._canMobMoveRight(obj, mapInfo) ||
               obj.direction === Direction.DOWN && !CollisionHelper._canMobMoveDown(obj, mapInfo);
    }

    private static _detectBetweenGameObjects(mob1: IGameObject, mob2: IGameObject): boolean {
        if (mob1.position.x < mob2.position.x + mob2.size.width &&
            mob1.position.x + mob1.size.width > mob2.position.x &&
            mob1.position.y < mob2.position.y + mob2.size.height &&
            mob1.position.y + mob1.size.height > mob2.position.y) {
            return true;
        }
        return false;
    }

    private static _canMobMoveUp(mob: IGameObject, mapInfo: IMapInfo): boolean {
        const minY = 0;
        if (mob.position.y <= minY && mob.speed.dy < 0) {
            return false;
        }

        const leftUp: IPosition = {
            x: Math.max(mob.position.x, 0),
            y: Math.max(mob.position.y - CollisionHelper._mobCanMoveOffset, 0),
        };

        const rightUp: IPosition = {
            x: mob.position.x + mob.size.width - CollisionHelper._mobCanMoveOffset,
            y: mob.position.y - CollisionHelper._mobCanMoveOffset,
        };

        const leftUpWall: MapBlockCoords = {
            x: Math.floor(leftUp.x / EngineInfo.BLOCK_SIZE),
            y: Math.floor(leftUp.y / EngineInfo.BLOCK_SIZE),
        };

        const rightUpWall: MapBlockCoords = {
            x: Math.min(Math.floor(rightUp.x / EngineInfo.BLOCK_SIZE), mapInfo.mapSize.widthInBlocks - 1),
            y: Math.floor(rightUp.y / EngineInfo.BLOCK_SIZE),
        };

        const canLeftUp = !mapInfo.map[leftUpWall.x][leftUpWall.y];
        const canRightUp = !mapInfo.map[rightUpWall.x][rightUpWall.y];

        return canLeftUp && canRightUp;
    }

    private static _canMobMoveRight(mob: IGameObject, mapInfo: IMapInfo): boolean {
        const maxX = mapInfo.mapSize.widthInBlocks * EngineInfo.BLOCK_SIZE;

        if (mob.position.x + mob.size.width >= maxX && mob.speed.dx > 0) {
            return false;
        }

        const rightUp: IPosition = {
            x: mob.position.x + mob.size.width,
            y: mob.position.y,
        };

        const rightDown: IPosition = {
            x: mob.position.x + mob.size.width,
            y: mob.position.y + mob.size.height - CollisionHelper._mobCanMoveOffset,
        }

        const upRightWall: MapBlockCoords = {
            x: Math.min(Math.floor(rightUp.x / EngineInfo.BLOCK_SIZE), mapInfo.mapSize.widthInBlocks - 1),
            y: Math.min(Math.floor(rightUp.y / EngineInfo.BLOCK_SIZE), mapInfo.mapSize.heightInBlocks - 1),
        };

        const downRightWall: MapBlockCoords = {
            x: Math.min(Math.floor(rightDown.x / EngineInfo.BLOCK_SIZE), mapInfo.mapSize.widthInBlocks - 1),
            y: Math.min(Math.floor(rightDown.y / EngineInfo.BLOCK_SIZE), mapInfo.mapSize.heightInBlocks - 1),
        };

        const canUpRight = !mapInfo.map[upRightWall.x][upRightWall.y];
        const canDownRight = !mapInfo.map[downRightWall.x][downRightWall.y];

        return canUpRight && canDownRight;
    }

    private static _canMobMoveDown(mob: IGameObject, mapInfo: IMapInfo): boolean {
        const maxY = mapInfo.mapSize.heightInBlocks * EngineInfo.BLOCK_SIZE;

        if (mob.position.y + mob.size.height >= maxY && mob.speed.dy > 0) {
            return false;
        }

        const leftDown: IPosition = {
            x: Math.max(mob.position.x, 0),
            y: (mob.position.y + mob.size.height)
        };

        const rightDown: IPosition = {
            x: mob.position.x + mob.size.width - CollisionHelper._mobCanMoveOffset,
            y: (mob.position.y + mob.size.height),
        }

        const leftDownWall: MapBlockCoords = {
            x: Math.max(Math.floor(leftDown.x / EngineInfo.BLOCK_SIZE), 0),
            y: Math.max(Math.floor(leftDown.y / EngineInfo.BLOCK_SIZE), 0),
        }

        const rightDownWall: MapBlockCoords = {
            x: Math.min(Math.floor(rightDown.x / EngineInfo.BLOCK_SIZE), mapInfo.mapSize.widthInBlocks - 1),
            y: Math.min(Math.floor(rightDown.y/ EngineInfo.BLOCK_SIZE), mapInfo.mapSize.heightInBlocks - 1),
        }

        const canLeftDown = !mapInfo.map[leftDownWall.x][leftDownWall.y];
        const canRightDown = !mapInfo.map[rightDownWall.x][rightDownWall.y];

        return canLeftDown && canRightDown;
    }

    private static _canMobMoveLeft(mob: IGameObject, mapInfo: IMapInfo): boolean {
        const minX = 0;

        if (mob.position.x <= minX && mob.speed.dx < 0) {
            return false;
        }

        const leftUp: IPosition = {
            x: Math.max(mob.position.x - CollisionHelper._mobCanMoveOffset, 0),
            y: Math.max(mob.position.y, 0),
        };

        const leftDown: IPosition = {
            x: Math.max(mob.position.x - CollisionHelper._mobCanMoveOffset, 0),
            y: mob.position.y + mob.size.height - CollisionHelper._mobCanMoveOffset,
        };

        const upLeftWall: MapBlockCoords = {
            x: Math.floor(leftUp.x / EngineInfo.BLOCK_SIZE),
            y: Math.floor(leftUp.y / EngineInfo.BLOCK_SIZE),
        };

        const downLeftWall: MapBlockCoords = {
            x: Math.floor(leftDown.x / EngineInfo.BLOCK_SIZE),
            y: Math.floor(leftDown.y / EngineInfo.BLOCK_SIZE),
        };

        const canUpLeft = !mapInfo.map[upLeftWall.x][upLeftWall.y];
        const canDownLeft = !mapInfo.map[downLeftWall.x][downLeftWall.y];

        return canUpLeft && canDownLeft;
    }
}