import { Graphics } from 'pixi.js';
import { GRASS0, WALL0, WATER0 } from '../../constants';

export function drawTerrainTile(x: number, y: number, tileSize: number, tileType: string): Graphics {
    const graphics = new Graphics();

    // Set the position for the tile
    graphics.x = x * tileSize;
    graphics.y = y * tileSize;

    // Determine the color based on the tile type
    switch (tileType) {
        case WATER0:
            graphics.beginFill(0x0000FF); // Blue for water
            break;
        case GRASS0:
            graphics.beginFill(0x00FF00); // Green for grass
            break;
        case WALL0:
            graphics.beginFill(0xA52A2A); // Brown for wall
            break;
        default:
            graphics.beginFill(0xFFFFFF); // White as default
            break;
    }

    // Draw the tile as a rectangle
    graphics.drawRect(0, 0, tileSize, tileSize);
    graphics.endFill();

    return graphics;
}