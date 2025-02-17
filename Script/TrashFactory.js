import { Wreck, cementStone, WreckPart, WreckCircle } from "./GameObjects/trash.js";


// 우주 쓰레기 생성 클래스
export class TrashFactory {
    constructor() {
        if (TrashFactory.instance) {
            return TrashFactory.instance;
        }

        
        this.Initialize();
        TrashFactory.instance = this;
    }

    /**
     * 싱클톤 인스턴스 반환 함수 
     */
    static Instance(){
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
        this.speed = 0.5; // 쓰레기 이동속도
        this.spawnRate = 0.5; // 초당 생성 개수
        this.isRunning = false; // 쓰레기 생성이 실행 중인지 여부
        this.trashInterval = null; // setInterval 참조를 저장할 변수

        this.trashList = [];
    }

    // 우주 쓰레기 생성 시작
    startTrashSpawn() {
        if (this.isRunning) return; // 이미 실행 중이면 중복 실행 방지
        this.isRunning = true;
        this.trashInterval = setInterval(() => {
            //console.log("setInterval 실행 - 생성률:", this.spawnRate);

            // 랜덤으로 쓰레기 타입 생성 
            const randomType = Math.floor(Math.random() * 4); // 4가지 쓰레기 중 랜덤 선택

            // 쓰레기 변수수
            let newTrash;

            switch (randomType) {
                case 0:
                    newTrash = new Wreck(this.speed); // 난파선 쓰레기
                    break;
                case 1:
                    newTrash = new cementStone(this.speed); // 씨멘트+벽돌 쓰레기
                    break;
                case 2:
                    newTrash = new WreckPart(this.speed); // 난파선 부품 쓰레기
                    break;
                case 3:
                    newTrash = new WreckCircle(this.speed); //난파선 부품 쓰레기(동그라미)
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