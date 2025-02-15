import { GameObject } from "../StructureCode/GameSystem.js";

export class Drone extends GameObject {
    constructor() {
        super();  // 부모 클래스(GameObject)의 생성자 호출
        this.speed = 0.001;  // 드론의 이동 속도 (1초에 5픽셀 이동)
        this.capacity = 0;  // 드론의 적재 용량
        this.isMoving = false;  // 드론의 이동 상태
        this.targetX = 0;  // 목표 X 좌표
        this.targetY = 0;  // 목표 Y 좌표
        this.moveAnimation = null;  // 애니메이션 함수
        this.clickListenerAdded = false; // 이벤트 리스너 등록 여부
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

        // 드론의 클릭 이벤트
        if (!this.clickListenerAdded) { // 이벤트 리스너가 등록되지 않았을 때만
            console.log("클릭 이벤트가 등록되지 않았습니다 :" + this.clickListenerAdded);
            this.addClickListener();
            this.clickListenerAdded = true; // 이벤트 리스너 등록 상태로 변경
            console.log("클릭 이벤트 상태1 :" + this.clickListenerAdded);
        }

        console.log("클릭 이벤트 상태2 :" + this.clickListenerAdded);
        document.removeEventListener('click', this.addClickListener); // 이벤트 리스너 제거
        this.clickListenerAdded = false; // 이벤트 리스너 등록 상태 초기화
        console.log("클릭 이벤트 상태3 :" + this.clickListenerAdded);
    }

    // 클릭 이벤트 리스너
    addClickListener() {
        // 이벤트 리스너 추가 (click 이벤트)
        document.addEventListener('click', (event) => {
            const targetX = event.clientX;  // 클릭된 X 좌표
            const targetY = event.clientY;  // 클릭된 Y 좌표

            // 좌표 출력
            console.log(`Click Position: X = ${targetX}, Y = ${targetY}`);
            console.log("speed:" + this.speed)
            // 목표 좌표 설정
            this.targetX = targetX;
            this.targetY = targetY;

            // 드론의 이동 구현 (선택사항, 클릭된 좌표로 이동하도록 할 수 있음)
            this.startMoving();
            // 클릭된 방향으로 회전
            this.rotateToTarget();
        });
    }

    Update() {
        // 드론의 상태 업데이트
        if (this.isMoving) {
            // 애니메이션이 계속 반복되도록 처리 (부드럽게 이동)
            this.moveToTarget();
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

    // 클릭된 방향으로 드론 회전 
    rotateToTarget() {
        const deltaX = this.targetX - this.transform.position.x;
        const deltaY = this.targetY - this.transform.position.y;

        // 아크탄젠트로 각도 계산 (라디안 단위)
        const angle = Math.atan2(deltaY, deltaX);

        // 회전 각도를 라디안에서 도(degree)로 변환
        const angleInDegrees = angle * (180 / Math.PI);  // 180으로 수정

        // 회전 값 설정 (드론의 이미지 방향)
        this.transform.rotation = angleInDegrees;

        // 회전 로그
        console.log(`Drone rotation set to: ${this.transform.rotation}°`);
    }


    // 드론의 부드러운 이동 시작
    startMoving() {
        // 드론이 움직이지 않으면 이동을 시작
        if (!this.isMoving) {
            this.isMoving = true;

            // 이동 애니메이션을 시작
            this.moveAnimation = requestAnimationFrame(this.moveToTarget.bind(this));
        }
    }

    // 목표 지점으로 부드럽게 이동
    moveToTarget() {
        // 현재 위치와 목표 지점의 차이 계산
        const deltaX = this.targetX - this.transform.position.x;
        const deltaY = this.targetY - this.transform.position.y;

        // 목표 지점에 도달했으면 이동을 멈춤
        if (Math.abs(deltaX) < this.speed && Math.abs(deltaY) < this.speed) {
            this.transform.position.x = this.targetX;
            this.transform.position.y = this.targetY;
            this.isMoving = false;  // 이동 멈춤
            console.log("Drone reached the target.");
            return;
        }

        // 부드럽게 이동 (속도만큼 이동)
        this.transform.position.x += deltaX * 0.00001;  // X축으로 목표 지점에 다가감
        this.transform.position.y += deltaY * 0.00001;  // Y축으로 목표 지점에 다가감

        // console.log("this.transform.position.x: "+this.transform.position.x);
        // console.log("this.transform.position.y: "+this.transform.position.y);

        // 이동 애니메이션을 계속해서 호출 (프레임마다 계속 호출)
        this.moveAnimation = requestAnimationFrame(this.moveToTarget.bind(this));
    }

    // 드론의 이동 정지
    stopMoving() {
        this.isMoving = false;
        console.log("Drone stopped moving");
    }
}
