import {
    cementStone,
    Wreck,
    WreckCircle,
    WreckPart,
} from "./GameObjects/trash.js";

// 우주 쓰레기 생성 클래스
export class TrashFactory {

    constructor() {
        if (TrashFactory.instance) {
            return TrashFactory.instance;
        }

        // 싱글톤 쓰레기 인스턴스 생성
        this.Initialize();
        TrashFactory.instance = this;
    }

    /**
     * 싱클톤 인스턴스 반환 함수 
     */
    static Instance() {
        if (!TrashFactory.instance) {
            TrashFactory.instance = new TrashFactory();
            TrashFactory.instance.Initialize();
        }
        return TrashFactory.instance;

    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() {
    
        this.speed = 0.5; // 쓰레기 기본 이동속도
        this.spawnRate = 0.5; // 초당 생성 개수
        this.isRunning = false; // 쓰레기 생성이 실행 중인지 여부
        this.trashInterval = null; // setInterval 참조를 저장할 변수
        this.explosionChance = 1; // 폭발 확률 주기 - 현석
        this.trashList = [];
        this.nearTrashList = []; // 가까운 쓰레기 리스트
    }

    // 우주 쓰레기 생성 시작
    startTrashSpawn() {
        if (this.isRunning) return; // 이미 실행 중이면 중복 실행 방지
        this.isRunning = true;
        this.trashInterval = setInterval(() => {
            //console.log("setInterval 실행 - 생성률:", this.spawnRate);

            // 랜덤으로 쓰레기 타입 생성
            const randomType = Math.floor(Math.random() * 4); // 4가지 쓰레기 중 랜덤 선택

            // 쓰레기 변수
            let newTrash;
            // 랜덤 속도 (0.1 ~ 0.4) 차감형식: (기본쓰레기속도 0.5 - (0.1 ~ 0.4))
            const randomSpeed = Math.random() * 0.4; // 0.1과 0.4 사이의 랜덤 값 생성
            // 쓰레기 타입에 따라 쓰레기 생성
            switch (randomType) {
                case 0:
                    newTrash = new Wreck(this.speed - randomSpeed); // 난파선 쓰레기기
                    break;
                case 1:
                    newTrash = new cementStone(this.speed - randomSpeed); // 씨멘트+벽돌 쓰레기
                    break;
                case 2:
                    newTrash = new WreckPart(this.speed - randomSpeed); // 난파선 부품 쓰레기
                    break;
                case 3:
                    newTrash = new WreckCircle(this.speed - randomSpeed); //난파선 부품 쓰레기(동그라미)
                    break;
            }
            TrashFactory.Instance().trashList.push(newTrash);

            // 쓰레기 생성 후 초기화
        }, 1000 / this.spawnRate);
    }

    // 우주 쓰레기 생성 중지
    stopTrashSpawn() {
        this.isRunning = false;
        clearInterval(this.trashInterval);
        this.trashInterval = null;
    }

    // 이동속도 설정console
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