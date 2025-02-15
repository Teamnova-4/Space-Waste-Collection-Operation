import { trash } from "./GameObjects/trash.js";

// 우주 쓰레기 생성 클래스
export class TrashFactory {
    constructor() {
        console.log("TrashFactory 생성");
        this.speed = 0.5; // 쓰레기 이동속도
        this.spawnRate = 0.5; // 초당 생성 개수
        this.isRunning = false; // 쓰레기 생성이 실행 중인지 여부
        this.trashInterval = null; // setInterval 참조를 저장할 변수
    }

    // 우주 쓰레기 생성 시작
    startTrashSpawn() {
        if (this.isRunning) return; // 이미 실행 중이면 중복 실행 방지
        this.isRunning = true;
        this.trashInterval = setInterval(() => {
            console.log("setInterval 실행 - 생성률:", this.spawnRate);
            const newTrash = new trash(this.speed);
        }, 1000 / this.spawnRate);
    }

    // 우주 쓰레기 생성 중지
    stopTrashSpawn() {
        this.isRunning = false;
        clearInterval(this.trashInterval);
        this.trashInterval = null;
    }

    // 이동속도 설정
    setSpeed(speed) {
        this.speed = speed;
        console.log("쓰레기 속도 변경:", this.speed);
    }

    // 초당 생성 개수 설정
    setSpawnRate(number = 1) {
        if (number < 0.1) return;
        this.spawnRate = number;
        console.log("생성률 변경:", this.spawnRate);

        if (this.isRunning) {
            // 생성률 변경 시 setInterval 재설정 (isRunning 상태일 때만)
            this.stopTrashSpawn(); // 기존 setInterval 중지
            this.startTrashSpawn(); // 새로운 setInterval 시작
        }
    }
}