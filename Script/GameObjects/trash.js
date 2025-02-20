import { Background, GameObject } from "../StructureCode/GameSystem.js";
import { TrashFactory } from "../TrashFactory.js";
import { SpaceStation } from "./spaceStation.js";

// 기본 Trash 클래스
export class Trash extends GameObject {
    // 매개변수로 폭발 확률 추가(explosionChance) -현석
    constructor(speed,rotationSpeed, imageSrc, explosionChance = 0) {
        super();
        this.speed = speed || 1;
        this.imageSrc = imageSrc;
        // 폭발 확률 - 현석
        this.explosionChance = explosionChance;
        // 폭발 상태 여부 - 현석석
        this.isExploding = false;
        // 폭발 프레임 - 현석
        this.rotationSpeed = rotationSpeed;
        // 폭발 이미지 객체 생성 - 현석
        // this.explosionImage = new Image();
        // 폭발 스프라이트 이미지
        // this.explosionImage.src = "../../Resources/explosion.png";
    }

    Start() {
        // 이미지 로딩 상태 확인
        this.resource.image.onerror = () => {
            console.error("이미지 로드 실패:", this.imageSrc);
        };

        this.resource.image.src = this.imageSrc;
        // console.log("이미지 로딩 시작:", this.imageSrc);
        this.transform.position.x = -50;

        const padding = 100;
        const randomPoint = Math.random();
        this.pointY = randomPoint * (Background.CANVAS_SIZE.height -  padding * 2) + padding;

        this.transform.position.y = this.pointY;

        this.transform.scale.x = 1;
        this.transform.scale.y = 1;
        this.transform.anchor.x = 0.5;
        this.transform.anchor.y = 0.5;
        this.transform.rotation = 0;

        this.isTargeted = false;
        this.isCaught = false;
        this.targetedBy = null;
    }

    Update() {
    // 매 프레임마다 오른쪽으로 1px씩 이동
        if (!this.isCaught) {
            this.transform.position.y = this.pointY;
            this.transform.position.x += this.speed;
            this.transform.rotation += this.rotationSpeed; // 회전 값 업데이트
            if (this.transform.position.x > Background.CANVAS_SIZE.width + 100) {
                this.Destroy();
            } 
        }
    }

    LateUpdate() { }

    OnDestroy() {
        if (this.isTargeted) {
            this.targetedBy.StopWork();
        }
        SpaceStation.RemoveTrash(this);
    }

    OnLoad(image) {
        // 이미지 로딩 상태 확인
        //this.transform.scale.x = this.width / this.resource.image.width;
        //this.transform.scale.y = this.height / this.resource.image.height;
    }

    /**
     * drone으로 해당 쓰레기를 잡았을 때 호출되는 함수
     * @param {**Drone*} drone
     */
    // 드론이 쓰레기를 잡을때
    catch(drone) {
        this.caughtBy = drone;
        this.isCaught = true;
        this.transform.position = drone.transform.position;

        // 쓰레기를 잡을 때, 폭발 확률을 체크 - 현석
        this.checkExplosion(drone);
    }

    target(drone) {
        this.isTargeted = true;
        this.targetedBy = drone;
    }

    // 폭발 여부 체크 메서드-현석
    checkExplosion(drone) {
        const randomChance = Math.random(); // 0과 1 사이의 랜덤 값 생성
        if (randomChance < this.explosionChance) {
            console.log("this.explosionChance가 더 크므로 폭팔합니다.");
            // this.explode(drone);
        }
    }

    // 폭발 처리 -현석
    explode(drone) {
        console.log("폭발 발생!");
        this.Destroy(); // 쓰레기 파괴
        drone.Destroy(); // 드론 파괴
    }
}

// 고유 속성을 가진 쓰레기 클래스 (상속 받은 클래스들) - 현석

export class Wreck extends Trash {
    constructor() {
        const speed = TrashFactory.Instance().speed;
        const randomSpeed = Math.random() * speed; // 0.1과 0.4 사이의 랜덤 값 생성
        const randomRum = (Math.random() - 0.5) * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(randomSpeed, randomRum, "Resources/trash_1.png"); // 난파선 이미지 20%폭발
    }
    Start() {
        super.Start();
    }
}

export class cementStone extends Trash {
    constructor() {
        const speed = TrashFactory.Instance().speed;
        const randomSpeed = Math.random() * speed; // 0.1과 0.4 사이의 랜덤 값 생성
        const randomRum = (Math.random() - 0.5) * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(randomSpeed, randomRum, "Resources/trash_2.png"); // 시멘트 돌덩이 이미지 10%폭발

    }
    Start() {
        super.Start();
    }
}

export class WreckPart extends Trash {
    constructor() {
        const speed = TrashFactory.Instance().speed;
        const randomSpeed = Math.random() * speed; // 0.1과 0.4 사이의 랜덤 값 생성
        const randomRum = (Math.random() - 0.5) * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(randomSpeed, randomRum, "Resources/trash_3.png"); // 난파선 부품 이미지, 30%폭발
    }
    Start() {
        super.Start();
        this.transform.setScale(0.4);
    }
}

export class WreckCircle extends Trash {
    constructor() {
        const speed = TrashFactory.Instance().speed;
        const randomSpeed = Math.random() * speed; // 0.1과 0.4 사이의 랜덤 값 생성
        const randomRum = (Math.random() - 0.5) * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(randomSpeed, randomRum, "Resources/trash_4.png"); // 난파선 부품 동그라미 이미지, 25%
    }
    Start() {
        super.Start();
        this.transform.setScale(0.4);
    }
}
