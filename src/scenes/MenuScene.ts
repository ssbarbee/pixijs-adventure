import { Text } from '@pixi/text';
import { FancyButton } from '@pixi/ui';
import { IScene, Manager } from '../Manager';
import { Container } from 'pixi.js';
import { GameScene } from './GameScene';
import { WorldGenerator } from '../WorldGenerator';

export class MenuScene extends Container implements IScene {
    private newGameButton: FancyButton;
    private highScoreButton: FancyButton;
    private exitGameButton: FancyButton;
    private titleText: Text;

    constructor() {
        super();

        // Create a title text
        this.titleText = new Text('Main Menu', {
            fontSize: 36,
            fill: 0xffffff,
        });
        this.titleText.anchor.set(0.5);
        this.addChild(this.titleText);

        this.newGameButton = this.createAnimatedButton('New Game', () => {
            // Handle New Game button click
            const worldGenerator = new WorldGenerator(128, 128);
            const { world, playerStartingY, playerStartingX } = worldGenerator.generateWorld();
            Manager.changeScene(new GameScene(world, playerStartingX, playerStartingY));
        });
        this.highScoreButton = this.createAnimatedButton('High Score', () => {
            // Handle High Score button click
            console.log('High Score button clicked');
        });
        this.exitGameButton = this.createAnimatedButton('Exit Game', () => {
            // Handle Exit Game button click
            console.log('Exit Game button clicked');
        });

        // Initial positioning
        this.positionElements();

        this.addChild(this.newGameButton);
        this.addChild(this.highScoreButton);
        this.addChild(this.exitGameButton);
    }

    private createAnimatedButton(label: string, onClick: () => void): FancyButton {
        const button = new FancyButton({
            text: new Text(label, {
                fontSize: 24,
                fill: '#FFFFFF',
            }),
            animations: {
                hover: {
                    props: {
                        scale: { x: 1.03, y: 1.03 },
                        y: 0,
                    },
                    duration: 100, // Adjust the animation duration as needed
                },
                pressed: {
                    props: {
                        scale: { x: 0.9, y: 0.9 },
                        y: 10,
                    },
                    duration: 100, // Adjust the animation duration as needed
                },
            },
        });

        button.onPress.connect(onClick);
        return button;
    }

    // @ts-ignore
    public update(framesPassed: number): void {
        // Your update logic here
    }

    // @ts-ignore
    public resize(screenWidth: number, screenHeight: number): void {
        // Update positions of elements on resize
        this.positionElements();
    }

    private positionElements(): void {
        // Calculate positions based on screen dimensions
        const buttonSpacing = 20;
        const centerX = Manager.width / 2;

        this.titleText.position.set(centerX, 100);

        this.newGameButton.position.set(centerX, 200);
        this.highScoreButton.position.set(centerX, this.newGameButton.y + this.newGameButton.height + buttonSpacing);
        this.exitGameButton.position.set(centerX, this.highScoreButton.y + this.highScoreButton.height + buttonSpacing);
    }
}
