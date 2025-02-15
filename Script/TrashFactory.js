import { trash } from "./GameObjects/trash.js";

// 우주 쓰레기 생성 클래스
export class TrashFactory {

    constructor(){
        this.speed = 1; // 쓰레기 이동속도
        this.spawnRate = 1; // 초당 생성 개수   
        this.isRunning = false; // 쓰레기 생성이 실행 중인지 여부 
    }

   
    // 우주 쓰레기 생성
     createTrash() {
        if (this.isRunning) return;

        // 이동속도와 초당 생성 개수 반영
        setInterval(() => {
            const newTrash = new trash(this.speed);
        }, 1000 / this.spawnRate * 1000);
        this.isRunning = true;
    }

    // 이동속도 설정
     setSpeed(speed) {
        this.speed = speed;
    }

    // 초당 생성 개수 설정
     setSpawnRate(number = 1) {
        this.spawnRate = number;
    }
}