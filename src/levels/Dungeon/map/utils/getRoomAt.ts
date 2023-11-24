// Helper function to check if a point is inside a rectangle
import { CircularRoom, ConnectableRoom, ConnectionRoom, IRectangle, RectangleRoom } from '../types';

function isPointInsideRectangle(rect: IRectangle, x: number, y: number): boolean {
  return x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
}

// Helper function to check if a point is inside a circle
function isPointInsideCircle(circle: CircularRoom, x: number, y: number): boolean {
  const dx = x - circle.x;
  const dy = y - circle.y;
  const distanceSquared = dx * dx + dy * dy;
  return distanceSquared < circle.radius * circle.radius;
}

function isPointInsideItem(x: number, y: number, item: ConnectableRoom | ConnectionRoom): boolean {
  if (item.type === 'rectangle' || item.type === 'connection') {
    // Rectangular room or connection
    return isPointInsideRectangle(item as RectangleRoom, x, y);
  } else if (item.type === 'circular') {
    // Circular room
    return isPointInsideCircle(item as CircularRoom, x, y);
  }
  return false;
}

export function getRoomAt(
  x: number,
  y: number,
  grid: (ConnectableRoom | ConnectionRoom)[][][],
  gridSize: number,
): ConnectableRoom | ConnectionRoom | null {
  const gridX = Math.floor(x / gridSize);
  const gridY = Math.floor(y / gridSize);

  if (grid[gridX] && grid[gridX][gridY]) {
    const items = grid[gridX][gridY];
    for (const item of items) {
      if (isPointInsideItem(x, y, item)) {
        return item;
      }
    }
  }

  return null;
}
