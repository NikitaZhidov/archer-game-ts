import { IBonus } from "./IBonus";

export interface IBonusCreator {
    createBonus: () => IBonus;
}
