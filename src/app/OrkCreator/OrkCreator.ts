import { IEnemyCreator } from "../core/EnemyCreator";
import { IPolygonInfo } from "../core/shared/interfaces";
import { ISpriteInfo } from "../core/SpriteInfo/interfaces";
import { ImgLoader } from "../helpers";
import { Ork } from "../Ork/Ork";

export class OrkCreator implements IEnemyCreator {
    enemyPolygonInfo: IPolygonInfo;
    enemySpriteInfo: ISpriteInfo;

    private _spriteSource!: HTMLImageElement;

    createEnemy() {
        return new Ork(this.enemySpriteInfo, this.enemyPolygonInfo, this._spriteSource);
    }

    constructor(enemySpriteInfo: ISpriteInfo, enemyPolygonInfo: IPolygonInfo) {
        this.enemySpriteInfo = enemySpriteInfo;
        this.enemyPolygonInfo = enemyPolygonInfo;
    }

    async init() {
        this._spriteSource = await ImgLoader.load(this.enemySpriteInfo.imageUrl);
    }
}