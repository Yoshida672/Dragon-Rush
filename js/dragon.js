/* ==========================================================================
   DRAGON RUSH: DRAGON BOSS (IA AVANÇADA & HABILIDADES POR NÍVEL)
   ========================================================================== */

class Dragon {
    constructor() {
        this.x = -750;
        this.y = 0;
        this.baseSpeed = 5.2;
        this.currentSpeed = this.baseSpeed;
        this.speedIncrement = 0.0003;
        this.flames = [];
        this.roarCooldown = 0;
        this.animTimer = 0;

        // IA Avançada
        this.enrageTimer = 0;
        this.isEnraged = false;
        this.enrageSpeed = 0;
        this.breathAttackTimer = 0;
        this.fireProjectiles = [];
        this.level = 1;

        // Visual
        this.eyeGlow = 0;
        this.jawOpen = 0;
        this.bodyWave = 0;
    }

    reset() {
        this.x = -750;
        this.currentSpeed = this.baseSpeed;
        this.flames = [];
        this.roarCooldown = 0;
        this.animTimer = 0;
        this.enrageTimer = 0;
        this.isEnraged = false;
        this.enrageSpeed = 0;
        this.breathAttackTimer = 0;
        this.fireProjectiles = [];
        this.eyeGlow = 0;
        this.jawOpen = 0;
    }

    setLevel(levelNum) {
        this.level = levelNum;

        // Ajustar comportamento por nível
        switch (levelNum) {
            case 1:
                this.baseSpeed = 5.0;
                this.speedIncrement = 0.0002;
                break;
            case 2:
                this.baseSpeed = 5.3;
                this.speedIncrement = 0.0003;
                break;
            case 3:
                this.baseSpeed = 5.5;
                this.speedIncrement = 0.0004;
                break;
            case 4:
                this.baseSpeed = 5.8;
                this.speedIncrement = 0.0005;
                break;
            case 5:
                this.baseSpeed = 6.0;
                this.speedIncrement = 0.0006;
                break;
        }
        this.currentSpeed = this.baseSpeed;
    }

    update(playerX) {
        this.animTimer += 0.1;
        this.bodyWave = Math.sin(this.animTimer * 0.6) * 4;

        // Aceleração gradual
        this.currentSpeed += this.speedIncrement;

        // Sistema de Fúria (a partir do nível 3)
        if (this.level >= 3) {
            this.enrageTimer++;
            // A cada ~12 segundos, entra em fúria por 3 segundos
            if (this.enrageTimer > 720 && !this.isEnraged) {
                this.isEnraged = true;
                this.enrageSpeed = this.currentSpeed * 0.35;
                this.enrageTimer = 0;
                if (typeof soundSystem !== 'undefined') soundSystem.playDragonRoar();
            }

            if (this.isEnraged) {
                this.enrageTimer++;
                this.eyeGlow = Math.min(1, this.eyeGlow + 0.05);
                if (this.enrageTimer > 180) {
                    this.isEnraged = false;
                    this.enrageSpeed = 0;
                    this.enrageTimer = 0;
                    this.eyeGlow = 0;
                }
            }
        }

        // Movimentação
        this.x += this.currentSpeed + this.enrageSpeed;

        // Rubber-banding: se o jogador estiver muito longe, acelerar
        const distance = playerX - this.x;
        if (distance > 650) {
            this.x += 1.8;
        }
        // Se estiver perto demais, desacelerar levemente (dar chance ao jogador)
        if (distance < 250 && this.level <= 3) {
            this.x -= 0.3;
        }

        // Rugido
        if (distance < 380 && this.roarCooldown <= 0) {
            if (typeof soundSystem !== 'undefined') soundSystem.playDragonRoar();
            this.roarCooldown = 300;
        }
        if (this.roarCooldown > 0) this.roarCooldown--;

        // Bolas de fogo (nível 4+)
        if (this.level >= 4) {
            this.breathAttackTimer++;
            if (this.breathAttackTimer > 420 && distance < 500) {
                this.fireProjectile();
                this.breathAttackTimer = 0;
            }
        }

        // Atualizar projéteis de fogo
        for (let i = this.fireProjectiles.length - 1; i >= 0; i--) {
            let p = this.fireProjectiles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.size *= 0.99;
            if (p.life <= 0 || p.size < 3) {
                this.fireProjectiles.splice(i, 1);
            }
        }

        // Chamas decorativas
        const flameCount = this.isEnraged ? 8 : 4;
        for (let i = 0; i < flameCount; i++) {
            this.flames.push({
                x: this.x + 240 + Math.random() * 30,
                y: 320 + (Math.random() - 0.5) * 60 + this.bodyWave,
                vx: Math.random() * 12 + 10,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 26 + 14,
                alpha: 0.95,
                decay: 0.02
            });
        }

        for (let i = this.flames.length - 1; i >= 0; i--) {
            let f = this.flames[i];
            f.x += f.vx;
            f.y += f.vy;
            f.alpha -= f.decay;
            if (f.alpha <= 0) this.flames.splice(i, 1);
        }

        // Animação da mandíbula
        this.jawOpen = Math.sin(this.animTimer * 0.8) * 3 + 3;
    }

