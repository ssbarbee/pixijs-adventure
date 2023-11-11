import { Container } from '@pixi/display';
import { Text } from '@pixi/text';
import { FancyButton } from '@pixi/ui';
import { IScene, Manager } from '../Manager';

export class MenuScene extends Container implements IScene {
    constructor() {
        super();

        // Create a title text
        const titleText = new Text('Main Menu', {
            fontSize: 36,
            fill: 0xffffff,
        });
        titleText.position.set(Manager.width / 2, 100);
        titleText.anchor.set(0.5);
        this.addChild(titleText);

        // Create buttons for New Game, High Score, and Exit Game
        const buttonSpacing = 20;

        const newGameButton = this.createAnimatedButton('New Game', () => {
            // Handle New Game button click
            console.log('New Game button clicked');
        });
        newGameButton.position.set(Manager.width / 2, 200);
        this.addChild(newGameButton);

        const highScoreButton = this.createAnimatedButton('High Score', () => {
            // Handle High Score button click
            console.log('High Score button clicked');
        });
        highScoreButton.position.set(Manager.width / 2, newGameButton.y + newGameButton.height + buttonSpacing);
        this.addChild(highScoreButton);

        const exitGameButton = this.createAnimatedButton('Exit Game', () => {
            // Handle Exit Game button click
            console.log('Exit Game button clicked');
        });
        exitGameButton.position.set(Manager.width / 2, highScoreButton.y + highScoreButton.height + buttonSpacing);
        this.addChild(exitGameButton);
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

    }

    // @ts-ignore
    public resize(screenWidth: number, screenHeight: number): void {

    };
}
