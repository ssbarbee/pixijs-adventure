import { Assets, Container, Graphics } from 'pixi.js';

import { manifest } from '../assets';
import { IScene, Manager } from '../Manager';
import { DungeonScene } from './DungeonScene';
import { MenuScene } from './MenuScene';

export class LoaderScene extends Container implements IScene {
  // for making our loader graphics...
  private loaderBar: Container;
  private loaderBarBoder: Graphics;
  private loaderBarFill: Graphics;
  constructor() {
    super();

    const loaderBarWidth = Manager.width * 0.8;

    this.loaderBarFill = new Graphics();
    this.loaderBarFill.rect(0, 0, loaderBarWidth, 50).fill({ color: 0x008800, alpha: 1 });
    this.loaderBarFill.scale.x = 0;

    this.loaderBarBoder = new Graphics();
    this.loaderBarBoder.rect(0, 0, loaderBarWidth, 50).stroke({ width: 10, color: 0x0, alpha: 1 });

    this.loaderBar = new Container();
    this.loaderBar.addChild(this.loaderBarFill);
    this.loaderBar.addChild(this.loaderBarBoder);
    this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2;
    this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2;
    this.addChild(this.loaderBar);

    void this.initializeLoader().then(() => {
      this.gameLoaded();
    });
  }

  public async initializeLoader(): Promise<void> {
    await Assets.init({ manifest: manifest });

    const bundleIds = manifest.bundles.map((bundle) => bundle.name);

    await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
  }

  private downloadProgress(progressRatio: number): void {
    this.loaderBarFill.scale.x = progressRatio;
  }

  private gameLoaded(): void {
    Manager.changeScene(
      new MenuScene({
        onDungeon: () => Manager.changeScene(new DungeonScene()),
      }),
    );
  }

  public update(): void {
    // To be a scene we must have the update method even if we don't use it.
  }

  public resize(): void {}
}
