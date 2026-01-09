import { Application, Container, Ticker } from 'pixi.js';

export class Manager {
  private constructor() {}
  private static app: Application;
  private static currentScene: IScene | null = null;

  public static get width(): number {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  public static get height(): number {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  public static async initialize(background: number): Promise<void> {
    Manager.app = new Application();
    await Manager.app.init({
      canvas: document.getElementById('pixi-canvas') as HTMLCanvasElement,
      resizeTo: window,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
    });

    // Add the ticker
    Manager.app.ticker.add((ticker: Ticker) => Manager.update(ticker.deltaTime));

    // listen for the browser telling us that the screen size changed
    window.addEventListener('resize', () => Manager.resize());
  }

  public static resize(): void {
    // if we have a scene, we let it know that a resize happened!
    if (Manager.currentScene) {
      Manager.currentScene.resize(Manager.width, Manager.height);
    }
  }

  // Call this function when you want to go to a new scene
  public static changeScene(newScene: IScene): void {
    // Remove and destroy old scene... if we had one..
    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene as Container);
      Manager.currentScene.destroy();
    }

    // Add the new one
    Manager.currentScene = newScene;
    Manager.app.stage.addChild(Manager.currentScene as Container);
  }

  // This update will be called by a pixi ticker and tell the scene that a tick happened
  private static update(framesPassed: number): void {
    // Let the current scene know that we updated it...
    if (Manager.currentScene) {
      // Alternative use `Manager.app.ticker.deltaMS` and not pass param
      Manager.currentScene.update(framesPassed);
    }
  }
}

export interface IScene extends Container {
  update(framesPassed: number): void;

  // we added the resize method to the interface
  resize(screenWidth: number, screenHeight: number): void;
}
