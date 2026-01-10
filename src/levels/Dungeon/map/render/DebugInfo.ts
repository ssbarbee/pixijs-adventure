import { Container, Graphics, Text, Ticker } from 'pixi.js';

import { INK_COLOR, TILE_COLOR } from '../../../../constants';

export class DebugInfo {
  private debugText: Text | null = null;
  private debugRectangle: Graphics | null = null;
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  public draw(): void {
    const debugInfo = `FPS: ${Ticker.shared.FPS.toFixed(0)}`;

    if (!this.debugText) {
      this.debugText = new Text(debugInfo, {
        fontSize: 16,
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
    this.debugRectangle
      .roundRect(this.debugText.x - padding, this.debugText.y - padding, rectWidth, rectHeight, 10)
      .fill(TILE_COLOR)
      .stroke({ width: 2, color: INK_COLOR, alpha: 1 });

    // Set a high zIndex to ensure its on top
    this.debugText.zIndex = 1000;
    this.debugRectangle.zIndex = 999;
  }
}
