import { EngineInfo } from "../EngineInfo";

export enum MobSpeed {
    Stop = 0,
    Slow = 1,
    Fast = EngineInfo.BLOCK_SIZE / 20,
    VeryFast = 2*MobSpeed.Fast,
}
