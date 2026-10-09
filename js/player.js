/* ==========================================================================
   DRAGON RUSH: PLAYER MECHANICS (FÍSICA PRECISA, TRAIL & PARKOUR)
   ========================================================================== */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 54;

        // Física
        this.vx = 0;
        this.vy = 0;
        this.speed = 10.5;
        this.accel = 1.6;
        this.friction = 0.84;
        this.gravity = 0.75;

        // Pulos e Wall Jump
        this.isGrounded = false;
        this.jumpForce = -15.2;
        this.jumpCount = 0;
        this.maxJumps = 2;

        this.isTouchingWall = false;
        this.wallDirection = 0;
        this.isWallSliding = false;

        // Dash
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashTimer = 0;
        this.dashSpeed = 22;
        this.facingRight = true;

        // Efeitos Visuais
        this.animTimer = 0;
        this.trails = [];
        this.dustParticles = [];
        this.deathTimer = 0;
        this.isDead = false;
        this.squashStretch = { x: 1, y: 1 };
        this.landingEffect = 0;

        this.keys = {
            left: false,
            right: false,
            up: false,
            dash: false
        };
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.jumpCount = 0;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dustParticles = [];
        this.trails = [];
        this.isDead = false;
        this.deathTimer = 0;
        this.squashStretch = { x: 1, y: 1 };
        this.landingEffect = 0;
    }

    update(platforms) {
        this.animTimer++;

        // Cooldown do Dash
        if (this.dashCooldown > 0) this.dashCooldown--;
        if (this.dashTimer > 0) {
            this.dashTimer--;
            if (this.dashTimer === 0) this.isDashing = false;
        }

        // Landing Effect decay
        if (this.landingEffect > 0) this.landingEffect *= 0.8;

        // Movimento Horizontal
        if (this.isDashing) {
            this.vx = this.facingRight ? this.dashSpeed : -this.dashSpeed;
            this.vy = 0;
            // Trail de dash
            if (Math.random() < 0.8) {
                this.trails.push({
                    x: this.x, y: this.y,
                    width: this.width, height: this.height,
                    alpha: 0.7, type: 'dash'
                });
            }
        } else {
            if (this.keys.right) {
                if (this.vx < 0) this.vx = 0;
                this.vx += this.accel;
                this.facingRight = true;
            } else if (this.keys.left) {
                if (this.vx > 0) this.vx = 0;
                this.vx -= this.accel;
                this.facingRight = false;
            } else {
                // Frenagem firme
                const currentFriction = this.isGrounded ? 0.42 : 0.86;
                this.vx *= currentFriction;
                if (Math.abs(this.vx) < 0.4) this.vx = 0;
            }
        }

        if (!this.isDashing) {
            this.vx = Math.max(-this.speed, Math.min(this.speed, this.vx));
        }

        // Gravidade e Wall Slide
        if (!this.isDashing) {
            this.vy += this.gravity;
            if (this.isTouchingWall && !this.isGrounded && this.vy > 0) {
                this.isWallSliding = true;
                this.vy = Math.min(this.vy, 3.0);

                // Partículas de wall slide
                if (this.animTimer % 4 === 0) {
                    this.dustParticles.push({
                        x: this.isTouchingWall ? (this.wallDirection > 0 ? this.x + this.width : this.x) : this.x,
                        y: this.y + this.height * 0.5,
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 2,
                        alpha: 0.6,
                        size: 3 + Math.random() * 2
                    });
                }
            } else {
                this.isWallSliding = false;
            }
        }

        // Squash & Stretch
        if (this.vy < -5) {
            // Esticando no ar (subindo)
            this.squashStretch.x = 0.85;
            this.squashStretch.y = 1.15;
        } else if (this.vy > 8) {
            // Esticando (caindo)
            this.squashStretch.x = 0.8;
            this.squashStretch.y = 1.2;
        } else {
            // Voltando ao normal
            this.squashStretch.x += (1 - this.squashStretch.x) * 0.2;
            this.squashStretch.y += (1 - this.squashStretch.y) * 0.2;
        }

        // Aplicar Movimentos
        const wasGrounded = this.isGrounded;
        this.x += this.vx;
        this.checkCollisionX(platforms);

        this.y += this.vy;
        this.checkCollisionY(platforms);

        // Efeito de aterrissagem
        if (!wasGrounded && this.isGrounded) {
            this.landingEffect = 1;
            this.squashStretch.x = 1.3;
            this.squashStretch.y = 0.7;

            // Partículas de poeira
            for (let i = 0; i < 4; i++) {
                this.dustParticles.push({
                    x: this.x + this.width / 2,
                    y: this.y + this.height,
                    vx: (Math.random() - 0.5) * 4,
                    vy: -Math.random() * 3 - 1,
                    alpha: 0.5,
                    size: 2 + Math.random() * 3
                });
            }
        }

        // Running particles
        if (this.isGrounded && Math.abs(this.vx) > 5 && this.animTimer % 6 === 0) {
            this.dustParticles.push({
                x: this.x + (this.facingRight ? 0 : this.width),
                y: this.y + this.height,
                vx: (this.facingRight ? -1 : 1) * (Math.random() * 2 + 1),
                vy: -Math.random() * 1.5,
                alpha: 0.35,
                size: 2 + Math.random() * 2
            });
        }

        // Atualizar Rastros
        for (let i = this.trails.length - 1; i >= 0; i--) {
            this.trails[i].alpha -= 0.08;
            if (this.trails[i].alpha <= 0) this.trails.splice(i, 1);
        }

        // Atualizar Partículas de poeira
        for (let i = this.dustParticles.length - 1; i >= 0; i--) {
            let d = this.dustParticles[i];
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.08;
            d.alpha -= 0.02;
            d.size *= 0.98;
            if (d.alpha <= 0 || d.size < 0.5) this.dustParticles.splice(i, 1);
        }
    }

    jump() {
        if (this.isWallSliding) {
            this.vy = this.jumpForce;
            this.vx = -this.wallDirection * 12;
            this.jumpCount = 1;
            if (typeof soundSystem !== 'undefined') soundSystem.playJump();
            return;
        }

        if (this.jumpCount < this.maxJumps) {
            this.vy = this.jumpForce;
            this.jumpCount++;
            this.isGrounded = false;
            if (typeof soundSystem !== 'undefined') soundSystem.playJump();
        }
    }

    dash() {
        if (this.dashCooldown === 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashTimer = 8;
            this.dashCooldown = 35;
            if (typeof soundSystem !== 'undefined') soundSystem.playDash();
        }
    }

    checkCollisionX(platforms) {
        this.isTouchingWall = false;
        for (let p of platforms) {
            if (p.type === 'lava' || p.broken) continue;
            if (this.x < p.x + p.width &&
                this.x + this.width > p.x &&
                this.y < p.y + p.height &&
                this.y + this.height > p.y) {

                if (this.vx > 0) {
                    this.x = p.x - this.width;
                    this.isTouchingWall = true;
                    this.wallDirection = 1;
                } else if (this.vx < 0) {
                    this.x = p.x + p.width;
                    this.isTouchingWall = true;
                    this.wallDirection = -1;
                }
                this.vx = 0;
            }
        }
    }

    checkCollisionY(platforms) {
        this.isGrounded = false;
        for (let p of platforms) {
            if (p.type === 'lava' || p.broken) continue;
            if (this.x < p.x + p.width &&
                this.x + this.width > p.x &&
                this.y < p.y + p.height &&
                this.y + this.height > p.y) {

                if (this.vy > 0) {
                    this.y = p.y - this.height;
                    this.vy = 0;
                    this.isGrounded = true;
                    this.jumpCount = 0;
                } else if (this.vy < 0) {
                    this.y = p.y + p.height;
                    this.vy = 0;
                }
            }
        }
    }

    draw(ctx, cameraX) {
        ctx.save();
        const screenX = this.x - cameraX;

        // Rastro de Dash (efeitos visuais)
        for (let trail of this.trails) {
            ctx.globalAlpha = trail.alpha * 0.5;
            if (trail.type === 'dash') {
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(trail.x - cameraX, trail.y, trail.width, trail.height);
            }
        }
        ctx.globalAlpha = 1;

        // Partículas de poeira
        for (let d of this.dustParticles) {
            ctx.beginPath();
            ctx.arc(d.x - cameraX, d.y, d.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 160, 140, ${d.alpha})`;
            ctx.fill();
        }

        // Sombra do jogador
        ctx.beginPath();
        ctx.ellipse(screenX + this.width / 2, this.y + this.height + 2, this.width * 0.4, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        // Aplicar squash & stretch
        ctx.save();
        ctx.translate(screenX + this.width / 2, this.y + this.height);
        ctx.scale(this.squashStretch.x, this.squashStretch.y);
        ctx.translate(-this.width / 2, -this.height);

        // Efeito de dash (brilho)
        if (this.isDashing) {
            ctx.fillStyle = 'rgba(255, 100, 0, 0.4)';
            ctx.fillRect(-4, -4, this.width + 8, this.height + 8);
        }

        // Wall slide visual
        if (this.isWallSliding) {
            ctx.fillStyle = 'rgba(200, 200, 255, 0.2)';
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Renderizar personagem
        if (typeof spriteManager !== 'undefined' && spriteManager.images.playerHero && spriteManager.loaded) {
            if (!this.facingRight) {
                ctx.save();
                ctx.translate(this.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(spriteManager.images.playerHero, 0, 0, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(spriteManager.images.playerHero, 0, 0, this.width, this.height);
            }
        } else {
            // Fallback - desenhado com formas
            this.drawFallback(ctx);
        }

        ctx.restore();

        // Indicador de Dash Cooldown
        if (this.dashCooldown > 0) {
            const cdPct = this.dashCooldown / 35;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(screenX, this.y - 8, this.width, 4);
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(screenX, this.y - 8, this.width * (1 - cdPct), 4);
        }

        ctx.restore();
    }

    drawFallback(ctx) {
        // Corpo
        ctx.fillStyle = this.isDashing ? '#ff6600' : '#2b2d42';
        ctx.fillRect(4, 0, this.width - 8, this.height - 4);

        // Cabeça
        ctx.fillStyle = '#e0c8a8';
        ctx.fillRect(8, 2, this.width - 16, 16);

        // Olhos
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.facingRight ? 18 : 10, 6, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.facingRight ? 19 : 11, 7, 2, 2);

        // Capa
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(this.facingRight ? 2 : this.width - 10, 14, 8, this.height - 20);

        // Botas
        ctx.fillStyle = '#3a2012';
        ctx.fillRect(6, this.height - 8, 10, 8);
        ctx.fillRect(this.width - 16, this.height - 8, 10, 8);
    }
}
