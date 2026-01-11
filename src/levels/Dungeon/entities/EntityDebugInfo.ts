import { Container, Graphics, Text } from 'pixi.js';

import { INK_COLOR, TILE_COLOR } from '../../../constants';

const DEBUG_RECT_WIDTH = 100;
const DEBUG_LINE_HEIGHT = 14;
const DEBUG_PADDING = 4;

export interface EntityDebugInfoProps {
  container: Container;
  offsetX?: number;
  offsetY?: number;
  parentScaleX?: number;
  parentScaleY?: number;
}

export class EntityDebugInfo {
  private debugText: Text;
  private debugRectangle: Graphics;
  private debugContainer: Container;
  private parentContainer: Container;
  private offsetX: number;
  private offsetY: number;

  constructor(props: EntityDebugInfoProps) {
    this.parentContainer = props.container;
    this.offsetX = props.offsetX ?? 0;
    this.offsetY = props.offsetY ?? -30;

    // Create a container for debug elements that counter-scales parent transformation
    this.debugContainer = new Container();
    const inverseScaleX = 1 / (props.parentScaleX ?? 1);
    const inverseScaleY = 1 / (props.parentScaleY ?? 1);
    this.debugContainer.scale.set(inverseScaleX, inverseScaleY);

    this.debugText = new Text('', {
      fontSize: 10,
      fill: 0x274c7f,
      fontWeight: 'bold',
      fontFamily: 'Arial',
    });

    this.debugRectangle = new Graphics();

    // Add to debug container - rectangle first, then text on top
    this.debugContainer.addChild(this.debugRectangle);
    this.debugContainer.addChild(this.debugText);

    // Add debug container to parent
    this.parentContainer.addChild(this.debugContainer);
  }

  public update(info: Record<string, string | number>): void {
    const entries = Object.entries(info).map(([key, value]) => {
      if (typeof value === 'number') {
        return `${key}: ${value.toFixed(1)}`;
      }
      return `${key}: ${value}`;
    });

    this.debugText.text = entries.join('\n');

    // Calculate height based on number of rows
    const numLines = entries.length;
    const rectHeight = numLines * DEBUG_LINE_HEIGHT + DEBUG_PADDING * 2;

    // Position at top-right of entity
    this.debugText.x = this.offsetX + DEBUG_PADDING;
    this.debugText.y = this.offsetY + DEBUG_PADDING;

    // Fixed width, dynamic height based on content rows
    this.debugRectangle.clear();
    this.debugRectangle
      .roundRect(this.offsetX, this.offsetY, DEBUG_RECT_WIDTH, rectHeight, 4)
      .fill({ color: TILE_COLOR, alpha: 0.9 })
      .stroke({ width: 1, color: INK_COLOR, alpha: 0.8 });

    // Ensure debug info is on top
    this.debugText.zIndex = 100;
    this.debugRectangle.zIndex = 99;
  }

  public destroy(): void {
    this.debugContainer.removeChild(this.debugText);
    this.debugContainer.removeChild(this.debugRectangle);
    this.parentContainer.removeChild(this.debugContainer);
    this.debugText.destroy();
    this.debugRectangle.destroy();
    this.debugContainer.destroy();
  }
}
