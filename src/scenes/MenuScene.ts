import { Text } from '@pixi/text';
import { FancyButton } from '@pixi/ui';
import { Container } from 'pixi.js';

import { generateWorld } from '../generators/map/CellularMapGenerator';
import { generateMap as generateNoiseWorld } from '../generators/map/NoiseJSMapGenerator';
import { IScene, Manager } from '../Manager';
import { DungeonScene } from './DungeonScene';
import { GameScene } from './GameScene';

export class MenuScene extends Container implements IScene {
  private cellularMapSceneButton: FancyButton;
  private noiseMapSceneButton: FancyButton;
  private dungeonSceneButton: FancyButton;
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

    this.cellularMapSceneButton = this.createAnimatedButton('Woods', () => {
      // Handle New Game button click
      const { world, playerStartingY, playerStartingX } = generateWorld(128, 128);
      Manager.changeScene(new GameScene(world, playerStartingX, playerStartingY));
    });
    this.noiseMapSceneButton = this.createAnimatedButton('Terrain', () => {
      // Handle New Game button click
      const { world, playerStartingY, playerStartingX } = generateNoiseWorld({
        width: 128,
        height: 128,
        waterThreshold: -0.3,
        mountainThreshold: 0.3,
      });
      Manager.changeScene(new GameScene(world, playerStartingX, playerStartingY));
    });
    this.dungeonSceneButton = this.createAnimatedButton('Dungeon', () => {
      // Handle New Game button click
      Manager.changeScene(new DungeonScene());
    });
    this.highScoreButton = this.createAnimatedButton('High Score', () => {
      // Handle High Score button click
      // console.log('High Score button clicked');
    });
    this.exitGameButton = this.createAnimatedButton('Exit Game', () => {
      // Handle Exit Game button click
      // console.log('Exit Game button clicked');
    });

    // Initial positioning
    this.positionElements();

    this.addChild(this.cellularMapSceneButton);
    this.addChild(this.noiseMapSceneButton);
    this.addChild(this.dungeonSceneButton);
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

  public update(): void {
    // Your update logic here
  }

  public resize(): void {
    // Update positions of elements on resize
    this.positionElements();
  }

  private positionElements(): void {
    // Calculate positions based on screen dimensions
    const buttonSpacing = 20;
    const centerX = Manager.width / 2;

    // Set the initial Y position for the first button
    let currentY = this.titleText.y + this.titleText.height + buttonSpacing;

    // Array of buttons
    const buttons = [
      this.cellularMapSceneButton,
      this.noiseMapSceneButton,
      this.dungeonSceneButton,
      this.highScoreButton,
      this.exitGameButton,
    ];

    // Iterate through the buttons to position them
    buttons.forEach((button) => {
      button.position.set(centerX, currentY);
      currentY += button.height + buttonSpacing;
    });
  }
}
