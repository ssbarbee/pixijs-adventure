import { Container } from 'pixi.js';

import { generateDungeon } from '../generators/map/Dungeon/Dungeon';
import { DungeonRenderer } from '../generators/map/Dungeon/DungeonRenderer';
import { IScene } from '../Manager';

export class DungeonScene extends Container implements IScene {
  constructor() {
    super();

    this.generateAndDrawDungeon();

    window.addEventListener('keypress', (e) => this.handleKeypress(e));
  }

  private generateAndDrawDungeon(): void {
    // Clear the container of old dungeon elements
    this.removeChildren();

    // Generate and draw the new dungeon
    const dungeon = generateDungeon(10);
    const dungeonRenderer = new DungeonRenderer(dungeon, this);
    dungeonRenderer.draw();
  }

  private handleKeypress(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.generateAndDrawDungeon();
    }
  }

  public update(): void {}

  resize(): void {}
}
