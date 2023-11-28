import { Segment } from './segment';

export interface Segmentable {
  getCornerSegments(segmentsCount?: number): Segment[];
}
