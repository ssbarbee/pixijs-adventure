import { Graphics } from 'pixi.js';

import { createScene } from './draw-scene';
import { loadMap } from './load-map';
import { Point } from './point';
import { Rectangle } from './rectangle';
import { Segmentable } from './segmentable';
import { calculateVisibility } from './visibility';

export class VisibilityRender {
  public draw(room: Segmentable, blocks: Rectangle[], lightSource: Point): Graphics {
    const endpoints = loadMap(room, blocks, lightSource);
    const visibility = calculateVisibility(lightSource, endpoints);
    return createScene(lightSource, visibility);
  }
}
