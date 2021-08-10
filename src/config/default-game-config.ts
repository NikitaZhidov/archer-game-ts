import { Direction, MoveType } from "../app/core/EngineInfo/interfaces";
import { ISpriteInfo } from "../app/core/SpriteInfo/interfaces";

import heroSprite from '../assets/archer/archerSprite.png';
import orkSprite from '../assets/ork/orkSprite.png';
import fireballSprite from '../assets/fireball/fireballSprite.png';
import coinsSprite from '../assets/coins/coinsSprite.png';

export const archerSpriteInfo: ISpriteInfo = {
    imageUrl: heroSprite,
    spriteBeginHorizontalOffset: 6,
    spriteBeginVerticalOffset: 0,
    frameOffset: 64,
    framesCount: 5,
    spriteWidthInImage: 50,
    spriteHeightInImage: 60,
    spriteWidth: 34,
    spriteHeight: 40,
    verticalOffsets: {
        [Direction.UP]: {
            [MoveType.Run]: 518,
            [MoveType.Stand]: 772,
            [MoveType.Shoot]: 6,
            [MoveType.Die]: 1300,
        },
        [Direction.RIGHT]: {
            [MoveType.Run]: 708,
            [MoveType.Stand]: 966,
            [MoveType.Shoot]: 196,
            [MoveType.Die]: 1300,
        },
        [Direction.DOWN]: {
            [MoveType.Run]: 645,
            [MoveType.Stand]: 900,
            [MoveType.Shoot]: 132,
            [MoveType.Die]: 1300,
        },
        [Direction.LEFT]: {
            [MoveType.Run]: 580,
            [MoveType.Stand]: 834,
            [MoveType.Shoot]: 70,
            [MoveType.Die]: 1300,
        },
    }
}

export const orkSpriteInfo: ISpriteInfo = {
    imageUrl: orkSprite,
    frameOffset: 64,
    framesCount: 6,
    spriteBeginHorizontalOffset: 8,
    spriteBeginVerticalOffset: 6,
    spriteWidthInImage: 60,
    spriteHeightInImage: 60,
    spriteWidth: 50,
    spriteHeight: 50,
    verticalOffsets: {
        [Direction.UP]: {
            [MoveType.Run]: 522,
        },
        [Direction.RIGHT]: {
            [MoveType.Run]: 712,
        },
        [Direction.DOWN]: {
            [MoveType.Run]: 650,
        },
        [Direction.LEFT]: {
            [MoveType.Run]: 586,
        }
    }
}

export const fireballSpriteInfo: ISpriteInfo = {
    imageUrl: fireballSprite,
    frameOffset: 40,
    framesCount: 3,
    spriteBeginHorizontalOffset: 0,
    spriteBeginVerticalOffset: 0,
    spriteHeightInImage: 40,
    spriteWidthInImage: 40,
    spriteHeight: 40,
    spriteWidth: 40,
    verticalOffsets: {
        [Direction.RIGHT]: {
            [MoveType.Run]: 0,
        },
        [Direction.UP]: {
            [MoveType.Run]: 0,
        },
        [Direction.DOWN]: {
            [MoveType.Run]: 0,
        },
        [Direction.LEFT]: {
            [MoveType.Run]: 0,
        }
    }
}

export const coinSpriteInfo: ISpriteInfo = {
    imageUrl: coinsSprite,
    frameOffset: 40,
    framesCount: 9,
    spriteBeginHorizontalOffset: 0,
    spriteBeginVerticalOffset: 0,
    spriteHeightInImage: 40,
    spriteWidthInImage: 40,
    spriteHeight: 40,
    spriteWidth: 40,
    verticalOffsets: {
        [Direction.RIGHT]: {
            [MoveType.Run]: 0,
        },
        [Direction.UP]: {
            [MoveType.Run]: 0,
        },
        [Direction.DOWN]: {
            [MoveType.Run]: 0,
        },
        [Direction.LEFT]: {
            [MoveType.Run]: 0,
        }
    }
}