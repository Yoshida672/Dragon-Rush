/* ==========================================================================
   DRAGON RUSH: LEVEL DESIGN (MECÂNICAS AVANÇADAS & PLATAFORMAS MÓVEIS)
   ========================================================================== */

class LevelManager {
    constructor() {
        this.currentLevelIndex = 1;
        this.platforms = [];
        this.spikes = [];
        this.gems = [];
        this.torches = [];
        this.lavaWaterfalls = [];
        this.movingPlatforms = [];
        this.windZones = [];
        this.exitDoor = { x: 0, y: 0, width: 55, height: 85 };
        this.doorUnlocked = false;
        this.levelWidth = 4600;
        this.levelHeight = 800;
        this.levelName = '';
    }

    loadLevel(levelNumber) {
        this.currentLevelIndex = levelNumber;
        this.platforms = [];
        this.spikes = [];
        this.gems = [];
        this.torches = [];
        this.lavaWaterfalls = [];
        this.movingPlatforms = [];
        this.windZones = [];
        this.doorUnlocked = false;

        switch (levelNumber) {
            case 1: this.buildLevel1(); break;
            case 2: this.buildLevel2(); break;
            case 3: this.buildLevel3(); break;
            case 4: this.buildLevel4(); break;
            case 5: this.buildLevel5(); break;
            default: this.buildLevel1(); break;
        }
    }

    // ==================== NÍVEL 1: CAVERNA SOMBRIA ====================
    buildLevel1() {
        this.levelName = 'Caverna Sombria';

        // Plataforma Inicial Ampla
        this.addPlatform(0, 520, 950, 250, 'stone');
        this.addTorch(300, 430);
        this.addTorch(700, 430);

        this.addPlatform(1060, 450, 180, 30, 'stone');
        this.addPlatform(1340, 370, 170, 30, 'stone');
        this.addTorch(1400, 290);

        this.addPlatform(1600, 480, 220, 30, 'stone');

        // Torre de Wall Jump
        this.addPlatform(1950, 120, 45, 480, 'brick');
        this.addPlatform(2140, 120, 45, 480, 'brick');
        this.addPlatform(1950, 580, 235, 120, 'lava');

        this.addTorch(1995, 230);
        this.addTorch(2095, 330);

        this.addPlatform(2140, 210, 260, 30, 'stone');

        this.addPlatform(2500, 320, 380, 30, 'stone');
        this.addSpike(2650, 300, 75);
        this.addTorch(2550, 240);

        this.addPlatform(3000, 360, 220, 30, 'stone');
        this.addPlatform(3350, 430, 190, 30, 'stone');

        this.addPlatform(3650, 500, 800, 250, 'stone');
        this.addTorch(3850, 420);
        this.addTorch(4150, 420);

        this.addSpike(3880, 480, 90);

        this.exitDoor = { x: 4300, y: 415, width: 55, height: 85 };
        this.addPlatform(4355, 0, 400, 800, 'brick');
        this.levelWidth = 4355;
    }

    // ==================== NÍVEL 2: PONTE DE LAVA ====================
    buildLevel2() {
        this.levelName = 'Ponte de Lava';

        this.addPlatform(0, 520, 950, 250, 'stone');
        this.addTorch(300, 430);
        this.addTorch(700, 430);

        this.addPlatform(500, 360, 140, 30, 'crumbling');
        this.addPlatform(350, 240, 160, 30, 'stone');
        this.addTorch(400, 160);

        // Cachoeira 1
        this.addLavaWaterfall(1050, 0, 45, 800, 80, 140, 0);
        this.addPlatform(950, 600, 2500, 200, 'lava');

        this.addPlatform(1120, 450, 150, 30, 'crumbling');
        this.addPlatform(1350, 380, 140, 30, 'stone');
        this.addTorch(1400, 300);

        // Cachoeira 2
        this.addLavaWaterfall(1650, 0, 50, 800, 80, 140, 70);
        this.addPlatform(1580, 480, 140, 30, 'crumbling');
        this.addPlatform(1850, 420, 180, 30, 'stone');
        this.addTorch(1900, 340);

        // Torre de Wall Jump
        this.addPlatform(2150, 100, 40, 500, 'brick');
        this.addPlatform(2330, 100, 40, 500, 'brick');
        this.addTorch(2195, 200);
        this.addTorch(2285, 360);

        // Cachoeira 3
        this.addLavaWaterfall(2600, 0, 55, 800, 80, 140, 120);

        this.addPlatform(2330, 200, 240, 30, 'stone');
        this.addPlatform(2700, 320, 150, 30, 'crumbling');
        this.addPlatform(2950, 320, 250, 30, 'stone');
        this.addTorch(3050, 240);

        this.addPlatform(3300, 400, 200, 30, 'stone');

        this.addPlatform(3600, 500, 900, 250, 'stone');
        this.addTorch(3800, 420);
        this.addTorch(4200, 420);

        this.addSpike(3850, 480, 120);

        this.exitDoor = { x: 4350, y: 415, width: 55, height: 85 };
        this.addPlatform(4405, 0, 400, 800, 'brick');
        this.levelWidth = 4405;
    }

