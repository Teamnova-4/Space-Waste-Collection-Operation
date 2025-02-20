import { GameObject } from "../StructureCode/GameSystem.js";
import { User } from "../Upgrade.js";
import { SpaceStation } from "./spaceStation.js";

export class Drone extends GameObject {
    static lastId = 0; // 마지막으로 부여된 id, 새 드론은 마지막 id + 1 이 부여된다.

    constructor(template = null) {
        super();

        this.id = ++Drone.lastId; // 드론의 id (식별 용)
        this.name = `드론 ${this.id}호`; // 드론 이름
        this.layer = 5;

        if (template) {
            this.type = template.typeId;
            this.price = template.price;
            this.speed = template.speed;
            this.capacity = template.capacity;
            this.imageSrc = template.imageSrc;
        } else {
            this.type = "basic";
            this.price = null;
            this.speed = 0.33;
            this.capacity = 1;
            this.imageSrc = "Resources/drone.png";
        }
        this.isWorking = false;
        this.isReturning = false;
        this.targetPosition = {};
        this.targetTrash = null;
        this.catchDistance = 25;
    }

    Start() {
        // 드론 초기화
        console.log("Drone Start");
        console.log(this.type);
        // TODO: this.type 값에 따라 각기 다른 값 넣어야함

        // 드론의 초기 상태 설정

        this.resource.image.src = this.imageSrc; // 드론 이미지 로드

        // 드론 생성위치는 기지위치와 동일
        this.transform.position.x = SpaceStation.Instance().transform.position.x;
        this.transform.position.y = SpaceStation.Instance().transform.position.y;

        this.transform.scale.x = 2; // 크기 설정
        this.transform.scale.y = 2; // 크기 설정
        this.transform.anchor.x = 0.5; // 앵커 설정
        this.transform.anchor.y = 0.5; // 앵커 설정
        this.transform.rotation = 270; // 초기 회전 값
    }

    Update() {
        // 드론의 상태 업데이트
        if (this.isWorking) {
            this.transform.LookAt(this.targetPosition);
            this.physics.setVelocityInDirection({ x: this.speed, y: this.speed });
            const distance = this.transform.Distance(this.targetPosition);

            // 이동방향 계산후 올바른 각도로 드론이미지가 출력되도록 재설정 
            this.transform.rotation = this.transform.rotation + 90;

            if (!this.isReturning && distance < this.catchDistance) {
                this.targetTrash.catch(this);
                this.Returning();
            } else if (this.isReturning && distance < this.catchDistance) {
                this.DestructionTrash();
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
        this.speed += 0.01; // 속도 증가
        console.log(`Drone Speed Upgraded: ${this.speed}`);
    }

    // 드론의 적재 용량 업그레이드 메서드
    upgradeCapacity() {
        this.capacity += 1; // 적재 용량 증가
        console.log(`Drone Capacity Upgraded: ${this.capacity}`);
    }
    /**
     * 
     * 드론의 작업 시작
     * @param {*Trash} trash 처리할 쓰레기 
     */
    StartWork(trash) {
        this.isWorking = true;
        this.isReturning = false;
        this.targetTrash = trash;
        this.targetPosition = trash.transform.position;
    }

    /**
     * 
     * 드론의 되돌아가기
     * 
     */
    Returning() {
        if (this.isWorking) {
            this.isReturning = true;
            this.targetPosition = SpaceStation.Instance().transform.position;
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
            this.physics.velocity = { x: 0, y: 0 };
            this.physics.acceleration = { x: 0, y: 0 };
        }
    }


    DestructionTrash() {
        this.targetTrash.Destroy();
        User.AddCredits(200); // 크레딧 증가

        // 코인 아이콘에 반짝이는 효과 추가
        const coinIcon = document.querySelector(".coin-icon");
        if (coinIcon) {
            coinIcon.classList.add("animate-coin");
            setTimeout(() => {
                coinIcon.classList.remove("animate-coin");
            }, 1000); // 1초 후에 애니메이션 클래스 제거
        }
    }
}