    fireProjectile() {
        this.fireProjectiles.push({
            x: this.x + 280,
            y: 280 + (Math.random() - 0.5) * 80,
            vx: 14 + Math.random() * 4,
            vy: (Math.random() - 0.5) * 3,
            size: 18 + Math.random() * 10,
            life: 90
        });
        if (typeof soundSystem !== 'undefined') soundSystem.playDragonRoar();
    }

    draw(ctx, cameraX, canvasHeight) {
        ctx.save();
        const screenX = this.x - cameraX;

        // Chamas decorativas
        for (let f of this.flames) {
            const fScreenX = f.x - cameraX;
            ctx.beginPath();
            ctx.arc(fScreenX, f.y, f.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, ${Math.floor(40 + f.alpha * 160)}, 0, ${f.alpha})`;
            ctx.fill();
        }

        // Projéteis de fogo
        for (let p of this.fireProjectiles) {
            const pScreenX = p.x - cameraX;
            ctx.beginPath();
            ctx.arc(pScreenX, p.y, p.size, 0, Math.PI * 2);

            const grad = ctx.createRadialGradient(pScreenX, p.y, 0, pScreenX, p.y, p.size);
            grad.addColorStop(0, 'rgba(255, 255, 200, 0.95)');
            grad.addColorStop(0.4, 'rgba(255, 100, 0, 0.8)');
            grad.addColorStop(1, 'rgba(200, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Mar de fogo da morte
        const fireGrad = ctx.createLinearGradient(screenX - 400, 0, screenX + 250, 0);
        if (this.isEnraged) {
            fireGrad.addColorStop(0, 'rgba(150, 0, 0, 0.98)');
            fireGrad.addColorStop(0.7, 'rgba(255, 80, 0, 0.92)');
            fireGrad.addColorStop(1, 'rgba(255, 200, 0, 0)');
        } else {
            fireGrad.addColorStop(0, 'rgba(100, 0, 0, 0.98)');
            fireGrad.addColorStop(0.7, 'rgba(255, 50, 0, 0.85)');
            fireGrad.addColorStop(1, 'rgba(255, 200, 0, 0)');
        }
        ctx.fillStyle = fireGrad;
        ctx.fillRect(screenX - 700, 0, 950, canvasHeight);

        // Cabeça do Dragão
        if (typeof spriteManager !== 'undefined' && spriteManager.images.dragonHead && spriteManager.loaded) {
            ctx.drawImage(spriteManager.images.dragonHead, screenX, 120 + this.bodyWave, 260, 260);
        } else {
            // Fallback - Dragão desenhado com formas
            this.drawDragonFallback(ctx, screenX);
        }

        // Olhos brilhantes (fúria)
        if (this.isEnraged) {
            ctx.beginPath();
            ctx.arc(screenX + 200, 200 + this.bodyWave, 12, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + this.eyeGlow * 0.5})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(screenX + 220, 180 + this.bodyWave, 10, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 50, 0, ${0.5 + this.eyeGlow * 0.5})`;
            ctx.fill();
        }

        ctx.restore();
    }

    drawDragonFallback(ctx, screenX) {
        // Corpo escuro
        ctx.fillStyle = '#140c14';
        ctx.fillRect(screenX, 120 + this.bodyWave, 200, 200);

        // Olhos
        ctx.fillStyle = this.isEnraged ? '#ff0000' : '#ff6600';
        ctx.beginPath();
        ctx.arc(screenX + 150, 180 + this.bodyWave, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 175, 170 + this.bodyWave, 6, 0, Math.PI * 2);
        ctx.fill();

        // Mandíbula
        ctx.fillStyle = '#1a0e1a';
        ctx.fillRect(screenX + 140, 220 + this.bodyWave + this.jawOpen, 60, 15);
    }
}
