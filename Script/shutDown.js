export class shutDown {
    constructor() {
        if (shutDown.instance) {
            return shutDown.instance;

        }
        shutDown.instance = this;

        console.log("셧다운 생성");
        document.addEventListener("DOMContentLoaded", () => {
            // 셧다운 선택 화면 모달
            this.modal = document.getElementById("gameChoseModal");
            this.gameWin = document.getElementById("gameWin");
            this.gameOver = document.getElementById("gameOver");
            this.closeBtn = document.querySelector(".close");
            this.winButton = document.getElementById("winButton");
            this.loseButton = document.getElementById("loseButton");
            this.cancelButton = document.getElementById("cancelButton");
            this.gameClearModal = document.getElementById("gameClearModal");
            // 셧다운 선택 버튼
            this.shutdownChoseButton = document.getElementById("shutDown");

            this.gameOverModal = document.getElementById("gameOverModal");
            this.titleScreenButtons = document.querySelectorAll("#titleScreenButton");
            this.restartButtons = document.querySelectorAll("#restartButton");

            // 게임 상태 요소 가져옴
            this.remainingTime = document.getElementById("remaining-time");
            this.remainingDebt = document.getElementById("remaining-debt");
            this.nextDebt = document.getElementById("next-debt");

            this.TrashCount = 0; // 쓰레기 개수를 저장하는 변수

            console.log("remainingTime:", this.remainingTime);
            console.log("remainingDebt:", this.remainingDebt);
            console.log("nextDebt:", this.nextDebt);

            const missingElements = [];

            const elements = {
                gameOverModal: this.gameOverModal,
                shutdownChoseButton: this.shutdownChoseButton,
                modal: this.modal,
                gameWin: this.gameWin,
                gameOver: this.gameOver,
                closeBtn: this.closeBtn,
                winButton: this.winButton,
                loseButton: this.loseButton,
                cancelButton: this.cancelButton,
                gameClearModal: this.gameClearModal,
                remainingTime: this.remainingTime,
                remainingDebt: this.remainingDebt,
                nextDebt: this.nextDebt
            };

            for (const [name, element] of Object.entries(elements)) {
                if (!element) {
                    missingElements.push(name);
                }
            }

            if (missingElements.length > 0) {
                console.error(`❌ 다음 요소들을 찾을 수 없습니다. HTML을 확인하세요: ${missingElements.join(", ")}`);
                return;
            }

            // 셧다운 게임승리, 게임 패배, 취소 버튼 리스너
            this.setupFirstEventListeners();
            // 게임승리나 게임패배에 나오는 타이틀 이동 버튼, 다시 시작하기 버튼 리스너
            this.setupSeceondEventListeners();
            // 셧다운 모달 화면 숨기기
            this.modal.style.display = "none";
            console.log("셧다운 생성 완료");
        });
    }
    static Instance() {
        if (!shutDown.instance) {
            shutDown.instance = new shutDown();
        }
        return shutDown.instance;
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
    getTrashcount(Trash) {
        this.TrashCount = Trash;
    }
    // 게임클리어, 오버에 있는 모달의 내용 상태를 업데이트하는 메서드
    getGameStats() {
        // 각 요소를 가져옵니다.

        // this.titleScreenButtons = document.querySelectorAll("#titleScreenButton");
        // this.restartButtons = document.querySelectorAll("#restartButton");

        const playTime = document.getElementById('survival-time');
        const creditsdebt = document.getElementById('credits-debt');
        const totalScore = document.getElementById('total-score');

        // remaining-time 요소에서 시간 값을 가져옵니다 (예: "9:47")
        const remainingTimeText = this.remainingTime.textContent.trim();

        // 플레이이 시간을 계산하고 표시
        playTime.textContent = this.calculateSurvivalTime(remainingTimeText);

        // 남은 빚을 표시
        creditsdebt.textContent = this.remainingDebt.textContent;


    }

    // 플레이(생존) 시간을 계산하는 메서드
    calculateSurvivalTime(remainingTimeText) {
        // 시간과 분을 분리하여 초로 변환합니다.
        const timeParts = remainingTimeText.split(":");
        const minutes = parseInt(timeParts[0], 10); // 분
        const seconds = parseInt(timeParts[1], 10); // 초

        // 남은 시간을 초로 변환
        const remainingTimeInSeconds = (minutes * 60) + seconds;

        // 600초에서 남은 시간을 빼서 생존 시간 계산
        const playTime = 600 - remainingTimeInSeconds;

        // 플레이 시간을 "분:초" 형식으로 변환
        const survivalMinutes = Math.floor(playTime / 60);
        const survivalSeconds = playTime % 60;

        // "분:초" 형식으로 반환
        return `${survivalMinutes}:${survivalSeconds < 10 ? '0' + survivalSeconds : survivalSeconds}`;
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

}