    // ==================== NÍVEL 3: RUÍNAS DA PRISÃO + PLATAFORMAS MÓVEIS ====================
    buildLevel3() {
        this.levelName = 'Ruínas da Prisão';

        this.addPlatform(0, 520, 900, 250, 'stone');
        this.addTorch(300, 430);

        this.addPlatform(480, 360, 130, 30, 'crumbling');
        this.addPlatform(320, 240, 160, 30, 'stone');
        this.addTorch(360, 160);

        this.addLavaWaterfall(1050, 0, 50, 800, 80, 140, 0);
        this.addPlatform(900, 600, 3000, 200, 'lava');

        this.addPlatform(1120, 440, 160, 30, 'crumbling');
        this.addTorch(1180, 360);

        // ★ PLATAFORMA MÓVEL VERTICAL (nova mecânica!)
        this.addMovingPlatform(1400, 280, 140, 25, 'vertical', 280, 440, 1.2);
        this.addTorch(1450, 200);

        // Torres duplas de wall jump
        this.addPlatform(1700, 100, 40, 500, 'brick');
        this.addPlatform(1880, 100, 40, 500, 'brick');
        this.addTorch(1745, 220);
        this.addTorch(1835, 380);

        this.addLavaWaterfall(2100, 0, 50, 800, 80, 140, 60);

        this.addPlatform(1880, 180, 280, 30, 'stone');

        // ★ PLATAFORMA MÓVEL HORIZONTAL
        this.addMovingPlatform(2250, 320, 160, 25, 'horizontal', 2250, 2500, 1.5);

        this.addPlatform(2600, 400, 160, 30, 'stone');
        this.addSpike(2650, 380, 60);
        this.addTorch(2630, 320);

        // ★ ZONA DE VENTO (empurra o jogador para cima)
        this.addWindZone(2850, 300, 120, 300, 0, -3.5);

        this.addPlatform(2850, 200, 120, 30, 'stone');
        this.addTorch(2890, 120);

        this.addPlatform(3100, 480, 800, 250, 'stone');
        this.addTorch(3300, 400);

        this.exitDoor = { x: 3750, y: 395, width: 55, height: 85 };
        this.addPlatform(3805, 0, 400, 800, 'brick');
        this.levelWidth = 3805;
    }

    // ==================== NÍVEL 4: A FORJA DO DRAGÃO + PORTAIS CRONOMETRADOS ====================
    buildLevel4() {
        this.levelName = 'A Forja do Dragão';

        this.addPlatform(0, 520, 900, 250, 'stone');
        this.addTorch(300, 430);

        this.addLavaWaterfall(1000, 0, 60, 800, 75, 135, 0);
        this.addLavaWaterfall(1300, 0, 60, 800, 75, 135, 60);
        this.addPlatform(900, 600, 3000, 200, 'lava');

        this.addPlatform(1100, 450, 150, 30, 'crumbling');
        this.addTorch(1150, 370);

        // ★ PLATAFORMA MÓVEL entre cachoeiras
        this.addMovingPlatform(1200, 350, 130, 25, 'horizontal', 1100, 1300, 2.0);

        this.addPlatform(1420, 380, 160, 30, 'stone');
        this.addTorch(1480, 300);

        // ★ SEQUÊNCIA DE PLATAFORMAS CRUMBLING COM TIMING
        this.addPlatform(1700, 300, 100, 30, 'crumbling');
        this.addPlatform(1870, 260, 100, 30, 'crumbling');
        this.addPlatform(1950, 340, 100, 30, 'crumbling');
        this.addTorch(1900, 180);

        this.addLavaWaterfall(2100, 0, 65, 800, 75, 135, 110);

        // ★ ZONA DE VENTO LATERAL (empurra para trás)
        this.addWindZone(2200, 200, 200, 400, -2.5, 0);

        this.addPlatform(2200, 400, 300, 30, 'stone');
        this.addSpike(2300, 380, 120);
        this.addTorch(2350, 320);

        // ★ PLATAFORMAS MÓVEIS VERTICAIS EM CADEIA
        this.addMovingPlatform(2600, 350, 120, 25, 'vertical', 250, 450, 1.3);
        this.addMovingPlatform(2800, 250, 120, 25, 'vertical', 200, 400, 1.6);
        this.addTorch(2700, 200);

        this.addPlatform(3000, 480, 800, 250, 'stone');
        this.addTorch(3200, 400);
        this.addTorch(3500, 400);

        this.exitDoor = { x: 3650, y: 395, width: 55, height: 85 };
        this.addPlatform(3705, 0, 400, 800, 'brick');
        this.levelWidth = 3705;
    }

