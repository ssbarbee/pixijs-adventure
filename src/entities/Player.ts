import { Sprite, Texture } from 'pixi.js';

export class Player extends Sprite {
    private world: string[][]; // Add a property for the world array
    private tileSize: number;

    constructor(tileSize: number, startingX: number, startingY: number, world: string[][]) {
        const texture = Texture.from('player');
        super(texture);

        this.tileSize = tileSize;
        this.world = world;

        // Set the player scale to fit the tile size
        this.scale.set(this.tileSize / this.width, tileSize / this.height);

        // Set the anchor to the center
        this.anchor.set(0.5, 0.5);

        // Set the player's initial position
        this.x = startingX * this.tileSize + this.tileSize / 2;
        this.y = startingY * this.tileSize + this.tileSize / 2;
        // Add keyboard event listeners
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        this.move(event.key);
    }

    public move(direction: string) {
        const moveSpeed = 10; // Adjust this value for movement speed

        let newX = this.x;
        let newY = this.y;

        switch (direction) {
            case "ArrowUp":
                newY -= moveSpeed;
                break;
            case "ArrowDown":
                newY += moveSpeed;
                break;
            case "ArrowLeft":
                newX -= moveSpeed;
                break;
            case "ArrowRight":
                newX += moveSpeed;
                break;
        }

        // Calculate the edges of the player in the direction of movement
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        let edgeX = newX;
        let edgeY = newY;

        if (direction === "ArrowUp") edgeY -= halfHeight;
        if (direction === "ArrowDown") edgeY += halfHeight;
        if (direction === "ArrowLeft") edgeX -= halfWidth;
        if (direction === "ArrowRight") edgeX += halfWidth;

        // Calculate the tile coordinates of the edge
        const edgeTileX = Math.floor(edgeX / this.tileSize);
        const edgeTileY = Math.floor(edgeY / this.tileSize);

        // Check if the edge position is a wall
        let isWall = !this.world[edgeTileX] || this.world[edgeTileX][edgeTileY] === 'w0' || this.world[edgeTileX][edgeTileY] === 'w1';
        if (!isWall) {
            this.x = newX;
            this.y = newY;
        }
    }

    public override destroy() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        super.destroy();
    }
}