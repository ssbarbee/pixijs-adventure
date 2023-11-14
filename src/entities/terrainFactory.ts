import { Wall0 } from './Wall0';
import { Grass1 } from './Grass1';
import { Grass0 } from './Grass0';
import { Grass2 } from './Grass2';
import { Wall1 } from './Wall1';
import { GRASS0, GRASS1, GRASS2, WALL0, WALL1, WATER0 } from '../constants';
import { Water0 } from './Water0';

export const generateTerrainSprite = (x: number, y: number, terrainType: string) => {
    switch (terrainType) {
        case WALL0: return new Wall0(x, y);
        case WALL1: return new Wall1(x, y);
        case GRASS0: return new Grass0(x, y);
        case GRASS1: return new Grass1(x, y);
        case GRASS2: return new Grass2(x, y);
        case WATER0: return new Water0(x, y);
    }
    throw new Error('not implemented')
}