import { FancyButton } from '@pixi/ui';
import { Container, Text } from 'pixi.js';

import { IScene, Manager } from '../Manager';

export interface VictorySceneCallbacks {
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export class VictoryScene extends Container implements IScene {
  private titleText: Text;
  private timeText: Text;
  private playAgainButton: FancyButton;
  private menuButton: FancyButton;

  constructor(elapsedTimeMs: number, callbacks: VictorySceneCallbacks) {
    super();

    const seconds = Math.floor(elapsedTimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString =
      minutes > 0
        ? `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`
        : `${remainingSeconds}s`;

    // Victory title
    this.titleText = new Text('You Won!', {
      fontSize: 64,
      fill: 0xffd700,
      fontWeight: 'bold',
    });
    this.titleText.anchor.set(0.5);
    this.addChild(this.titleText);

    // Time display
    this.timeText = new Text(`Time: ${timeString}`, {
      fontSize: 32,
      fill: 0xffffff,
    });
    this.timeText.anchor.set(0.5);
    this.addChild(this.timeText);

    this.playAgainButton = this.createButton('Play Again', callbacks.onPlayAgain);
    this.addChild(this.playAgainButton);

    this.menuButton = this.createButton('Main Menu', callbacks.onMainMenu);
    this.addChild(this.menuButton);

    this.positionElements();
  }

  private createButton(label: string, onClick: () => void): FancyButton {
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
          duration: 100,
        },
        pressed: {
          props: {
            scale: { x: 0.9, y: 0.9 },
            y: 10,
          },
          duration: 100,
        },
      },
    });

    button.onPress.connect(onClick);
    return button;
  }

  private positionElements(): void {
    const centerX = Manager.width / 2;
    const centerY = Manager.height / 2;

    this.titleText.position.set(centerX, centerY - 100);
    this.timeText.position.set(centerX, centerY - 20);
    this.playAgainButton.position.set(centerX, centerY + 60);
    this.menuButton.position.set(centerX, centerY + 120);
  }

  public update(): void {
    // No updates needed
  }

  public resize(): void {
    this.positionElements();
  }
}
