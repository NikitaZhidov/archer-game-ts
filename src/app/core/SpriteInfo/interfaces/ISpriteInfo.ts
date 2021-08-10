import { Direction, MoveType } from "../../EngineInfo/interfaces";

export interface ISpriteInfo {
    imageUrl: string;

    spriteBeginHorizontalOffset: number;
    spriteBeginVerticalOffset: number;
    frameOffset: number;

    verticalOffsets?: {
        [key in Direction]: {
           [key in MoveType]?: number;
        }
    };

    spriteWidthInImage: number;
    spriteHeightInImage: number;

    spriteWidth: number;
    spriteHeight: number;

    framesCount: number;
}
