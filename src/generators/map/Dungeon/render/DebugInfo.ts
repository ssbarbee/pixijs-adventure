import { Container, Graphics, Text, Ticker } from 'pixi.js';

import { INK_COLOR, TILE_COLOR } from '../../../../constants';

export class DebugInfo {
  private debugText: Text | null = null;
  private debugRectangle: Graphics | null = null;
  private container: Container;
  private tileSize: number;

  constructor(container: Container, tileSize: number) {
    this.container = container;
    this.tileSize = tileSize;
  }

  public draw({ playerX, playerY }: { playerX: number; playerY: number }): void {
    const debugInfo = `Player: x:${playerX.toFixed(3)}, y:${playerY.toFixed(
      3,
    )},\nFPS:${Ticker.shared.FPS.toFixed(2)}`;

    if (!this.debugText) {
      this.debugText = new Text(debugInfo, {
        fontSize: this.tileSize / 3,
        fill: 0x274c7f,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        fontStyle: 'italic',
      });
      this.debugText.x = 16;
      this.debugText.y = 16;
      this.container.addChild(this.debugText);
    } else {
      this.debugText.text = debugInfo;
    }

    const padding = 10;
    const rectWidth = this.debugText.width + padding * 2;
    const rectHeight = this.debugText.height + padding * 2;

    if (!this.debugRectangle) {
      this.debugRectangle = new Graphics();
      this.container.addChildAt(this.debugRectangle, 0);
    }

    this.debugRectangle.clear();
    this.debugRectangle.lineStyle(2, INK_COLOR, 1);
    this.debugRectangle.beginFill(TILE_COLOR);
    this.debugRectangle.drawRoundedRect(
      this.debugText.x - padding,
      this.debugText.y - padding,
      rectWidth,
      rectHeight,
      10,
    );
    this.debugRectangle.endFill();

    // Set a high zIndex to ensure its on top
    this.debugText.zIndex = 1000;
    this.debugRectangle.zIndex = 999; // Slightly lower so it's behind the text
  }
}
