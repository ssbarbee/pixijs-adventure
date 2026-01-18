import type { Meta, StoryObj } from '@storybook/html';
import { Container } from 'pixi.js';

import { TrophyRender } from '../../levels/Dungeon/entities/trophy/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Dungeon/Entities/TrophyEntity',
};

export default meta;

export const Active: StoryObj = {
  render: () =>
    createPixiStory(() => {
      const trophy = new TrophyRender({ x: 0, y: 0, tileSize: 64 });
      trophy.update(false);
      return trophy;
    }),
};

export const Collected: StoryObj = {
  render: () =>
    createPixiStory(() => {
      const trophy = new TrophyRender({ x: 0, y: 0, tileSize: 64 });
      trophy.update(true);
      return trophy;
    }),
};

export const AllStates: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();

        const active = new TrophyRender({ x: 0, y: 0, tileSize: 64 });
        active.update(false);
        container.addChild(active);

        const collected = new TrophyRender({ x: 100, y: 0, tileSize: 64 });
        collected.update(true);
        container.addChild(collected);

        return container;
      },
      { width: 250, height: 150 },
    ),
};