    // ==================== NÍVEL 5: O COLOSSO ESCALDANTE ====================
    buildLevel5() {
        this.levelName = 'O Colosso Escaldante';

        this.addPlatform(0, 520, 900, 250, 'stone');
        this.addTorch(300, 430);

        this.addLavaWaterfall(1000, 0, 70, 800, 70, 130, 0);
        this.addLavaWaterfall(1400, 0, 70, 800, 70, 130, 50);
        this.addLavaWaterfall(1800, 0, 70, 800, 70, 130, 100);
        this.addPlatform(900, 600, 3500, 200, 'lava');

        // ★ SEQUÊNCIA DE PLATAFORMAS MÓVEIS E CRUMBLING
        this.addPlatform(1100, 450, 120, 30, 'crumbling');
        this.addMovingPlatform(1250, 380, 130, 25, 'horizontal', 1150, 1380, 2.2);
        this.addTorch(1250, 300);

        // ★ ZONA DE VENTO PARA CIMA (elevador)
        this.addWindZone(1500, 200, 80, 400, 0, -4);
        this.addPlatform(1480, 150, 120, 30, 'stone');
        this.addTorch(1520, 80);

        this.addPlatform(1700, 350, 120, 30, 'crumbling');

        // ★ PLATAFORMAS MÓVEIS VERTICAIS ENTRE CACHOEIRAS
        this.addMovingPlatform(1900, 300, 110, 25, 'vertical', 200, 450, 1.8);
        this.addTorch(1920, 140);

        // ★ ZONA DE VENTO LATERAL FORTE (empurra para trás)
        this.addWindZone(2100, 100, 250, 500, -3, 0);

        this.addPlatform(2200, 400, 200, 30, 'stone');
        this.addSpike(2250, 380, 140);
        this.addTorch(2300, 320);

        // ★ SEQUÊNCIA FINAL DE PARKOUR
        this.addMovingPlatform(2500, 350, 100, 25, 'horizontal', 2450, 2650, 2.5);
        this.addPlatform(2700, 300, 100, 30, 'crumbling');
        this.addMovingPlatform(2850, 250, 100, 25, 'vertical', 200, 380, 2.0);
        this.addTorch(2870, 140);

        // Zona de vento de suporte
        this.addWindZone(3000, 250, 100, 350, 0, -2.5);

        this.addPlatform(3100, 480, 900, 250, 'stone');
        this.addTorch(3300, 400);
        this.addTorch(3600, 400);

        this.exitDoor = { x: 3850, y: 395, width: 55, height: 85 };
        this.addPlatform(3905, 0, 400, 800, 'brick');
        this.levelWidth = 3905;
    }

    // ==================== ADDERS ====================
    addPlatform(x, y, width, height, type = 'stone') {
        this.platforms.push({
            x, y, width, height, type,
            crumbleTimer: 40,
            broken: false,
            isShaking: false
        });
    }

    addSpike(x, y, width) {
        this.spikes.push({ x, y, width, height: 20 });
    }

    addTorch(x, y) {
        this.torches.push({ x, y, width: 32, height: 48, collected: false });
    }

    addLavaWaterfall(x, y, width, height, activeDuration = 80, inactiveDuration = 140, initialOffset = 0) {
        this.lavaWaterfalls.push({
            x, y, width, height,
            activeDuration,
            inactiveDuration,
            timer: initialOffset,
            isActive: true
        });
    }

    addMovingPlatform(x, y, width, height, axis, rangeMin, rangeMax, speed) {
        this.movingPlatforms.push({
            x, y, width, height,
            axis,       // 'horizontal' ou 'vertical'
            rangeMin,
            rangeMax,
            speed,
            direction: 1,
            originalX: x,
            originalY: y
        });
    }

