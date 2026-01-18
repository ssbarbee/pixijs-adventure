import type { Meta, StoryObj } from '@storybook/html';

import { CircularRoomRender } from '../../levels/Dungeon/entities/room/circular/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Dungeon/Rooms/CircularRoom',
};

export default meta;

const TILE_SIZE = 32;
const CANVAS_SIZE = 400;
const CANVAS_CENTER = CANVAS_SIZE / 2;

export const SmallRadius: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new CircularRoomRender({
          id: 'C1',
          x: 0,
          y: 0,
          radius: 3,
          obstacleRenders: [],
          tileSize: TILE_SIZE,
          offsetX: CANVAS_CENTER,
          offsetY: CANVAS_CENTER,
        });
      },
      { center: false },
    ),
};

export const LargeRadius: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new CircularRoomRender({
          id: 'C2',
          x: 0,
          y: 0,
          radius: 5,
          obstacleRenders: [],
          tileSize: TILE_SIZE,
          offsetX: CANVAS_CENTER,
          offsetY: CANVAS_CENTER,
        });
      },
      { center: false },
    ),
};

export const WithObstacles: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new CircularRoomRender({
          id: 'C3',
          x: 0,
          y: 0,
          radius: 4,
          obstacleRenders: [],
          tileSize: TILE_SIZE,
          offsetX: CANVAS_CENTER,
          offsetY: CANVAS_CENTER,
        });
      },
      { center: false },
    ),
};
