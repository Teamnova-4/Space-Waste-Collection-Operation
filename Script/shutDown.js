export class shutDown {
    constructor() {
        if (shutDown.instance) {
            return shutDown.instance;
        }
        shutDown.instance = this;

        // DOM이 로드된 후에 요소 가져오기
        document.addEventListener("DOMContentLoaded", () => {
            this.modal = document.getElementById("gameOverModal");
            this.gameWin = document.getElementById("gameWin");
            this.gameOver = document.getElementById("gameOver");
            this.closeBtn = document.querySelector(".close");

            if (!this.modal || !this.gameWin || !this.closeBtn || !this.gameOver) {
                console.error("❌ 모달 요소를 찾을 수 없습니다. HTML을 확인하세요.");
                return;
            }
            // 게임 오버 선택창 보이지 않게 하기기
            this.modal.style.display = "none";
        });
    }
    Initialize() {
        // 초기화 로직

    }

    static Instance() {
        if (!shutDown.instance) {
            shutDown.instance = new shutDown();
        }
        return shutDown.instance;
    }

    // showGameOverModal() {
    //     this.message.textContent = "🎉 게임 승리! 🎉";
    //     this.modal.style.display = "block";
    // }

    showModal() {
        console.log('셧다운 버튼 클릭 / 게임 어떻게 종료할껀가요?');
        this.modal.style.display = "block";
    }
}
