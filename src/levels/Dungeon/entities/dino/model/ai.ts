export class DinoAI {
  private intervalId: NodeJS.Timeout | null = null;
  private onKeyUp: (event: { key: string }) => void;
  private onKeyDown: (event: { key: string }) => void;

  constructor(
    onKeyUp: (event: { key: string }) => void,
    onKeyDown: (event: { key: string }) => void,
  ) {
    this.onKeyDown = onKeyDown;
    this.onKeyUp = onKeyUp;
    this.start();
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(() => {
        const randomKey = this.getRandomKey();
        this.emitKeyUp(randomKey);
        setTimeout(() => {
          this.emitKeyDown(randomKey);
        }, 300);
      }, 1000);
    }
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private getRandomKey(): string {
    const keys = ['w', 'a', 's', 'd'];
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }

  private emitKeyUp(key: string) {
    this.onKeyUp({ key });
  }

  private emitKeyDown(key: string) {
    this.onKeyDown({ key });
  }

  public destroy() {
    this.stop();
  }
}
