/* ==========================================================================
   DRAGON RUSH: ASSETS IMAGE LOADER (BGs ESPECÍFICOS & PIXEL ART MENU HERO)
   ========================================================================== */

class SpriteManager {
    constructor() {
        this.images = {};
        this.loaded = false;

        this.loadAssets();
    }

    loadAssets() {
        const assetPaths = {
            menuBgHero: 'assets/menu_bg_hero.svg',
            bgLevel1: 'assets/bg_level1.svg',
            bgLevel2: 'assets/bg_level2.svg',
            bgLevel3: 'assets/bg_level3.svg',
            bgLevel4: 'assets/bg_level4.svg',
            bgLevel5: 'assets/bg_level5.svg',
            cavernBg: 'assets/cavern_bg.svg',
            stoneTile: 'assets/stone_tile.svg',
            torchUnlit: 'assets/torch_unlit.svg',
            torchLit: 'assets/torch_lit.svg',
            doorLocked: 'assets/door_locked.svg',
            doorOpen: 'assets/door_open.svg',
            playerHero: 'assets/player_hero.svg',
            dragonHead: 'assets/dragon_head.svg',
            lavaWaterfall: 'assets/lava_waterfall.svg'
        };

        let loadedCount = 0;
        const totalAssets = Object.keys(assetPaths).length;

        for (let key in assetPaths) {
            const img = new Image();
            img.src = assetPaths[key];
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalAssets) {
                    this.loaded = true;
                }
            };
            this.images[key] = img;
        }
    }
}

const spriteManager = new SpriteManager();
