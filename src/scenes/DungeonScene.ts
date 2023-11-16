import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { IScene, Manager } from '../Manager';
import { Player } from '../entities/Player';
import { generateTerrainSprite } from '../entities/terrainFactory';
import { Dungeon } from '../generators/map/Dungeon/Dungeon';

export class DungeonScene extends Container implements IScene {
    constructor() {
        super();

        let dungeon = new Dungeon(10);
        dungeon.draw(this);
    }

    public update(_framesPassed: number): void {

    }

    resize(_screenWidth: number, _screenHeight: number): void {
    }
}
