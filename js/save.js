/* ==========================================================================
   DRAGON RUSH: SAVE SYSTEM (PROGRESSÃO, TEMPOS & RANKINGS)
   ========================================================================== */

class SaveSystem {
    constructor() {
        this.storageKey = 'dragonRush_saveData';
        this.data = this.load();
    }

    getDefault() {
        return {
            unlockedLevels: 1,
            bestTimes: {},    // { "1": 23.5, "2": 45.1, ... }
            bestRanks: {},    // { "1": "S", "2": "A", ... }
            totalDeaths: 0,
            totalClears: 0,
            settings: {
                sound: true,
                music: true,
                volume: 80,
                particles: true
            }
        };
    }

    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...this.getDefault(), ...parsed };
            }
        } catch (e) {
            console.warn('Erro ao carregar save:', e);
        }
        return this.getDefault();
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Erro ao salvar:', e);
        }
    }

    unlockLevel(levelNum) {
        if (levelNum > this.data.unlockedLevels) {
            this.data.unlockedLevels = levelNum;
            this.save();
        }
    }

    isLevelUnlocked(levelNum) {
        return levelNum <= this.data.unlockedLevels;
    }

    recordCompletion(levelNum, time) {
        const key = String(levelNum);
        const rank = this.calculateRank(levelNum, time);

        // Atualizar melhor tempo
        if (!this.data.bestTimes[key] || time < this.data.bestTimes[key]) {
            this.data.bestTimes[key] = Math.round(time * 10) / 10;
        }

        // Atualizar melhor rank
        const rankOrder = ['S', 'A', 'B', 'C'];
        const currentBest = this.data.bestRanks[key];
        if (!currentBest || rankOrder.indexOf(rank) < rankOrder.indexOf(currentBest)) {
            this.data.bestRanks[key] = rank;
        }

        this.data.totalClears++;

        // Desbloquear próximo nível
        this.unlockLevel(levelNum + 1);
        this.save();

        return { rank, bestTime: this.data.bestTimes[key], isNewRecord: time <= this.data.bestTimes[key] };
    }

    recordDeath() {
        this.data.totalDeaths++;
        this.save();
    }

    calculateRank(levelNum, time) {
        // Tempos de referência por nível (em segundos)
        const thresholds = {
            1: { S: 25, A: 35, B: 50 },
            2: { S: 30, A: 42, B: 58 },
            3: { S: 28, A: 38, B: 52 },
            4: { S: 26, A: 36, B: 50 },
            5: { S: 32, A: 45, B: 60 }
        };

        const t = thresholds[levelNum] || { S: 30, A: 45, B: 60 };

        if (time <= t.S) return 'S';
        if (time <= t.A) return 'A';
        if (time <= t.B) return 'B';
        return 'C';
    }

    getBestTime(levelNum) {
        return this.data.bestTimes[String(levelNum)] || null;
    }

    getBestRank(levelNum) {
        return this.data.bestRanks[String(levelNum)] || null;
    }

    resetAll() {
        this.data = this.getDefault();
        this.save();
    }
}

const saveSystem = new SaveSystem();
