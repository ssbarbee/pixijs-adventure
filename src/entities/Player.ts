import { Sprite, Texture } from 'pixi.js';

export class Player extends Sprite {

    constructor(tileSize: number, startingX: number, startingY: number) {
        const texture = Texture.from('clampy');
        super(texture);

        // Set the player scale to fit the tile size
        this.scale.set(tileSize / this.width, tileSize / this.height);

        // Set the anchor to the center
        this.anchor.set(0.5, 0.5);

        // Set the player's initial position
        this.x = startingX * tileSize + tileSize / 2;
        this.y = startingY * tileSize + tileSize / 2;
        // Add keyboard event listeners
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        this.move(event.key);
    }

    public move(direction: string) {
        const moveSpeed = 10; // Adjust this value for movement speed

        switch (direction) {
            case "ArrowUp":
                this.y -= moveSpeed;
                break;
            case "ArrowDown":
                this.y += moveSpeed;
                break;
            case "ArrowLeft":
                this.x -= moveSpeed;
                break;
            case "ArrowRight":
                this.x += moveSpeed;
                break;
        }
    }

    public override destroy() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        super.destroy();
    }
}