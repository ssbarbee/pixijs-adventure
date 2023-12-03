import type { AssetsManifest } from 'pixi.js';

import { GRASS0, GRASS1, GRASS2, WALL0, WALL1, WATER0 } from './constants';
// by starting with ./ we mean "relative to our index.html"
export const manifest: AssetsManifest = {
  bundles: [
    {
      name: 'bundleName',
      assets: {
        player: './player.png',
        [GRASS0]: './grass0.png',
        [GRASS1]: './grass1.png',
        [GRASS2]: './grass2.png',
        [WALL0]: './wall0.png',
        [WALL1]: './wall1.png',
        [WATER0]: './water0.png',
      },
    },
    {
      name: 'dungeon',
      assets: {
        dungeonBricks6: './dungeon/bricks_6.png',
        dungeonBricks9: './dungeon/bricks_9.png',
        dungeonBricks10: './dungeon/bricks_10.png',
        dungeonDecor12: './dungeon/decor_12.png',
        dungeonLand: './dungeon/land.png',
        dungeonWall7: './dungeon/wall_7.png',
        dungeonWall8: './dungeon/wall_8.png',
      },
    },
    {
      name: 'dino',
      assets: {
        dinoDead0: './dino/dead0.png',
        dinoDead1: './dino/dead1.png',
        dinoDead2: './dino/dead2.png',
        dinoDead3: './dino/dead3.png',
        dinoDead4: './dino/dead4.png',
        dinoDead5: './dino/dead5.png',
        dinoDead6: './dino/dead6.png',
        dinoDead7: './dino/dead7.png',
        dinoIdle0: './dino/idle0.png',
        dinoIdle1: './dino/idle1.png',
        dinoIdle2: './dino/idle2.png',
        dinoIdle3: './dino/idle3.png',
        dinoIdle4: './dino/idle4.png',
        dinoIdle5: './dino/idle5.png',
        dinoIdle6: './dino/idle6.png',
        dinoIdle7: './dino/idle7.png',
        dinoIdle8: './dino/idle8.png',
        dinoIdle9: './dino/idle9.png',
        dinoJump0: './dino/jump0.png',
        dinoJump1: './dino/jump1.png',
        dinoJump2: './dino/jump2.png',
        dinoJump3: './dino/jump3.png',
        dinoRun0: './dino/run0.png',
        dinoRun1: './dino/run1.png',
        dinoRun2: './dino/run2.png',
        dinoRun3: './dino/run3.png',
        dinoRun4: './dino/run4.png',
        dinoRun5: './dino/run5.png',
        dinoRun6: './dino/run6.png',
        dinoRun7: './dino/run7.png',
        dinoWalk0: './dino/walk0.png',
        dinoWalk1: './dino/walk1.png',
        dinoWalk2: './dino/walk2.png',
        dinoWalk3: './dino/walk3.png',
        dinoWalk4: './dino/walk4.png',
        dinoWalk5: './dino/walk5.png',
        dinoWalk6: './dino/walk6.png',
        dinoWalk7: './dino/walk7.png',
        dinoWalk8: './dino/walk8.png',
        dinoWalk9: './dino/walk9.png',
        dinoWalk10: './dino/walk10.png',
        dinoWalk11: './dino/walk11.png',
      },
    },
    // {
    //     name : "another bundle",
    //     assets:
    //         {
    //             "whistle" : "./whistle.mp3",
    //         }
    // },
  ],
};
