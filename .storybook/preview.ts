import type { Preview } from '@storybook/html';
import { Assets } from 'pixi.js';

import { manifest } from '../src/assets';

let assetsLoaded = false;

const preview: Preview = {
  loaders: [
    async () => {
      if (!assetsLoaded) {
        await Assets.init({ manifest });
        const bundleIds = manifest.bundles.map((bundle) => bundle.name);
        await Assets.loadBundle(bundleIds);
        assetsLoaded = true;
      }
      return {};
    },
  ],
  parameters: {
    backgrounds: {
      default: 'dungeon',
      values: [
        { name: 'dungeon', value: '#2d2d2d' },
        { name: 'light', value: '#f0f0f0' },
      ],
    },
  },
};

export default preview;
