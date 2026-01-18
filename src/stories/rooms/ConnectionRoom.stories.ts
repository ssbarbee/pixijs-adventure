import type { Meta, StoryObj } from '@storybook/html';
import { Container } from 'pixi.js';

import { ConnectionRoomRender } from '../../levels/Dungeon/entities/room/connection/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Dungeon/Rooms/ConnectionRoom',
};

export default meta;

const TILE_SIZE = 32;

export const HorizontalCorridor: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const corridorWidth = 8;
        const corridorHeight = 2;
        const offsetX = (400 - corridorWidth * TILE_SIZE) / 2;
        const offsetY = (400 - corridorHeight * TILE_SIZE) / 2;

        return new ConnectionRoomRender({
          id: 'CONN1',
          x: 0,
          y: 0,
          width: corridorWidth,
          height: corridorHeight,
          tileSize: TILE_SIZE,
          offsetX,
          offsetY,
        });
      },
      { center: false },
    ),
};

export const VerticalCorridor: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const corridorWidth = 2;
        const corridorHeight = 8;
        const offsetX = (400 - corridorWidth * TILE_SIZE) / 2;
        const offsetY = (400 - corridorHeight * TILE_SIZE) / 2;

        return new ConnectionRoomRender({
          id: 'CONN2',
          x: 0,
          y: 0,
          width: corridorWidth,
          height: corridorHeight,
          tileSize: TILE_SIZE,
          offsetX,
          offsetY,
        });
      },
      { center: false },
    ),
};

export const AllTypes: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();

        // Horizontal corridor
        const horizontal = new ConnectionRoomRender({
          id: 'H1',
          x: 0,
          y: 0,
          width: 5,
          height: 2,
          tileSize: TILE_SIZE,
          offsetX: 50,
          offsetY: 100,
        });
        container.addChild(horizontal);

        // Vertical corridor
        const vertical = new ConnectionRoomRender({
          id: 'V1',
          x: 0,
          y: 0,
          width: 2,
          height: 5,
          tileSize: TILE_SIZE,
          offsetX: 250,
          offsetY: 100,
        });
        container.addChild(vertical);

        return container;
      },
      { center: false },
    ),
};

export const DebugGrid: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const corridorWidth = 6;
        const corridorHeight = 2;
        const offsetX = (400 - corridorWidth * TILE_SIZE) / 2;
        const offsetY = (400 - corridorHeight * TILE_SIZE) / 2;

        return new ConnectionRoomRender({
          id: 'CONN3',
          x: 0,
          y: 0,
          width: corridorWidth,
          height: corridorHeight,
          tileSize: TILE_SIZE,
          offsetX,
          offsetY,
          debug: true,
        });
      },
      { center: false },
    ),
};
