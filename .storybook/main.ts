import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: (config) => {
    // Suppress the virtual module warning from Storybook
    config.build = {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        onwarn: (warning, warn) => {
          if (warning.message?.includes('virtual:/@storybook')) {
            return;
          }
          warn(warning);
        },
      },
    };
    return config;
  },
};

export default config;
