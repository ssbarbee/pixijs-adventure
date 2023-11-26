import { drawScene } from './draw-scene';
import { loadMap } from './load-map';
import { Point } from './point';
import { Rectangle } from './rectangle';
import { Segment } from './segment';
import { calculateVisibility } from './visibility';

// Prepare canvas
const canvas = document.getElementById('scene') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Could not get element');
}
const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Could not get context');
}
const xOffset = 0.5;
const yOffset = 0.5;
ctx.translate(xOffset, yOffset);

// Setup scene
const room = new Rectangle(0, 0, 700, 500);

const walls = [
  new Segment(20, 20, 20, 120),
  new Segment(20, 20, 100, 20),
  new Segment(100, 20, 150, 100),
  new Segment(150, 100, 50, 100),
];

const blocks = [
  new Rectangle(50, 150, 20, 20),
  new Rectangle(150, 150, 40, 80),
  new Rectangle(400, 400, 40, 40),
];

const run = (lightSource: Point) => {
  const endpoints = loadMap(room, blocks, walls, lightSource);
  const visibility = calculateVisibility(lightSource, endpoints);

  requestAnimationFrame(() => drawScene(ctx, lightSource, blocks, walls, visibility));
};

canvas.addEventListener('mousemove', ({ pageX, pageY }) => {
  run(new Point(pageX, pageY));
});

run(new Point(100, 100));
