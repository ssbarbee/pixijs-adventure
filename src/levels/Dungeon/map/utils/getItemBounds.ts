import { CircularRoom, ConnectableRoom, ConnectionRoom, IRectangle, RectangleRoom } from '../types';

export function getItemBounds(item: ConnectableRoom | ConnectionRoom): IRectangle {
  if (item.type === 'rectangle') {
    // For rectangular rooms, return the position and dimensions as is
    return {
      x: item.x,
      y: item.y,
      width: (item as RectangleRoom).width,
      height: (item as RectangleRoom).height,
    };
  } else if (item.type === 'circular') {
    // For circular rooms, calculate the bounding box
    return {
      x: item.x - (item as CircularRoom).radius,
      y: item.y - (item as CircularRoom).radius,
      width: (item as CircularRoom).radius * 2,
      height: (item as CircularRoom).radius * 2,
    };
  } else if (item.type === 'connection') {
    // For connections, assume they are rectangular
    return {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    };
  }

  throw new Error('Unknown item type');
}
