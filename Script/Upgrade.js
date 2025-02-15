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
        this.credits = initialCredits || 0;
        this.upgrades = initialUpgrades || {};
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

    // private 메서드
    _getUpgradeCost(upgradeType) {
        const currentLevel = this.getUpgradeLevel(upgradeType);
        switch (upgradeType) {
            case "speed":
                return 10 * (currentLevel + 1);
            case "capacity":
                return 15 * (currentLevel + 1);
            case "defense":
                return 20 * (currentLevel + 1);
            case "storage":
                return 25 * (currentLevel + 1);
            default:
                return Infinity;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const user = new User(100, { "speed": 1 });

    // UI 업데이트 함수
    function updateUI() {
        document.getElementById("credits").textContent = user.credits;
        document.getElementById("drone-speed-level").textContent = user.getUpgradeLevel("speed");
        document.getElementById("drone-capacity-level").textContent = user.getUpgradeLevel("capacity");
        document.getElementById("base-defense-level").textContent = user.getUpgradeLevel("defense");
        document.getElementById("base-storage-level").textContent = user.getUpgradeLevel("storage");
    }

    // 업그레이드 버튼 클릭 시 실행될 함수
    function upgradeFeature(type) {
        if (user.upgrade(type)) { // 여기서 user 객체를 사용합니다.
            console.log(`${type} 업그레이드 성공!`);
        } else {
            showModal("크레딧이 부족합니다");
            console.log(`${type} 업그레이드 실패 (크레딧 부족)!`);
        }

        updateUI();
    }

    // 알림창 띄우는 함수
    function showModal(message) {
        const modal = document.getElementById("modal");
        const modalMessage = document.getElementById("modal-message");
        modalMessage.textContent = message;
        modal.style.display = "flex";
    }

    // 모달 닫기 함수
    function closeModal() {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    }

    // 모달 닫기 버튼 클릭 이벤트 리스너 추가
    document.getElementById("modal-close-btn").addEventListener("click", function () {
        closeModal();
    });
    
    // 업그레이드 버튼 클릭 이벤트 리스너 추가
    document.getElementById("drone-speed-btn").addEventListener("click", () => {
        upgradeFeature("speed");
    });
    document.getElementById("drone-capacity-btn").addEventListener("click", () => {
        upgradeFeature("capacity");
    });
    document.getElementById("base-defense-btn").addEventListener("click", () => {
        upgradeFeature("defense");
    });
    // document.getElementById("base-storage-btn").addEventListener("click", () => {
    //     upgradeFeature("storage");
    // });

    // 초기 UI 설정
    updateUI();
});
