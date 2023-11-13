import { Sprite, Texture } from 'pixi.js';

export class Player extends Sprite {
    private world: string[][]; // Add a property for the world array
    private tileSize: number;
    private keysPressed: Set<string> = new Set(); // Holds the keys that are currently pressed

    constructor(tileSize: number, startingX: number, startingY: number, world: string[][]) {
        const texture = Texture.from('player');
        super(texture);

        this.tileSize = tileSize;
        this.world = world;
        this.scale.set(this.tileSize / this.width, this.tileSize / this.height);
        this.anchor.set(0.5, 0.5);
        this.x = startingX * this.tileSize + this.tileSize / 2;
        this.y = startingY * this.tileSize + this.tileSize / 2;

        // Add keyboard event listeners for both keydown and keyup
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        this.keysPressed.add(event.key); // Add the key to the state when it's pressed
        event.preventDefault(); // Prevent default to avoid scrolling the window
    }

    private handleKeyUp(event: KeyboardEvent) {
        this.keysPressed.delete(event.key); // Remove the key from the state when it's released
    }

    public update(framesPassed: number) { // Use framesPassed to account for frame rate
        const baseMoveSpeed = 5; // Base move speed, you can adjust this as needed
        const moveSpeed = baseMoveSpeed * framesPassed; // Scale move speed by frames passed

        let newX = this.x;
        let newY = this.y;

        // Check for each key in the keysPressed set and move accordingly
        if (this.keysPressed.has("ArrowUp")) newY -= moveSpeed;
        if (this.keysPressed.has("ArrowDown")) newY += moveSpeed;
        if (this.keysPressed.has("ArrowLeft")) newX -= moveSpeed;
        if (this.keysPressed.has("ArrowRight")) newX += moveSpeed;

        // Calculate the edges of the player in the direction of movement
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        let edgeX = newX;
        let edgeY = newY;

        if (this.keysPressed.has("ArrowUp")) edgeY -= halfHeight;
        if (this.keysPressed.has("ArrowDown")) edgeY += halfHeight;
        if (this.keysPressed.has("ArrowLeft")) edgeX -= halfWidth;
        if (this.keysPressed.has("ArrowRight")) edgeX += halfWidth;

        // Calculate the tile coordinates of the edge
        const edgeTileX = Math.floor(edgeX / this.tileSize);
        const edgeTileY = Math.floor(edgeY / this.tileSize);

        // Check if the edge position is a wall
        let isWall = !this.world[edgeTileX] || !this.world[edgeTileX][edgeTileY] || this.world[edgeTileX][edgeTileY] === 'w0' || this.world[edgeTileX][edgeTileY] === 'w1';
        if (!isWall) {
            this.x = newX;
            this.y = newY;
        }
    }

    public override destroy() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        window.removeEventListener("keyup", this.handleKeyUp.bind(this));
        super.destroy();
    }
}