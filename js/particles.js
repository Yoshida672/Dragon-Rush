/* ==========================================================================
   DRAGON RUSH: PARTICLES SYSTEM (BRASAS, FOGO E SOMBRAS DA DUNGEON)
   ========================================================================== */

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.enabled = true;
        this.maxParticles = 80;
    }

    init(width, height) {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle(width, height, true));
        }
    }

    createParticle(width, height, randomY = false) {
        const colors = [
            'rgba(255, 69, 0, ',    // Vermelho fogo
            'rgba(255, 140, 0, ',   // Laranja queimado
            'rgba(255, 215, 0, ',   // Amarelo brasa
            'rgba(200, 30, 0, '     // Vermelho rubi
        ];
        
        return {
            x: Math.random() * width,
            y: randomY ? Math.random() * height : height + 10,
            size: Math.random() * 3.5 + 1,
            speedY: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.8,
            alpha: Math.random() * 0.8 + 0.2,
            decay: Math.random() * 0.005 + 0.002,
            colorBase: colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.05 + 0.02
        };
    }

    update(width, height) {
        if (!this.enabled) return;

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.y -= p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * 0.5;
            p.alpha -= p.decay;

            if (p.y < -10 || p.alpha <= 0) {
                this.particles[i] = this.createParticle(width, height);
            }
        }
    }

    draw(ctx) {
        if (!this.enabled) return;

        ctx.save();
        for (let p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.colorBase + p.alpha + ')';
            ctx.shadowBlur = p.size * 3;
            ctx.shadowColor = 'rgba(255, 69, 0, 0.8)';
            ctx.fill();
        }
        ctx.restore();
    }
}
