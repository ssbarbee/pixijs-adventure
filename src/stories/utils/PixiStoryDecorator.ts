import { Application, Container } from 'pixi.js';

export interface PixiStoryOptions {
  width?: number;
  height?: number;
  backgroundColor?: number;
  center?: boolean;
}

export function createPixiStory(
  createContent: () => Container,
  options: PixiStoryOptions = {},
): HTMLElement {
  const { width = 400, height = 400, backgroundColor = 0x2d2d2d, center = true } = options;

  const wrapper = document.createElement('div');
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;

  // Initialize PixiJS asynchronously but return the wrapper immediately
  const app = new Application();
  app
    .init({
      width,
      height,
      backgroundColor,
      resolution: window.devicePixelRatio || 2,
    })
    .then(() => {
      // Ensure canvas displays at the correct CSS size
      app.canvas.style.width = `${width}px`;
      app.canvas.style.height = `${height}px`;
      wrapper.appendChild(app.canvas);

      const content = createContent();
      app.stage.addChild(content);

      // Center content in stage if requested
      if (center) {
        content.x = width / 2 - content.width / 2;
        content.y = height / 2 - content.height / 2;
      }
    });

  return wrapper;
}
