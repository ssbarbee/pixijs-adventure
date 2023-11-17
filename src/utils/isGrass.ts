import { GRASS0, GRASS1, GRASS2 } from '../constants';

export const isGrass = (tile: string) => tile === GRASS0 || tile === GRASS1 || tile === GRASS2;
