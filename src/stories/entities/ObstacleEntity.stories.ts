import type { Meta, StoryObj } from '@storybook/html';
import { Container } from 'pixi.js';

import { ObstacleRender } from '../../levels/Dungeon/entities/obstacle/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Dungeon/Entities/ObstacleEntity',
};

export default meta;

const TILE_SIZE = 32;
const OFFSET = 50;

export const SmallSquare: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new ObstacleRender({
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          type: 'square',
          tileSize: TILE_SIZE,
          offsetX: OFFSET,
          offsetY: OFFSET,
        });
      },
      { width: 200, height: 200 },
    ),
};

export const LargeSquare: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new ObstacleRender({
          x: 0,
          y: 0,
          width: 2,
          height: 2,
          type: 'square',
          tileSize: TILE_SIZE,
          offsetX: OFFSET,
          offsetY: OFFSET,
        });
      },
      { width: 200, height: 200 },
    ),
};

export const Rectangle: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new ObstacleRender({
          x: 0,
          y: 0,
          width: 3,
          height: 1,
          type: 'rectangle',
          tileSize: TILE_SIZE,
          offsetX: OFFSET,
          offsetY: OFFSET,
        });
      },
      { width: 250, height: 200 },
    ),
};

export const AllTypes: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();

        // Small square (1x1)
        const smallSquare = new ObstacleRender({
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          type: 'square',
          tileSize: TILE_SIZE,
          offsetX: OFFSET,
          offsetY: OFFSET,
        });
        container.addChild(smallSquare);

        // Large square (2x2)
        const largeSquare = new ObstacleRender({
          x: 3,
          y: 0,
          width: 2,
          height: 2,
          type: 'square',
          tileSize: TILE_SIZE,
          offsetX: OFFSET,
          offsetY: OFFSET,
        });
        container.addChild(largeSquare);

        // Rectangle (3x1)
        const rectangle = new ObstacleRender({
          x: 0,
          y: 3,
          width: 3,
          height: 1,
          type: 'rectangle',
          tileSize: TILE_SIZE,
          offsetX: OFFSET,
          offsetY: OFFSET,
        });
        container.addChild(rectangle);

        return container;
      },
      { width: 350, height: 250 },
    ),
};
