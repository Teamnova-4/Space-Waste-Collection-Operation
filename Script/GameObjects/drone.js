import { GameLoop, GameObject } from "../StructureCode/GameSystem.js";
import { SpaceStation } from "./spaceStation.js";

export class Drone extends GameObject {
    constructor() {
        super();  // 부모 클래스(GameObject)의 생성자 호출
        this.speed = 0.33;  //드론의속도
        this.isWorking = false;  // 드론의 작동 상태
        this.isReturning = false;  // 드론의 귀환 상태
        this.targetPosition = {};  // 목표 좌표

        this.targetTrash = null;  // 목표 쓰레기
    }

    Start() {
        // 드론 초기화
        console.log("Drone Start");
        // 드론의 초기 상태 설정
        this.resource.image.src = "./Resources/drone.png";  // 드론 이미지 로드
        this.transform.position.x = 400;  // 초기 X 위치
        this.transform.position.y = 400;  // 초기 Y 위치

        this.transform.scale.x = 0.5;  // 크기 설정
        this.transform.scale.y = 0.5;  // 크기 설정
        this.transform.anchor.x = 0.5;  // 앵커 설정
        this.transform.anchor.y = 0.5;  // 앵커 설정
        this.transform.rotation = 0;  // 초기 회전 값

    }

    Update() {
        // 드론의 상태 업데이트
        if (this.isWorking) {
            this.transform.LookAt(this.targetPosition);
            this.physics.setVelocityInDirection({x: this.speed, y: this.speed});
            if (!this.isReturning && this.transform.Distance(this.targetPosition) < 5) {
                this.isReturning = true;
                this.targetPosition = SpaceStation.Instance().transform.position; 
                this.targetTrash.catch(this);
            } else if (this.isReturning && this.transform.Distance(this.targetPosition) < 5) {
                this.targetTrash.Destroy();
                addCredits(200);
                this.StopWork();
            }
        }
    }

    LateUpdate() {
        // 추가적인 업데이트가 필요하면 여기에 작성
    }

    OnDestroy() {
        // 드론이 파괴될 때 호출
        console.log("Drone OnDestroy");
    }

    OnLoad(image) {
        // 이미지 로딩 후 호출
        console.log("Drone OnLoad: " + image.src);
    }

    // 드론의 속도 업그레이드 메서드
    upgradeSpeed() {
        this.speed += 0.01;  // 속도 증가
        console.log(`Drone Speed Upgraded: ${this.speed}`);
    }

    // 드론의 적재 용량 업그레이드 메서드
    upgradeCapacity() {
        this.capacity += 1;  // 적재 용량 증가
        console.log(`Drone Capacity Upgraded: ${this.capacity}`);
    }


    /**
     * 
     * 드론의 작업 시작
     * @param {*Trash} trash 처리할 쓰레기 
     */
    StartWork(trash) {
        if (!this.isWorking) {
            this.isWorking = true;
            this.isReturning = false;
            this.targetTrash = trash;
            this.targetPosition = trash.transform.position; 
            console.log(this.targetPosition);
        }
    }

    /**
     * 드론의 작업 종료
     */
    StopWork() {
        if (this.isWorking) {
            this.isWorking = false;
            this.isReturning = false;
            this.targetTrash = null;
            this.targetPosition = null;
            this.physics.velocity = {x:0,y:0};
            this.physics.acceleration = {x:0,y:0};
        }
    }
}
