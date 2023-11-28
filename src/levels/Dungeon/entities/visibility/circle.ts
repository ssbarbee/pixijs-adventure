import { Segment } from './segment';
import { Segmentable } from './segmentable';

export class Circle implements Segmentable {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  public getCornerSegments(segmentCount: number = 36): Segment[] {
    const segments: Segment[] = [];
    const angleStep = (2 * Math.PI) / segmentCount;

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;

      const startX = this.x + this.radius * Math.cos(startAngle);
      const startY = this.y + this.radius * Math.sin(startAngle);
      const endX = this.x + this.radius * Math.cos(endAngle);
      const endY = this.y + this.radius * Math.sin(endAngle);

      segments.push(new Segment(startX, startY, endX, endY));
    }

    return segments;
  }
}
