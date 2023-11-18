import { Container } from 'pixi.js';

import { Dungeon } from '../generators/map/Dungeon/Dungeon';
import { DungeonRenderer } from '../generators/map/Dungeon/DungeonRenderer';
import { IScene } from '../Manager';

export class DungeonScene extends Container implements IScene {
  constructor() {
    super();

    const dungeon = new Dungeon(10);
    const dungeonRenderer = new DungeonRenderer(dungeon, this);
    dungeonRenderer.draw();
  }

  public update(): void {}

  resize(): void {}
}
