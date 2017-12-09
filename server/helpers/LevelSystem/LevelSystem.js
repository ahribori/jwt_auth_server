class LevelSystem {
    constructor(maxLevel = 100) {
        this.expTable = [
            0,
        ];

        const getExpTable = () => this.expTable;

        const getExpByLevel = x => (x * (x + 10)) ** 2;

        const getLevelByExp = (exp) => {
            if (Number.isNaN(Number(exp))) {
                return null;
            }
            for (let i = 1; i <= maxLevel; i += 1) {
                if (exp >= this.expTable[maxLevel]) {
                    return {
                        level: maxLevel + 1,
                        exp,
                        next: this.expTable[maxLevel],
                        remainder: 0,
                        expInCurrentLevel: this.expTable[maxLevel] - this.expTable[maxLevel - 1],
                        expRequireInCurrentLevel: 0,
                        progress: 100,
                    };
                }
                if (exp < this.expTable[i]) {
                    const level = i;
                    const next = this.expTable[level];
                    const remainder = this.expTable[level] - exp;
                    const expInCurrentLevel = exp - this.expTable[level - 1];
                    const expRequireInCurrentLevel = this.expTable[level] - this.expTable[level - 1];
                    const progress = Number(((expInCurrentLevel / expRequireInCurrentLevel) * 100).toFixed(2));

                    return {
                        level, // 레벨
                        exp, // 누적 경험치
                        next, // 레벨업 하기 위해 필요한 누적 경험치
                        remainder, // 다음 레벨까지 남은 경험치
                        expInCurrentLevel, // 현재 레벨에서 획득한 경험치
                        expRequireInCurrentLevel, // 레벨업 하기 위해 현재 레벨에서 필요한 총 경험치
                        progress, // 현재 레벨에서의 경험치 퍼센티지
                    };
                }
            }
            return null;
        };

        for (let i = 1; i <= maxLevel; i += 1) {
            const expValue = getExpByLevel(i);
            this.expTable.push(expValue);
        }
        return {
            getExpTable,
            getLevelByExp,
        };
    }
}

export default LevelSystem;
