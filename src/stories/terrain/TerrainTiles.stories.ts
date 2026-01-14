import type { Meta, StoryObj } from '@storybook/html';
import { Container } from 'pixi.js';

import { Grass0 } from '../../entities/Grass0';
import { Grass1 } from '../../entities/Grass1';
import { Grass2 } from '../../entities/Grass2';
import { Wall0 } from '../../entities/Wall0';
import { Wall1 } from '../../entities/Wall1';
import { Water0 } from '../../entities/Water0';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Terrain/Tiles',
};

export default meta;

const TILE_SIZE = 64;

export const GrassTiles: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();
        container.addChild(new Grass0(0, 0, TILE_SIZE));
        container.addChild(new Grass1(1, 0, TILE_SIZE));
        container.addChild(new Grass2(2, 0, TILE_SIZE));
        return container;
      },
      { width: 250, height: 120 },
    ),
};

export const WallTiles: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();
        container.addChild(new Wall0(0, 0, TILE_SIZE));
        container.addChild(new Wall1(1, 0, TILE_SIZE));
        return container;
      },
      { width: 200, height: 120 },
    ),
};

export const WaterTile: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        return new Water0(0, 0, TILE_SIZE);
      },
      { width: 120, height: 120 },
    ),
};

export const AllTerrainTypes: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();

        // Row 1: Grass variants
        container.addChild(new Grass0(0, 0, TILE_SIZE));
        container.addChild(new Grass1(1, 0, TILE_SIZE));
        container.addChild(new Grass2(2, 0, TILE_SIZE));

        // Row 2: Wall and Water
        container.addChild(new Wall0(0, 1, TILE_SIZE));
        container.addChild(new Wall1(1, 1, TILE_SIZE));
        container.addChild(new Water0(2, 1, TILE_SIZE));

        return container;
      },
      { width: 250, height: 180 },
    ),
};