    addWindZone(x, y, width, height, windX, windY) {
        this.windZones.push({ x, y, width, height, windX, windY, animTimer: 0 });
    }

    // ==================== UPDATES ====================
    updatePlatforms(player) {
        for (let p of this.platforms) {
            if (p.type === 'crumbling' && !p.broken) {
                const onPlatform = (
                    player.x + player.width > p.x &&
                    player.x < p.x + p.width &&
                    Math.abs(player.y + player.height - p.y) < 6 &&
                    player.isGrounded
                );

                if (onPlatform || p.isShaking) {
                    p.isShaking = true;
                    p.crumbleTimer--;
                    if (p.crumbleTimer <= 0) {
                        p.broken = true;
                        if (typeof soundSystem !== 'undefined') soundSystem.playClick();
                    }
                }
            }
        }
    }

    updateMovingPlatforms(player) {
        for (let mp of this.movingPlatforms) {
            const oldX = mp.x;
            const oldY = mp.y;

            if (mp.axis === 'horizontal') {
                mp.x += mp.speed * mp.direction;
                if (mp.x <= mp.rangeMin || mp.x + mp.width >= mp.rangeMax) {
                    mp.direction *= -1;
                }
            } else {
                mp.y += mp.speed * mp.direction;
                if (mp.y <= mp.rangeMin || mp.y >= mp.rangeMax) {
                    mp.direction *= -1;
                }
            }

            // Se o jogador está em cima, mover junto
            const onPlatform = (
                player.x + player.width > mp.x &&
                player.x < mp.x + mp.width &&
                Math.abs(player.y + player.height - mp.y) < 8 &&
                player.vy >= 0
            );

            if (onPlatform) {
                player.x += (mp.x - oldX);
                player.y += (mp.y - oldY);
                player.isGrounded = true;
                player.jumpCount = 0;
                player.vy = 0;
            }
        }
    }

    updateWindZones(player) {
        for (let wz of this.windZones) {
            wz.animTimer += 0.05;

            // Checar se o jogador está dentro da zona
            if (player.x + player.width > wz.x &&
                player.x < wz.x + wz.width &&
                player.y + player.height > wz.y &&
                player.y < wz.y + wz.height) {

                player.vx += wz.windX * 0.15;
                player.vy += wz.windY * 0.15;
            }
        }
    }

    updateLavaWaterfalls() {
        for (let wf of this.lavaWaterfalls) {
            wf.timer++;
            const cyclePeriod = wf.activeDuration + wf.inactiveDuration;
            const currentPhase = wf.timer % cyclePeriod;
            wf.isActive = currentPhase < wf.activeDuration;
        }
    }

    getCollectedTorchCount() {
        return this.torches.filter(t => t.collected).length;
    }

    getTotalTorchCount() {
        return this.torches.length;
    }

    checkTorchCollisions(player) {
        let newlyCollected = false;
        for (let t of this.torches) {
            if (!t.collected &&
                player.x + player.width > t.x - 10 &&
                player.x < t.x + t.width + 10 &&
                player.y + player.height > t.y - 10 &&
                player.y < t.y + t.height + 10) {

                t.collected = true;
                newlyCollected = true;
                if (typeof soundSystem !== 'undefined') soundSystem.playClick();
            }
        }

        if (this.getCollectedTorchCount() === this.getTotalTorchCount()) {
            if (!this.doorUnlocked) {
                this.doorUnlocked = true;
                if (typeof soundSystem !== 'undefined') soundSystem.playClick();
            }
        }

        return newlyCollected;
    }

    // ==================== COLISÃO DE PLATAFORMAS MÓVEIS (para Player) ====================
    getCollidables() {
        // Retorna array com plataformas estáticas + móveis para checagem de colisão
        const collidables = this.platforms.filter(p => !p.broken);

        for (let mp of this.movingPlatforms) {
            collidables.push({
                x: mp.x,
                y: mp.y,
                width: mp.width,
                height: mp.height,
                type: 'moving',
                broken: false
            });
        }

        return collidables;
    }

