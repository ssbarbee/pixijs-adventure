import { Graphics } from 'pixi.js';

import { TILE_COLOR } from '../../../../constants';
import { Point } from './point';
export const createVisibilityTriangles = (
  color: number, // PixiJS uses numeric color values
  lightSource: Point,
  visibilityOutput: Point[][],
): Graphics => {
  const graphics = new Graphics();

  for (const points of visibilityOutput) {
    graphics
      .moveTo(lightSource.x, lightSource.y)
      .lineTo(points[0].x, points[0].y)
      .lineTo(points[1].x, points[1].y)
      .closePath()
      .fill({ color, alpha: 0.3 });
  }

  return graphics;
};

export const createScene = (lightSource: Point, visibilityOutput: Point[][]): Graphics => {
  const sceneGraphics = new Graphics();

  const triangleGraphics = createVisibilityTriangles(TILE_COLOR, lightSource, visibilityOutput);
  sceneGraphics.addChild(triangleGraphics);

  return sceneGraphics;
};
