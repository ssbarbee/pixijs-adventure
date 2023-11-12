import type { AssetsManifest } from "pixi.js";
// by starting with ./ we mean "relative to our index.html"
export const manifest:AssetsManifest = {
    bundles: [
        {
            name : "bundleName",
            assets:
                {
                    "clampy": "./clampy.png",
                    "grass": "./grass.png",
                    "grass2": "./grass2.png",
                    // "another image" : "./monster.png",
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