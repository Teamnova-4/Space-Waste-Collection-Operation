import { DebtSystem } from "./DebtSystem.js";

export class shutDown {
    constructor() {
        if (shutDown.instance) {
            return shutDown.instance;

        }
        shutDown.instance = this;
        console.log("셧다운 생성");
        document.addEventListener("DOMContentLoaded", () => {

            this.modal = document.getElementById("gameChoseModal");
            this.gameWin = document.getElementById("gameWin");
            this.gameOver = document.getElementById("gameOver");
            this.closeBtn = document.querySelector(".close");
            this.winButton = document.getElementById("winButton");
            this.loseButton = document.getElementById("loseButton");
            this.cancelButton = document.getElementById("cancelButton");
            this.gameClearModal = document.getElementById("gameClearModal");
            this.shutdownChoseButton = document.getElementById("shutDown");
            this.gameOverModal = document.getElementById("gameOverModal");


            this.titleScreenButtons = document.querySelectorAll("#titleScreenButton");
            this.restartButtons = document.querySelectorAll("#restartButton");

            if (!this.gameOverModal || !this.shutdownChoseButton || !this.modal || !this.gameWin || !this.gameOver || !this.closeBtn
                || !this.winButton || !this.loseButton || !this.cancelButton || !this.gameClearModal) {
                console.error("❌ 셧다운 관련 요소를 찾을 수 없습니다. HTML을 확인하세요.");
                return;
            }
            // 셧다운 게임승리, 게임 패배, 취소, 버튼 리스너
            this.setupFirstEventListeners();
            // 게임승리나 게임패배에 나오는 타이틀로이동 버튼, 다시 시작하기 버튼 리스너
            this.setupSeceondEventListeners();
            // 셧다운 모달 숨기기
            this.modal.style.display = "none";
        });
    }
    /**
   * 싱클톤 초기화 함수
   */
    Initialize() {
        this.setupFirstEventListeners();
        this.setupSeceondEventListeners();
    }

    setupFirstEventListeners() {
        // 셧다운 선택 버튼
        this.shutdownChoseButton.addEventListener("click", () => {
            this.showModal();
        });
        // 승리 버튼
        this.winButton.addEventListener("click", () => {
            this.handleGameWin();
        });
        // 패배 버튼
        this.loseButton.addEventListener("click", () => {
            this.handleGameLose();
        });
        // 취소 버튼
        this.cancelButton.addEventListener("click", () => {
            this.hideModal();
        });
        // X 버튼으로 닫기
        this.closeBtn.addEventListener("click", () => {
            this.hideModal();
        });
        // 모달 외부 클릭으로 닫기
        window.addEventListener("click", (event) => {
            if (event.target === this.modal) {
                this.hideModal();
            }
        });
    }
    setupSeceondEventListeners() {
        // 타이틀로 이동하기 버튼
        this.titleScreenButtons.forEach(button => {
            button.addEventListener("click", () => {
                console.log("타이틀로 이동");
                this.moveTitle();
            });
        });
        // 다시 시작하기 버튼
        this.restartButtons.forEach(button => {
            button.addEventListener("click", () => {
                console.log("게임 재시작");
                this.reStart();
            });
        });
    }

    // 게임 승리 처리
    handleGameWin() {
        // 게임 승리 모달 표시시
        this.gameWin.style.display = "block";
        // 게임 패배 모달 숨기기
        this.gameOver.style.display = "none";
        // 게임 승리 모달 표시
        this.gameClearModal.style.display = "block";
        console.log("게임 승리로 종료");
        // 10초뒤 모달 닫고 타이틀로 이동
        setTimeout(() => {
            // this.hideModal();
            this.moveTitle();
        }, 10000);
    }

    handleGameLose() {
        // 게임 승리 모달 숨기기
        this.gameWin.style.display = "none";
        // 게임 패배 모달 표시
        this.gameOver.style.display = "none";

        this.gameOverModal.style.display = "block";
        // 여기에 게임 패배 시 필요한 추가 로직 구현
        console.log("게임 패배로 종료");
        // 10초뒤 모달 닫고 타이틀로 이동
        setTimeout(() => {
            this.hideModal();
            this.moveTitle();
        }, 10000);
    }

    showModal() {
        console.log('셧다운 모달 표시');
        this.modal.style.display = "block";
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = "none";
            // 모달을 숨길 때 게임 승/패 메시지도 초기화
            if (this.gameWin) this.gameWin.style.display = "none";
            if (this.gameOver) this.gameOver.style.display = "none";
        }
    }

    moveTitle() {
        window.parent.document.getElementById("gameFrame").src = "Title.html";
    }
    reStart() {
        window.location.reload();
    }
    static Instance() {
        if (!shutDown.instance) {
            shutDown.instance = new shutDown();
        }
        return shutDown.instance;
    }
}
