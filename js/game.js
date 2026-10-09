/* ==========================================================================
   DRAGON RUSH: GAME ENGINE (MECÂNICAS COMPLETAS & SISTEMA DE RANKING)
   ========================================================================== */

class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.state = 'MENU'; // 'MENU', 'COUNTDOWN', 'PLAYING', 'PAUSED', 'GAMEOVER', 'VICTORY'

        // Módulos
        this.player = new Player(100, 400);
        this.dragon = new Dragon();
        this.level = new LevelManager();
        this.particles = new ParticleSystem();

        // Câmera & Shake
        this.cameraX = 0;
        this.screenShake = 0;

        // Contagem Regressiva & Cronômetro
        this.countdownValue = 3;
        this.countdownInterval = null;
        this.startTime = 0;
        this.elapsedTime = 0;

        // Resultado da última vitória
        this.lastResult = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles.init(this.canvas.width, this.canvas.height);
    }

    startLevel(levelNum = 1) {
        this.level.loadLevel(levelNum);
        this.player.reset(100, 400);
        this.dragon.reset();
        this.dragon.setLevel(levelNum);
        this.cameraX = 0;
        this.screenShake = 0;
        this.elapsedTime = 0;
        this.lastResult = null;

        // Iniciar Estado de Contagem Regressiva
        this.state = 'COUNTDOWN';
        this.startCountdown();
    }

    startCountdown() {
        if (this.countdownInterval) clearInterval(this.countdownInterval);

        this.countdownValue = 3;
        const countdownOverlay = document.getElementById('countdown-overlay');
        const countdownText = document.getElementById('countdown-text');

        if (countdownOverlay) countdownOverlay.classList.remove('hidden');
        if (countdownText) countdownText.innerText = '3';
        if (typeof soundSystem !== 'undefined') soundSystem.playClick();

        this.countdownInterval = setInterval(() => {
            this.countdownValue--;
            if (this.countdownValue > 0) {
                if (countdownText) countdownText.innerText = this.countdownValue;
                if (typeof soundSystem !== 'undefined') soundSystem.playClick();
            } else if (this.countdownValue === 0) {
                if (countdownText) countdownText.innerText = 'CORRA! 🔥';
                if (typeof soundSystem !== 'undefined') soundSystem.playDragonRoar();
            } else {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
                if (countdownOverlay) countdownOverlay.classList.add('hidden');

                // Iniciar Partida
                this.state = 'PLAYING';
                this.startTime = Date.now();
                if (typeof soundSystem !== 'undefined') soundSystem.startOST();
            }
        }, 900);
    }

    triggerShake(intensity = 10) {
        this.screenShake = intensity;
    }

    update() {
        this.particles.update(this.canvas.width, this.canvas.height);
        this.level.updateLavaWaterfalls();

        if (this.state !== 'PLAYING') return;

        // Screen Shake
        if (this.screenShake > 0) {
            this.screenShake *= 0.9;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }

        const distToDragon = this.player.x - this.dragon.x - 180;
        if (distToDragon < 220) {
            this.screenShake = Math.max(this.screenShake, (220 - distToDragon) * 0.03);
        }

        this.elapsedTime = (Date.now() - this.startTime) / 1000;

        // Atualizar Entidades
        const collidables = this.level.getCollidables();
        this.player.update(collidables);
        this.dragon.update(this.player.x);
        this.level.updatePlatforms(this.player);
        this.level.updateMovingPlatforms(this.player);
        this.level.updateWindZones(this.player);

        // Checar Coleta de Tochas
        this.level.checkTorchCollisions(this.player);

        // Câmera
        const targetCameraX = this.player.x - this.canvas.width * 0.35;
        this.cameraX += (targetCameraX - this.cameraX) * 0.14;
        this.cameraX = Math.max(0, this.cameraX);

        // === COLISÕES ===

        // Espinhos
        for (let s of this.level.spikes) {
            if (this.player.x + this.player.width > s.x &&
                this.player.x < s.x + s.width &&
                this.player.y + this.player.height > s.y &&
                this.player.y < s.y + s.height) {
                this.triggerGameOver('spikes');
            }
        }

        // Poços de Lava
        for (let p of this.level.platforms) {
            if (p.type === 'lava' && !p.broken &&
                this.player.x + this.player.width > p.x + 4 &&
                this.player.x < p.x + p.width - 4 &&
                this.player.y + this.player.height > p.y &&
                this.player.y < p.y + p.height) {
                this.triggerGameOver('lava');
            }
        }

        // Cachoeiras de Lava (DASH = imunidade)
        for (let wf of this.level.lavaWaterfalls) {
            if (wf.isActive && !this.player.isDashing &&
                this.player.x + this.player.width > wf.x + 8 &&
                this.player.x < wf.x + wf.width - 8 &&
                this.player.y + this.player.height > wf.y &&
                this.player.y < wf.y + wf.height) {
                this.triggerGameOver('lava');
            }
        }

        // Projéteis de Fogo do Dragão (nível 4+)
        for (let fp of this.dragon.fireProjectiles) {
            if (!this.player.isDashing &&
                this.player.x + this.player.width > fp.x - fp.size &&
                this.player.x < fp.x + fp.size &&
                this.player.y + this.player.height > fp.y - fp.size &&
                this.player.y < fp.y + fp.size) {
                this.triggerGameOver('fireball');
            }
        }

        // Queda
        if (this.player.y > this.canvas.height + 200) {
            this.triggerGameOver('fall');
        }

        // Devorado pelo Dragão
        if (this.player.x <= this.dragon.x + 180) {
            this.triggerGameOver('dragon');
        }

        // Porta de Saída
        const door = this.level.exitDoor;
        if (this.player.x + this.player.width > door.x &&
            this.player.x < door.x + door.width &&
            this.player.y + this.player.height > door.y &&
            this.player.y < door.y + door.height) {

            if (this.level.doorUnlocked) {
                this.triggerVictory();
            } else {
                const warningMsg = document.getElementById('door-warning-msg');
                if (warningMsg) warningMsg.classList.remove('hidden');
            }
        } else {
            const warningMsg = document.getElementById('door-warning-msg');
            if (warningMsg) warningMsg.classList.add('hidden');
        }

        this.updateHUD();
    }

    updateHUD() {
        const distToDragon = Math.max(0, Math.floor((this.player.x - this.dragon.x - 180) / 10));
        const distanceText = document.getElementById('dragon-distance-text');
        const meterFill = document.getElementById('dragon-meter-fill');
        const torchText = document.getElementById('torch-counter-text');
        const progressText = document.getElementById('level-progress-text');
        const hudTimer = document.getElementById('hud-timer');
        const levelNameEl = document.getElementById('hud-level-name');

        if (distanceText) distanceText.innerText = `${distToDragon}m`;
        if (meterFill) {
            const pct = Math.min(100, Math.max(0, (distToDragon / 50) * 100));
            meterFill.style.width = `${pct}%`;

            // Mudar cor baseado na distância
            if (distToDragon < 15) {
                meterFill.style.background = 'linear-gradient(90deg, #ff0000, #ff2200)';
            } else if (distToDragon < 30) {
                meterFill.style.background = 'linear-gradient(90deg, #ff3300, #ff6600)';
            } else {
                meterFill.style.background = 'linear-gradient(90deg, #ff0000, #ff7700)';
            }
        }

        if (torchText) {
            const collected = this.level.getCollectedTorchCount();
            const total = this.level.getTotalTorchCount();
            torchText.innerText = `${collected} / ${total} 🔥`;
            torchText.style.color = (collected === total) ? '#00ff88' : '#ffaa00';
        }

        if (progressText) {
            const progress = Math.min(100, Math.floor((this.player.x / this.level.levelWidth) * 100));
            progressText.innerText = `${progress}%`;
        }

        if (hudTimer) {
            const mins = Math.floor(this.elapsedTime / 60).toString().padStart(2, '0');
            const secs = (this.elapsedTime % 60).toFixed(1).padStart(4, '0');
            hudTimer.innerText = `${mins}:${secs}`;
        }

        if (levelNameEl) {
            levelNameEl.innerText = `Nível ${this.level.currentLevelIndex}: ${this.level.levelName}`;
        }
    }

    triggerGameOver(reason) {
        if (this.state !== 'PLAYING') return;

        this.state = 'GAMEOVER';
        this.triggerShake(20);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        if (typeof soundSystem !== 'undefined') {
            soundSystem.stopOST();
            soundSystem.playDragonRoar();
        }

        // Registrar morte
        if (typeof saveSystem !== 'undefined') saveSystem.recordDeath();

        // Mensagem de morte específica
        const deathMessages = {
            dragon: '🐉 O dragão devorou você!',
            lava: '🌋 Você foi consumido pela lava!',
            spikes: '⚔️ Os espinhos perfuraram sua armadura!',
            fall: '🕳️ Você caiu no abismo!',
            fireball: '🔥 Uma bola de fogo atingiu você!'
        };

        const goScreen = document.getElementById('gameover-screen');
        const hud = document.getElementById('hud');
        const goTime = document.getElementById('go-time');
        const goDist = document.getElementById('go-distance');
        const goMsg = document.getElementById('go-death-msg');

        if (hud) hud.classList.add('hidden');
        if (goScreen) goScreen.classList.remove('hidden');

        if (goMsg) {
            goMsg.innerText = deathMessages[reason] || '💀 Você foi derrotado!';
        }

        if (goTime) {
            const mins = Math.floor(this.elapsedTime / 60).toString().padStart(2, '0');
            const secs = Math.floor(this.elapsedTime % 60).toString().padStart(2, '0');
            goTime.innerText = `${mins}:${secs}`;
        }

        if (goDist) {
            goDist.innerText = `${Math.floor(this.player.x / 10)}m`;
        }
    }

    triggerVictory() {
        if (this.state !== 'PLAYING') return;

        this.state = 'VICTORY';
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        if (typeof soundSystem !== 'undefined') {
            soundSystem.stopOST();
            soundSystem.playVictory();
        }

        // Registrar no sistema de save
        let result = null;
        if (typeof saveSystem !== 'undefined') {
            result = saveSystem.recordCompletion(this.level.currentLevelIndex, this.elapsedTime);
        }
        this.lastResult = result;

        const vicScreen = document.getElementById('victory-screen');
        const hud = document.getElementById('hud');
        const vicTime = document.getElementById('vic-time');
        const vicRank = document.getElementById('vic-rank');
        const vicRankLabel = document.getElementById('vic-rank-label');
        const vicBest = document.getElementById('vic-best-time');
        const vicNewRecord = document.getElementById('vic-new-record');
        const btnNextLevel = document.getElementById('btn-next-level');

        if (hud) hud.classList.add('hidden');
        if (vicScreen) vicScreen.classList.remove('hidden');

        if (vicTime) {
            const mins = Math.floor(this.elapsedTime / 60).toString().padStart(2, '0');
            const secs = (this.elapsedTime % 60).toFixed(1).padStart(4, '0');
            vicTime.innerText = `${mins}:${secs}`;
        }

        if (result) {
            if (vicRank) {
                vicRank.innerText = result.rank;
                vicRank.className = 'rank-badge rank-' + result.rank.toLowerCase();
            }

            if (vicRankLabel) {
                const rankNames = { S: 'LENDÁRIO!', A: 'EXCELENTE!', B: 'BOM!', C: 'COMPLETO' };
                vicRankLabel.innerText = rankNames[result.rank] || '';
            }

            if (vicBest) {
                const bestMins = Math.floor(result.bestTime / 60).toString().padStart(2, '0');
                const bestSecs = (result.bestTime % 60).toFixed(1).padStart(4, '0');
                vicBest.innerText = `${bestMins}:${bestSecs}`;
            }

            if (vicNewRecord) {
                vicNewRecord.style.display = result.isNewRecord ? 'block' : 'none';
            }
        }

        // Esconder botão "Próximo Nível" se for o último
        if (btnNextLevel) {
            if (this.level.currentLevelIndex >= 5) {
                btnNextLevel.innerText = '🏆 JOGO COMPLETO!';
                btnNextLevel.disabled = true;
                btnNextLevel.style.opacity = '0.5';
            } else {
                btnNextLevel.innerText = 'PRÓXIMO NÍVEL →';
                btnNextLevel.disabled = false;
                btnNextLevel.style.opacity = '1';
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(shakeX, shakeY);
        }

        this.level.draw(this.ctx, this.cameraX, this.canvas.width, this.canvas.height);
        this.particles.draw(this.ctx);

        if (this.state === 'COUNTDOWN' || this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'GAMEOVER' || this.state === 'VICTORY') {
            this.player.draw(this.ctx, this.cameraX);
            this.dragon.draw(this.ctx, this.cameraX, this.canvas.height);
        }

        // Indicador de fúria do dragão
        if (this.dragon.isEnraged && this.state === 'PLAYING') {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.08)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.restore();
    }
}
