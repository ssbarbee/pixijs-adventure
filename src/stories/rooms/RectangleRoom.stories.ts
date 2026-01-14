import type { Meta, StoryObj } from '@storybook/html';

import { RectangleRoomRender } from '../../levels/Dungeon/entities/room/rectangle/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Rooms/RectangleRoom',
};

export default meta;

const TILE_SIZE = 32;

export const SmallRoom: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const roomWidth = 5;
        const roomHeight = 4;
        const offsetX = (400 - roomWidth * TILE_SIZE) / 2;
        const offsetY = (400 - roomHeight * TILE_SIZE) / 2;

        return new RectangleRoomRender({
          id: 'R1',
          x: 0,
          y: 0,
          width: roomWidth,
          height: roomHeight,
          obstacles: [],
          tileSize: TILE_SIZE,
          offsetX,
          offsetY,
        });
      },
      { center: false },
    ),
};

export const LargeRoom: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const roomWidth = 8;
        const roomHeight = 6;
        const offsetX = (400 - roomWidth * TILE_SIZE) / 2;
        const offsetY = (400 - roomHeight * TILE_SIZE) / 2;

        return new RectangleRoomRender({
          id: 'R2',
          x: 0,
          y: 0,
          width: roomWidth,
          height: roomHeight,
          obstacles: [],
          tileSize: TILE_SIZE,
          offsetX,
          offsetY,
        });
      },
      { center: false },
    ),
};

export const RoomWithObstacles: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const roomWidth = 8;
        const roomHeight = 6;
        const offsetX = (400 - roomWidth * TILE_SIZE) / 2;
        const offsetY = (400 - roomHeight * TILE_SIZE) / 2;

        return new RectangleRoomRender({
          id: 'R3',
          x: 0,
          y: 0,
          width: roomWidth,
          height: roomHeight,
          obstacles: [
            { x: 2, y: 2, width: 1, height: 1, type: 'square' },
            { x: 5, y: 3, width: 2, height: 1, type: 'rectangle' },
          ],
          tileSize: TILE_SIZE,
          offsetX,
          offsetY,
        });
      },
      { center: false },
    ),
};