    // ==================== DRAW ====================
    draw(ctx, cameraX, canvasWidth, canvasHeight) {
        ctx.save();

        // 1. BG por Nível
        let bgImg = null;
        if (typeof spriteManager !== 'undefined' && spriteManager.loaded) {
            switch (this.currentLevelIndex) {
                case 1: bgImg = spriteManager.images.bgLevel1; break;
                case 2: bgImg = spriteManager.images.bgLevel2; break;
                case 3: bgImg = spriteManager.images.bgLevel3; break;
                case 4: bgImg = spriteManager.images.bgLevel4; break;
                case 5: bgImg = spriteManager.images.bgLevel5; break;
                default: bgImg = spriteManager.images.bgLevel1; break;
            }
        }

        if (bgImg) {
            const bgX = -((cameraX * 0.3) % 1024);
            ctx.drawImage(bgImg, bgX, 0, 1024, canvasHeight);
            ctx.drawImage(bgImg, bgX + 1024, 0, 1024, canvasHeight);
            ctx.drawImage(bgImg, bgX + 2048, 0, 1024, canvasHeight);
        }

        // 2. Zonas de Vento (visual)
        for (let wz of this.windZones) {
            const screenX = wz.x - cameraX;
            if (screenX + wz.width < -50 || screenX > canvasWidth + 50) continue;

            ctx.globalAlpha = 0.15;
            ctx.fillStyle = wz.windY < 0 ? '#00ccff' : '#ff6600';
            ctx.fillRect(screenX, wz.y, wz.width, wz.height);

            // Partículas de vento animadas
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = wz.windY < 0 ? '#88ddff' : '#ffaa44';
            for (let i = 0; i < 6; i++) {
                const particleY = (wz.y + wz.height) - ((wz.animTimer * 60 + i * (wz.height / 6)) % wz.height);
                const particleX = screenX + wz.width * 0.2 + Math.sin(wz.animTimer * 2 + i) * (wz.width * 0.3);
                ctx.beginPath();
                ctx.moveTo(particleX, particleY);
                ctx.lineTo(particleX - 3, particleY + 12);
                ctx.lineTo(particleX + 3, particleY + 12);
                ctx.closePath();
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // 3. Cachoeiras de Lava Pulsantes
        for (let wf of this.lavaWaterfalls) {
            const screenX = wf.x - cameraX;
            if (screenX + wf.width < -50 || screenX > canvasWidth + 50) continue;

            if (wf.isActive) {
                if (typeof spriteManager !== 'undefined' && spriteManager.images.lavaWaterfall && spriteManager.loaded) {
                    ctx.drawImage(spriteManager.images.lavaWaterfall, screenX, wf.y, wf.width, wf.height);
                } else {
                    ctx.fillStyle = '#ff3300';
                    ctx.fillRect(screenX, wf.y, wf.width, wf.height);
                }
            } else {
                ctx.fillStyle = 'rgba(255, 69, 0, 0.15)';
                ctx.fillRect(screenX, wf.y, wf.width, wf.height);

                ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
                for (let i = 0; i < 5; i++) {
                    const dropY = (wf.timer * 6 + i * 40) % wf.height;
                    ctx.fillRect(screenX + wf.width / 2 - 2, dropY, 4, 10);
                }
            }
        }

        // 4. Plataformas estáticas
        for (let p of this.platforms) {
            if (p.broken) continue;

            let screenX = p.x - cameraX;
            if (screenX + p.width < -100 || screenX > canvasWidth + 100) continue;

            if (p.isShaking) {
                screenX += (Math.random() - 0.5) * 4;
            }

            if (p.type === 'lava') {
                ctx.fillStyle = '#e63900';
                ctx.fillRect(screenX, p.y, p.width, p.height);
                ctx.fillStyle = '#ffcc00';
                ctx.fillRect(screenX, p.y, p.width, 6);
            } else if (p.type === 'crumbling') {
                ctx.fillStyle = '#3a271d';
                ctx.fillRect(screenX, p.y, p.width, p.height);
                ctx.fillStyle = '#ff4500';
                ctx.fillRect(screenX, p.y, p.width, 3);

                if (p.isShaking) {
                    ctx.strokeStyle = '#ffcc00';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX + p.width * 0.3, p.y);
                    ctx.lineTo(screenX + p.width * 0.5, p.y + p.height);
                    ctx.moveTo(screenX + p.width * 0.7, p.y);
                    ctx.lineTo(screenX + p.width * 0.6, p.y + p.height);
                    ctx.stroke();
                }
            } else if (p.type === 'brick') {
                ctx.fillStyle = '#181220';
                ctx.fillRect(screenX, p.y, p.width, p.height);
                ctx.strokeStyle = '#322345';
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX, p.y, p.width, p.height);
            } else {
                if (typeof spriteManager !== 'undefined' && spriteManager.images.stoneTile && spriteManager.loaded) {
                    const pattern = ctx.createPattern(spriteManager.images.stoneTile, 'repeat');
                    ctx.fillStyle = pattern;
                    ctx.save();
                    ctx.translate(screenX, p.y);
                    ctx.fillRect(0, 0, p.width, p.height);
                    ctx.restore();
                } else {
                    ctx.fillStyle = '#1e1828';
                    ctx.fillRect(screenX, p.y, p.width, p.height);
                }
                ctx.fillStyle = '#ff6b08';
                ctx.fillRect(screenX, p.y, p.width, 4);
            }
        }

        // 5. Plataformas Móveis
        for (let mp of this.movingPlatforms) {
            const screenX = mp.x - cameraX;
            if (screenX + mp.width < -100 || screenX > canvasWidth + 100) continue;

            // Trilho (rastro visual do movimento)
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#ffaa00';
            if (mp.axis === 'horizontal') {
                ctx.fillRect(mp.rangeMin - cameraX, mp.y + mp.height / 2 - 1, mp.rangeMax - mp.rangeMin, 2);
            } else {
                ctx.fillRect(screenX + mp.width / 2 - 1, mp.rangeMin, 2, mp.rangeMax - mp.rangeMin);
            }
            ctx.globalAlpha = 1;

            // Plataforma
            ctx.fillStyle = '#2a1e3a';
            ctx.fillRect(screenX, mp.y, mp.width, mp.height);

            // Borda dourada
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(screenX, mp.y, mp.width, 3);
            ctx.fillRect(screenX, mp.y + mp.height - 2, mp.width, 2);

            // Detalhes
            ctx.fillStyle = 'rgba(255, 170, 0, 0.3)';
            ctx.fillRect(screenX + 8, mp.y + 8, mp.width - 16, mp.height - 16);
        }

        // 6. Tochas
        for (let t of this.torches) {
            const screenX = t.x - cameraX;
            if (screenX < -50 || screenX > canvasWidth + 50) continue;

            const torchImg = t.collected ?
                (typeof spriteManager !== 'undefined' ? spriteManager.images.torchLit : null) :
                (typeof spriteManager !== 'undefined' ? spriteManager.images.torchUnlit : null);

            if (torchImg && spriteManager.loaded) {
                ctx.drawImage(torchImg, screenX, t.y, t.width, t.height);
            } else {
                ctx.fillStyle = t.collected ? '#ff5500' : '#444444';
                ctx.fillRect(screenX + 12, t.y + 10, 8, 30);
            }

            // Brilho da tocha coletada
            if (t.collected) {
                ctx.beginPath();
                ctx.arc(screenX + t.width / 2, t.y, 20, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 170, 0, 0.15)';
                ctx.fill();
            }
        }

        // 7. Espinhos
        ctx.fillStyle = '#c5bcaf';
        for (let s of this.spikes) {
            const screenX = s.x - cameraX;
            if (screenX + s.width < -50 || screenX > canvasWidth + 50) continue;

            const spikeCount = Math.floor(s.width / 15);
            for (let i = 0; i < spikeCount; i++) {
                ctx.beginPath();
                ctx.moveTo(screenX + i * 15, s.y + s.height);
                ctx.lineTo(screenX + i * 15 + 7.5, s.y);
                ctx.lineTo(screenX + (i + 1) * 15, s.y + s.height);
                ctx.closePath();
                ctx.fill();
            }
        }

        // 8. Porta de Saída
        const doorScreenX = this.exitDoor.x - cameraX;
        const doorImg = this.doorUnlocked ?
            (typeof spriteManager !== 'undefined' ? spriteManager.images.doorOpen : null) :
            (typeof spriteManager !== 'undefined' ? spriteManager.images.doorLocked : null);

        if (doorImg && spriteManager.loaded) {
            ctx.drawImage(doorImg, doorScreenX, this.exitDoor.y, this.exitDoor.width, this.exitDoor.height);
        } else {
            ctx.fillStyle = this.doorUnlocked ? '#00ff88' : '#d32f2f';
            ctx.fillRect(doorScreenX, this.exitDoor.y, this.exitDoor.width, this.exitDoor.height);
        }

        // Indicador pulsante quando porta desbloqueada
        if (this.doorUnlocked) {
            ctx.beginPath();
            ctx.arc(doorScreenX + this.exitDoor.width / 2, this.exitDoor.y - 15, 8 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
            ctx.fill();
        }

        ctx.restore();
    }
}
