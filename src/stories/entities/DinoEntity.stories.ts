import type { Meta, StoryObj } from '@storybook/html';
import { Container } from 'pixi.js';

import { DinoRender } from '../../levels/Dungeon/entities/dino/render';
import { createPixiStory } from '../utils/PixiStoryDecorator';

const meta: Meta = {
  title: 'Entities/DinoEntity',
};

export default meta;

const TILE_SIZE = 64;

export const Idle: StoryObj = {
  render: () =>
    createPixiStory(() => {
      const dino = new DinoRender({ x: 0, y: 0, tileSize: TILE_SIZE });
      dino.stopMoving();
      return dino;
    }),
};

export const Walk: StoryObj = {
  render: () =>
    createPixiStory(() => {
      const dino = new DinoRender({ x: 0, y: 0, tileSize: TILE_SIZE });
      dino.startWalking();
      return dino;
    }),
};

export const Run: StoryObj = {
  render: () =>
    createPixiStory(() => {
      const dino = new DinoRender({ x: 0, y: 0, tileSize: TILE_SIZE });
      dino.startRunning();
      return dino;
    }),
};

export const Dead: StoryObj = {
  render: () =>
    createPixiStory(() => {
      const dino = new DinoRender({ x: 0, y: 0, tileSize: TILE_SIZE });
      dino.playDead();
      return dino;
    }),
};

export const AllStates: StoryObj = {
  render: () =>
    createPixiStory(
      () => {
        const container = new Container();
        const spacing = TILE_SIZE + 40;

        // Idle
        const dinoIdle = new DinoRender({ x: 0, y: 0, tileSize: TILE_SIZE });
        dinoIdle.stopMoving();
        container.addChild(dinoIdle);

        // Walk
        const dinoWalk = new DinoRender({ x: spacing, y: 0, tileSize: TILE_SIZE });
        dinoWalk.startWalking();
        container.addChild(dinoWalk);

        // Run
        const dinoRun = new DinoRender({ x: spacing * 2, y: 0, tileSize: TILE_SIZE });
        dinoRun.startRunning();
        container.addChild(dinoRun);

        // Dead
        const dinoDead = new DinoRender({ x: spacing * 3, y: 0, tileSize: TILE_SIZE });
        dinoDead.playDead();
        container.addChild(dinoDead);

        return container;
      },
      { width: 500, height: 150 },
    ),
};
