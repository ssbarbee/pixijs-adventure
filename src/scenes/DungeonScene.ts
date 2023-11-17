import { Container } from 'pixi.js';

import { Dungeon } from '../generators/map/Dungeon/Dungeon';
import { IScene } from '../Manager';

export class DungeonScene extends Container implements IScene {
  constructor() {
    super();

    const dungeon = new Dungeon(10);
    dungeon.draw(this);
  }

  public update(): void {}

  resize(): void {}
}
