import { BACKGROUND_COLOR } from './constants';
import { Manager } from './Manager';
import { LoaderScene } from './scenes/LoaderScene';

Manager.initialize(BACKGROUND_COLOR);
Manager.changeScene(new LoaderScene());
