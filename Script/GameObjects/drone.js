import { GameObject } from "../StructureCode/GameSystem.js";

export class Drone extends GameObject {
    constructor() {
        super();  // 부모 클래스(GameObject)의 생성자 호출
        this.speed = 0;  // 드론의 속도
        this.capacity = 0;  // 드론의 적재 용량
        this.isMoving = false;  // 드론의 이동 상태
    }

    Start() {
        // 드론 초기화
        console.log("Drone Start");

        // 드론의 초기 상태 설정
        this.resource.image.src = "Resources/drone.png"; // 드론 이미지 로드

        this.transform.position.x = 100;  // 초기 X 위치
        this.transform.position.y = 100;  // 초기 Y 위치
        this.transform.scale.x = 10;  // 크기 설정
        this.transform.scale.y = 10;  // 크기 설정
        this.transform.anchor.x = 0.5;  // 앵커 설정
        this.transform.anchor.y = 0.5;  // 앵커 설정
        this.transform.rotation = 0;  // 초기 회전 값
    }

    Update() {
        // 드론의 상태 업데이트
        if (this.isMoving) {
            // 속도에 따라 이동
            this.transform.position.x += this.speed;
            this.transform.position.y += this.speed;

            // 이동 로그
            // console.log(`Drone Position: (${this.transform.position.x}, ${this.transform.position.y})`);
        }
    }

    LateUpdate() {
        // 추가적인 업데이트가 필요하면 여기에 작성
        // console.log("Drone LateUpdate");
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
        this.speed += 0.1;  // 속도 증가
        console.log(`Drone Speed Upgraded: ${this.speed}`);
    }

    // 드론의 적재 용량 업그레이드 메서드
    upgradeCapacity() {
        this.capacity += 1;  // 적재 용량 증가
        console.log(`Drone Capacity Upgraded: ${this.capacity}`);
    }

    // 드론의 이동 시작
    startMoving() {
        this.isMoving = true;
        console.log("Drone started moving");
    }

    // 드론의 이동 정지
    stopMoving() {
        this.isMoving = false;
        console.log("Drone stopped moving");
    }
}
