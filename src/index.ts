import { Manager } from './Manager';
import { LoaderScene } from './scenes/LoaderScene';

Manager.initialize(0x6495ed);
Manager.changeScene(new LoaderScene());