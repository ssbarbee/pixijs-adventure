import type { AssetsManifest } from "pixi.js";
import { GRASS0, GRASS1, GRASS2, WALL0, WALL1, WATER0 } from './constants';
// by starting with ./ we mean "relative to our index.html"
export const manifest:AssetsManifest = {
    bundles: [
        {
            name : "bundleName",
            assets:
                {
                    "player": "./player.png",
                    [GRASS0]: "./grass0.png",
                    [GRASS1]: "./grass1.png",
                    [GRASS2]: "./grass2.png",
                    [WALL0]: "./wall0.png",
                    [WALL1]: "./wall1.png",
                    [WATER0]: "./water0.png",
                }
        },
        // {
        //     name : "another bundle",
        //     assets:
        //         {
        //             "whistle" : "./whistle.mp3",
        //         }
        // },
    ]
}