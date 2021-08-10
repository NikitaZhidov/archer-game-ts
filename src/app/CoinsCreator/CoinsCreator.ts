import { Coin } from "../Coin/Coin";
import { IBonusCreator, IPolygonInfo } from "../core/shared/interfaces";
import { ISpriteInfo } from "../core/SpriteInfo/interfaces";
import { ImgLoader } from "../helpers";

export class CoinsCreator implements IBonusCreator {
    bonusPolygonInfo: IPolygonInfo;
    bonusSpriteInfo: ISpriteInfo;

    private _spriteSource!: HTMLImageElement;

    createBonus() {
        return new Coin(this.bonusSpriteInfo, this.bonusPolygonInfo, this._spriteSource);
    }

    constructor(bonusSpriteInfo: ISpriteInfo, bonusPolygonInfo: IPolygonInfo) {
        this.bonusSpriteInfo = bonusSpriteInfo;
        this.bonusPolygonInfo = bonusPolygonInfo;
    }

    async init() {
        this._spriteSource = await ImgLoader.load(this.bonusSpriteInfo.imageUrl);
    }
}