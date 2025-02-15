// User 클래스:
// 속성 (Properties):
// credits: 사용자의 현재 크레딧 (임시)
// upgrades: 업그레이드 상태를 저장하는 객체. 키는 업그레이드 종류(문자열), 값은 레벨(숫자)로 구성됩니다. (예: { "speed": 2, "capacity": 1 })

// 메서드 (Methods):
// constructor(): 생성자. 초기 크레딧과 업그레이드 상태를 설정합니다.
// upgrade(upgradeType): 특정 업그레이드 레벨을 올립니다.
// 업그레이드 비용을 확인하고, 크레딧이 충분하면 업그레이드를 진행하고 크레딧을 차감합니다.
// 크레딧이 부족하면 업그레이드를 수행하지 않습니다. (콘솔에 메시지 출력)
// getUpgradeLevel(upgradeType): 특정 업그레이드의 현재 레벨을 반환합니다.
// canAfford(upgradeType): 해당 업그레이드를 구매할 크레딧이 충분한지 확인합니다 (true/false 반환).
// _getUpgradeCost(upgradeType): 주어진 업그레이드 타입의 현재 레벨에 따른 비용을 반환합니다. (private 메서드)


class User {
    constructor(initialCredits, initialUpgrades) {
        this.credits = initialCredits || 0; // 초기 크레딧 (기본값 0)
        this.upgrades = initialUpgrades || {}; // 초기 업그레이드 상태 (기본값 빈 객체)
    }

    upgrade(upgradeType) {
        if (this.canAfford(upgradeType)) {
            const cost = this._getUpgradeCost(upgradeType);
            this.credits -= cost;
            this.upgrades[upgradeType] = (this.upgrades[upgradeType] || 0) + 1; // 레벨 증가
            console.log(`${upgradeType} 업그레이드 완료! (레벨: ${this.upgrades[upgradeType]})`);
            return true; //성공여부 반환
        } else {
            console.log(`${upgradeType} 업그레이드 비용 부족!`);
            return false; //실패 여부 반환
        }
    }

    getUpgradeLevel(upgradeType) {
        return this.upgrades[upgradeType] || 0; // 업그레이드 레벨이 없으면 0 반환
    }

    canAfford(upgradeType) {
        const cost = this._getUpgradeCost(upgradeType);
        return this.credits >= cost;
    }
    //private 메서드
    _getUpgradeCost(upgradeType) {
        const currentLevel = this.getUpgradeLevel(upgradeType);
        // 업그레이드 비용 계산 로직 (임시)
        switch (upgradeType) {
            case "speed":
                return 10 * (currentLevel + 1); // 속도 업그레이드 비용
            case "capacity":
                return 15 * (currentLevel + 1); // 용량 업그레이드 비용
            // 다른 업그레이드 종류 추가...
            default:
                return Infinity; // 알 수 없는 업그레이드 타입은 무한대 비용 (구매 불가)
        }
    }
}

// 사용 예시:
const user = new User(100, { "speed": 1 }); // 초기 크레딧 100, 속도 레벨 1
console.log("초기 크레딧:", user.credits);
console.log("초기 속도 레벨:", user.getUpgradeLevel("speed"));

user.upgrade("speed"); // 속도 업그레이드 시도
console.log("현재 크레딧:", user.credits);
console.log("현재 속도 레벨:", user.getUpgradeLevel("speed"));

user.upgrade("capacity"); // 용량 업그레이드 시도 (크레딧 부족)
console.log("현재 크레딧:", user.credits);
console.log("현재 용량 레벨:", user.getUpgradeLevel("capacity")); // 레벨 0 (업그레이드 안됨)
