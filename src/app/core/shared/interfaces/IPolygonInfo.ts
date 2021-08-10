import { ISize } from "./ISize";

export interface IPolygonInfo extends ISize {
    horizontalOffset: number;
    verticalOffset: number;
    showPolygon: boolean;
    showSprite: boolean;
}