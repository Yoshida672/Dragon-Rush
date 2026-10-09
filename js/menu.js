/* ==========================================================================
   DRAGON RUSH: INTERAÇÃO DE BOTÕES, MENUS E SAVE SYSTEM
   ========================================================================== */

class MenuController {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentScreen = 'main-menu';
        
        this.initButtons();
        this.initKeyListeners();
        this.initSettings();
        
        this.showScreen('main-menu');
        this.updateLevelCards();
    }

    initButtons() {
        // 1. Menu Principal
        const btnPlay = document.getElementById('btn-play');
        const btnLevels = document.getElementById('btn-levels');
        const btnControls = document.getElementById('btn-controls');
        const btnSettings = document.getElementById('btn-settings');
        const btnAudioToggle = document.getElementById('btn-audio-toggle');

        if (btnPlay) {
            btnPlay.addEventListener('click', () => {
                soundSystem.playClick();
                this.startGame(1);
            });
            btnPlay.addEventListener('mouseenter', () => soundSystem.playHover());
        }

        if (btnLevels) {
            btnLevels.addEventListener('click', () => {
                soundSystem.playClick();
                this.updateLevelCards();
                this.showScreen('screen-levels');
            });
            btnLevels.addEventListener('mouseenter', () => soundSystem.playHover());
        }

        if (btnControls) {
            btnControls.addEventListener('click', () => {
                soundSystem.playClick();
                this.showScreen('screen-controls');
            });
            btnControls.addEventListener('mouseenter', () => soundSystem.playHover());
        }

        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                soundSystem.playClick();
                this.showScreen('screen-settings');
            });
            btnSettings.addEventListener('mouseenter', () => soundSystem.playHover());
        }

        if (btnAudioToggle) {
            btnAudioToggle.addEventListener('click', () => {
                soundSystem.soundEnabled = !soundSystem.soundEnabled;
                btnAudioToggle.innerText = soundSystem.soundEnabled ? '🔊' : '🔇';
                soundSystem.playClick();
            });
        }

        // 2. Voltar
        const backButtons = document.querySelectorAll('.btn-back');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                soundSystem.playClick();
                const target = btn.getAttribute('data-back') || 'main-menu';
                this.showScreen(target);
            });
            btn.addEventListener('mouseenter', () => soundSystem.playHover());
        });

        // 3. Seleção de Níveis
        const levelCards = document.querySelectorAll('.level-card');
        levelCards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('active')) {
                    soundSystem.playClick();
                    const level = parseInt(card.getAttribute('data-level')) || 1;
                    this.startGame(level);
                }
            });
            card.addEventListener('mouseenter', () => {
                if (card.classList.contains('active')) soundSystem.playHover();
            });
        });

        // 4. Pause e Telas Finais
        const btnPause = document.getElementById('btn-pause');
        const btnResume = document.getElementById('btn-resume');
        const btnRestart = document.getElementById('btn-restart');
        const btnQuit = document.getElementById('btn-quit');
        const btnRetry = document.getElementById('btn-retry');
        const btnGoMenu = document.getElementById('btn-go-menu');
        const btnNextLevel = document.getElementById('btn-next-level');
        const btnVicMenu = document.getElementById('btn-vic-menu');
        const btnResetSave = document.getElementById('btn-reset-save');

        if (btnPause) {
            btnPause.addEventListener('click', () => this.togglePause());
        }

        if (btnResume) {
            btnResume.addEventListener('click', () => {
                soundSystem.playClick();
                this.togglePause();
            });
        }

        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                soundSystem.playClick();
                this.hideAllScreens();
                document.getElementById('hud').classList.remove('hidden');
                this.game.startLevel(this.game.level.currentLevelIndex);
            });
        }

        if (btnQuit) {
            btnQuit.addEventListener('click', () => {
                soundSystem.playClick();
                soundSystem.stopOST();
                if (this.game.countdownInterval) clearInterval(this.game.countdownInterval);
                this.showScreen('main-menu');
                this.game.state = 'MENU';
            });
        }

        if (btnRetry) {
            btnRetry.addEventListener('click', () => {
                soundSystem.playClick();
                this.hideAllScreens();
                document.getElementById('hud').classList.remove('hidden');
                this.game.startLevel(this.game.level.currentLevelIndex);
            });
        }

        if (btnGoMenu) {
            btnGoMenu.addEventListener('click', () => {
                soundSystem.playClick();
                soundSystem.stopOST();
                this.showScreen('main-menu');
                this.game.state = 'MENU';
            });
        }

        if (btnNextLevel) {
            btnNextLevel.addEventListener('click', () => {
                if (btnNextLevel.disabled) return;
                soundSystem.playClick();
                this.hideAllScreens();
                document.getElementById('hud').classList.remove('hidden');
                const nextLvl = Math.min(5, this.game.level.currentLevelIndex + 1);
                this.game.startLevel(nextLvl);
            });
        }

        if (btnVicMenu) {
            btnVicMenu.addEventListener('click', () => {
                soundSystem.playClick();
                soundSystem.stopOST();
                this.showScreen('main-menu');
                this.game.state = 'MENU';
            });
        }

        if (btnResetSave) {
            btnResetSave.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja RESETAR todo o progresso? Esta ação não pode ser desfeita!')) {
                    saveSystem.resetAll();
                    this.updateLevelCards();
                    soundSystem.playClick();
                }
            });
        }
    }

    initKeyListeners() {
        window.addEventListener('keydown', (e) => {
            const player = this.game.player;
            if (!player) return;

            switch (e.code) {
                case 'KeyA':
                case 'ArrowLeft':
                    player.keys.left = true;
                    break;

                case 'KeyD':
                case 'ArrowRight':
                    player.keys.right = true;
                    break;

                case 'Space':
                case 'KeyW':
                case 'ArrowUp':
                    if (!player.keys.up) {
                        player.jump();
                    }
                    player.keys.up = true;
                    e.preventDefault();
                    break;

                case 'ShiftLeft':
                case 'ShiftRight':
                case 'KeyK':
                    player.dash();
                    break;

                case 'Escape':
                case 'KeyP':
                    if (this.game.state === 'PLAYING' || this.game.state === 'PAUSED') {
                        this.togglePause();
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            const player = this.game.player;
            if (!player) return;

            switch (e.code) {
                case 'KeyA':
                case 'ArrowLeft':
                    player.keys.left = false;
                    break;

                case 'KeyD':
                case 'ArrowRight':
                    player.keys.right = false;
                    break;

                case 'Space':
                case 'KeyW':
                case 'ArrowUp':
                    player.keys.up = false;
                    break;
            }
        });
    }

    initSettings() {
        const soundCheck = document.getElementById('setting-sound');
        const musicCheck = document.getElementById('setting-music');
        const volumeRange = document.getElementById('setting-volume');
        const particlesCheck = document.getElementById('setting-particles');

        if (soundCheck) {
            soundCheck.addEventListener('change', (e) => {
                soundSystem.soundEnabled = e.target.checked;
            });
        }

        if (musicCheck) {
            musicCheck.addEventListener('change', (e) => {
                soundSystem.musicEnabled = e.target.checked;
            });
        }

        if (volumeRange) {
            volumeRange.addEventListener('input', (e) => {
                soundSystem.volume = parseFloat(e.target.value) / 100;
            });
        }

        if (particlesCheck) {
            particlesCheck.addEventListener('change', (e) => {
                this.game.particles.enabled = e.target.checked;
            });
        }
    }

    updateLevelCards() {
        const levelCards = document.querySelectorAll('.level-card');
        
        levelCards.forEach(card => {
            const lvl = parseInt(card.getAttribute('data-level'));
            const isUnlocked = saveSystem.isLevelUnlocked(lvl);
            const statusEl = card.querySelector('.level-status');
            const timeEl = card.querySelector('.level-best-time');
            const rankEl = card.querySelector('.level-best-rank');

            if (isUnlocked) {
                card.classList.add('active');
                if (statusEl) {
                    statusEl.textContent = 'DESBLOQUEADO';
                    statusEl.classList.add('unlocked');
                }

                // Exibir melhor tempo e rank
                const bestTime = saveSystem.getBestTime(lvl);
                const bestRank = saveSystem.getBestRank(lvl);

                if (timeEl && bestTime !== null) {
                    const mins = Math.floor(bestTime / 60).toString().padStart(2, '0');
                    const secs = (bestTime % 60).toFixed(1).padStart(4, '0');
                    timeEl.textContent = `⏱️ ${mins}:${secs}`;
                    timeEl.style.display = 'block';
                } else if (timeEl) {
                    timeEl.style.display = 'none';
                }

                if (rankEl && bestRank) {
                    rankEl.textContent = `🏆 Rank: ${bestRank}`;
                    rankEl.className = 'level-best-rank rank-color-' + bestRank.toLowerCase();
                    rankEl.style.display = 'block';
                } else if (rankEl) {
                    rankEl.style.display = 'none';
                }
            } else {
                card.classList.remove('active');
                if (statusEl) {
                    statusEl.textContent = '🔒 BLOQUEADO';
                    statusEl.classList.remove('unlocked');
                }
                if (timeEl) timeEl.style.display = 'none';
                if (rankEl) rankEl.style.display = 'none';
            }
        });
    }

    showScreen(screenId) {
        this.hideAllScreens();
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        }
        this.currentScreen = screenId;
    }

    hideAllScreens() {
        const screens = document.querySelectorAll('.menu-screen');
        screens.forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('active');
        });
        const hud = document.getElementById('hud');
        if (hud) hud.classList.add('hidden');
    }

    startGame(levelNum = 1) {
        if (!saveSystem.isLevelUnlocked(levelNum)) return;

        this.hideAllScreens();
        const hud = document.getElementById('hud');
        if (hud) hud.classList.remove('hidden');
        this.game.startLevel(levelNum);
    }

    togglePause() {
        const pauseScreen = document.getElementById('pause-screen');
        if (this.game.state === 'PLAYING') {
            this.game.state = 'PAUSED';
            if (pauseScreen) pauseScreen.classList.remove('hidden');
        } else if (this.game.state === 'PAUSED') {
            this.game.state = 'PLAYING';
            if (pauseScreen) pauseScreen.classList.add('hidden');
        }
    }
}
