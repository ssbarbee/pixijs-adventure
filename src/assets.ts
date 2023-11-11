import type { AssetsManifest } from "pixi.js";
// by starting with ./ we mean "relative to our index.html"
export const manifest:AssetsManifest = {
    bundles: [
        {
            name : "bundleName",
            assets:
                {
                    "Clampy from assets.ts!": "./clampy.png"
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