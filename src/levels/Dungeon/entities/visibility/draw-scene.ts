import { Graphics } from 'pixi.js';

import { TILE_COLOR } from '../../../../constants';
import { Point } from './point';
export const createVisibilityTriangles = (
  color: number, // PixiJS uses numeric color values
  lightSource: Point,
  visibilityOutput: Point[][],
): Graphics => {
  const graphics = new Graphics();
  graphics.beginFill(color, 0.3);
  // graphics.lineStyle(1, color, 0.3);

  for (const points of visibilityOutput) {
    graphics.moveTo(lightSource.x, lightSource.y);
    graphics.lineTo(points[0].x, points[0].y);
    graphics.lineTo(points[1].x, points[1].y);
    graphics.closePath();
  }

  graphics.endFill();
  return graphics;
};

export const createScene = (lightSource: Point, visibilityOutput: Point[][]): Graphics => {
  const sceneGraphics = new Graphics();

  const triangleGraphics = createVisibilityTriangles(TILE_COLOR, lightSource, visibilityOutput);
  sceneGraphics.addChild(triangleGraphics);

  return sceneGraphics;
};
