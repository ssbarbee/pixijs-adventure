import type { Meta, StoryObj } from '@storybook/html';
import { Container } from 'pixi.js';

import { PlayerRender } from '../../levels/Dungeon/entities/player/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Dungeon/Entities/PlayerEntity',
};

export default meta;

export const Default: StoryObj = {
  render: () =>
    createPixiStory(() => {
      return new PlayerRender({ x: 0, y: 0, tileSize: 64 });
    }),
};

export const SmallTile: StoryObj = {
  render: () =>
    createPixiStory(() => {
      return new PlayerRender({ x: 0, y: 0, tileSize: 32 });
    }),
};

export const LargeTile: StoryObj = {
  render: () =>
    createPixiStory(() => {
      return new PlayerRender({ x: 0, y: 0, tileSize: 128 });
    }),
};

export const AllSizes: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();

        const small = new PlayerRender({ x: 0, y: 0, tileSize: 32 });
        container.addChild(small);

        const medium = new PlayerRender({ x: 60, y: 0, tileSize: 64 });
        container.addChild(medium);

        const large = new PlayerRender({ x: 160, y: 0, tileSize: 128 });
        container.addChild(large);

        return container;
      },
      { width: 400, height: 200 },
    ),
};
