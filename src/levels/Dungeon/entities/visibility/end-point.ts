import { Point } from './point';
import { Segment } from './segment';

export class EndPoint extends Point {
  public beginsSegment?: boolean;
  public segment?: Segment;
  public angle?: number;
}
