import { User } from "./Upgrade.js";

export class DebtSystem {
    constructor() {
        if (DebtSystem.instance) {
            return DebtSystem.instance;
        }

        this.Initialize();
        DebtSystem.instance = this;
    }

    static Instance() {
        if (!DebtSystem.instance) {
            DebtSystem.instance = new DebtSystem();
        }
        return DebtSystem.instance;
    }

    Initialize() {
        this.totalDebt = 10000; // 초기 빚
        this.interestRate = 500; // 1분마다 갚아야 할 할당량
        this.gameTime = 0; // 게임 시작부터 경과한 시간 (초)
        this.totalGameTime = 600; // 총 게임 시간 (10분 = 600초)
        this.lastCollectionTime = 0; // 마지막 징수 시간
        
        // 1초마다 시간 체크
        setInterval(() => this.updateGameTime(), 1000);
        
        // 빚 갚기 버튼 이벤트 리스너 추가
        document.getElementById('repay-debt-btn').addEventListener('click', () => this.repayDebt());
        
        // 초기 빚 표시
        document.getElementById('remaining-debt').textContent = this.totalDebt;
    }

    updateGameTime() {
        this.gameTime++;
        
        // 남은 시간 계산 및 표시
        const remainingTime = this.totalGameTime - this.gameTime;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('remaining-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // 1분마다 징수
        if (this.gameTime % 60 === 0 && this.gameTime > 0) {
            this.collectDebt();
        }

        // 게임 종료 체크
        if (this.gameTime >= this.totalGameTime) {
            this.gameComplete();
        }
    }

    collectDebt() {
        const user = User.Instance(); // User 클래스의 인스턴스 가져오기
        
        if (user.credits >= this.interestRate && this.totalDebt > 0) {
            user.setCredits(user.credits - this.interestRate);
            this.totalDebt -= this.interestRate;
            document.getElementById('remaining-debt').textContent = this.totalDebt;
        } else {
            this.gameOver();
        }
    }

    repayDebt() {
        const user = User.Instance();
        const repayAmount = 100; // 한 번에 갚을 수 있는 금액

        if (user.credits >= repayAmount && this.totalDebt > 0) {
            user.setCredits(user.credits - repayAmount);
            this.totalDebt -= repayAmount;
            document.getElementById('remaining-debt').textContent = this.totalDebt;
        } else {
            showModal("크레딧이 부족합니다!");
        }
    }

    gameOver() {
        showModal("크레딧이 부족하여 할당량을 채우지 못했습니다. 게임 오버!");
        
        // 모달 닫기 버튼에 이벤트 리스너 추가
        const closeBtn = document.getElementById("modal-close-btn");
        closeBtn.onclick = () => {
            document.getElementById("modal").style.display = "none";
            moveTitle();
        };
    }

    gameComplete() {
        if (this.totalDebt <= 0) {
            showModal("축하합니다! 모든 빚을 변제 했습니다.");
        } else {
            showModal(`게임 종료! 남은 빚: ${this.totalDebt}`);
        }
        
        // 모달 닫기 버튼에 이벤트 리스너 추가
        const closeBtn = document.getElementById("modal-close-btn");
        closeBtn.onclick = () => {
            document.getElementById("modal").style.display = "none";
            moveTitle();
        };
    }
}

// 모달 표시 함수 (이미 있는 모달 활용)
function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    modal.style.display = "flex";
}

function moveTitle() {
    window.parent.document.getElementById("gameFrame").src = "Title.html";
}
