import { FancyButton } from '@pixi/ui';
import { Container, FillGradient, Graphics, Text } from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';

import { generateWorld } from '../levels/CellularMapGenerator';
import { generateMap as generateNoiseWorld } from '../levels/NoiseJSMapGenerator';
import { IScene, Manager } from '../Manager';
import { GameScene } from './GameScene';

// Desert/Ancient Dungeon Theme Colors
const THEME = {
  bgLight: 0xe8d4b8, // Light sand (gradient top)
  bgDark: 0xb89b71, // Dark sand (gradient bottom)
  buttonBg: 0xc9b896, // Button background
  buttonBgHover: 0xd4c4a1, // Button hover background
  buttonBgPressed: 0xb8a885, // Button pressed background
  buttonBorder: 0x5d4e37, // Button border
  textDark: 0x3d2e1f, // Dark text for buttons
  textTitle: 0xfff8e7, // Light cream for title (shows outline better)
  titleOutline: 0x3d2e1f, // Dark brown outline
  accent: 0xd4a574, // Accent/hover glow
};

// Custom font loaded in assets.ts
const CUSTOM_FONT = 'Grandstander ExtraBold';

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 50;
const BUTTON_RADIUS = 8;

export interface MenuSceneCallbacks {
  onDungeon: () => void;
}

export class MenuScene extends Container implements IScene {
  private background: Graphics;
  private titleText: Text;
  private buttons: FancyButton[] = [];
  private callbacks: MenuSceneCallbacks;

  constructor(callbacks: MenuSceneCallbacks) {
    super();
    this.callbacks = callbacks;

    // Create background
    this.background = this.createBackground();
    this.addChild(this.background);

    // Create title with cartoon filter
    this.titleText = this.createTitle();
    this.addChild(this.titleText);

    // Create menu buttons
    this.createMenuButtons();

    // Initial positioning
    this.positionElements();
  }

  private createBackground(): Graphics {
    const bg = new Graphics();
    this.drawBackground(bg);
    return bg;
  }

  private drawBackground(bg: Graphics): void {
    bg.clear();

    // Create vertical gradient fill
    const gradientFill = new FillGradient(0, 0, 0, Manager.height);
    gradientFill.addColorStop(0, THEME.bgLight);
    gradientFill.addColorStop(1, THEME.bgDark);

    bg.rect(0, 0, Manager.width, Manager.height);
    bg.fill(gradientFill);

    // Add subtle texture overlay (noise pattern)
    this.addTextureOverlay(bg);

    // Add vignette effect
    this.addVignette(bg);
  }

  private addTextureOverlay(bg: Graphics): void {
    // Create subtle dot pattern for texture
    const dotSpacing = 20;
    const dotAlpha = 0.03;

    for (let x = 0; x < Manager.width; x += dotSpacing) {
      for (let y = 0; y < Manager.height; y += dotSpacing) {
        // Add some randomness to dot positions
        const offsetX = ((x * 7 + y * 13) % 10) - 5;
        const offsetY = ((x * 11 + y * 17) % 10) - 5;
        bg.circle(x + offsetX, y + offsetY, 1);
        bg.fill({ color: 0x000000, alpha: dotAlpha });
      }
    }
  }

  private addVignette(bg: Graphics): void {
    // Draw semi-transparent overlay for subtle darkening at edges
    const vignetteAlpha = 0.15;
    bg.rect(0, 0, Manager.width, Manager.height);
    bg.fill({ color: 0x2a1f14, alpha: vignetteAlpha * 0.3 });
  }

  private createTitle(): Text {
    // Create outline filter for cartoon effect
    const outlineFilter = new OutlineFilter({
      thickness: 5,
      color: THEME.titleOutline,
    });

    const title = new Text({
      text: 'Ancient Dungeon',
      style: {
        fontSize: 64,
        fill: THEME.textTitle,
        fontFamily: CUSTOM_FONT,
        fontWeight: '800',
      },
    });

    title.filters = [outlineFilter];
    title.anchor.set(0.5);
    return title;
  }

  private createMenuButtons(): void {
    const buttonConfigs = [
      {
        label: 'Woods',
        onClick: () => {
          const { world, playerStartingY, playerStartingX } = generateWorld(128, 128);
          Manager.changeScene(new GameScene(world, playerStartingX, playerStartingY));
        },
      },
      {
        label: 'Terrain',
        onClick: () => {
          const { world, playerStartingY, playerStartingX } = generateNoiseWorld({
            width: 128,
            height: 128,
            waterThreshold: -0.3,
            mountainThreshold: 0.3,
          });
          Manager.changeScene(new GameScene(world, playerStartingX, playerStartingY));
        },
      },
      {
        label: 'Dungeon',
        onClick: this.callbacks.onDungeon,
      },
      {
        label: 'High Score',
        onClick: () => {
          // Placeholder for high score functionality
        },
      },
      {
        label: 'Exit Game',
        onClick: () => {
          // Placeholder for exit functionality
        },
      },
    ];

    buttonConfigs.forEach((config) => {
      const button = this.createThemedButton(config.label, config.onClick);
      this.buttons.push(button);
      this.addChild(button);
    });
  }

  private createThemedButton(label: string, onClick: () => void): FancyButton {
    // Create button background graphics
    const defaultBg = this.createButtonGraphics(THEME.buttonBg);
    const hoverBg = this.createButtonGraphics(THEME.buttonBgHover);
    const pressedBg = this.createButtonGraphics(THEME.buttonBgPressed);

    // Create outline filter for button text
    const textOutlineFilter = new OutlineFilter({
      thickness: 2,
      color: THEME.buttonBorder,
    });

    const buttonText = new Text({
      text: label,
      style: {
        fontSize: 24,
        fill: THEME.textTitle,
        fontFamily: CUSTOM_FONT,
        fontWeight: '800',
      },
    });
    buttonText.filters = [textOutlineFilter];
    buttonText.anchor.set(0.5);

    const button = new FancyButton({
      defaultView: defaultBg,
      hoverView: hoverBg,
      pressedView: pressedBg,
      text: buttonText,
      anchor: 0.5,
      animations: {
        hover: {
          props: {
            scale: { x: 1.05, y: 1.05 },
          },
          duration: 150,
        },
        pressed: {
          props: {
            scale: { x: 0.95, y: 0.95 },
          },
          duration: 100,
        },
      },
    });

    button.onPress.connect(onClick);
    return button;
  }

  private createButtonGraphics(bgColor: number): Graphics {
    const g = new Graphics();

    // Draw from origin - FancyButton with anchor 0.5 will center it
    g.roundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS);
    g.fill({ color: bgColor });

    // Button border
    g.roundRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS);
    g.stroke({ color: THEME.buttonBorder, width: 2 });

    return g;
  }

  private positionElements(): void {
    const centerX = Manager.width / 2;
    const titleY = Manager.height * 0.15;

    // Position title
    this.titleText.position.set(centerX, titleY);

    // Position buttons
    const buttonSpacing = 15;
    const totalButtonsHeight =
      this.buttons.length * BUTTON_HEIGHT + (this.buttons.length - 1) * buttonSpacing;
    let currentY = (Manager.height - totalButtonsHeight) / 2 + BUTTON_HEIGHT / 2 + 30;

    this.buttons.forEach((button) => {
      button.position.set(centerX, currentY);
      currentY += BUTTON_HEIGHT + buttonSpacing;
    });
  }

  public update(): void {
    // No frame updates needed for menu
  }

  public resize(): void {
    // Redraw background for new dimensions
    this.drawBackground(this.background);

    // Reposition elements
    this.positionElements();
  }
}
