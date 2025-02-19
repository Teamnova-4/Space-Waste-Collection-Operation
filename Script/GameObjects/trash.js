import { GameObject } from "../StructureCode/GameSystem.js";
import { SpaceStation } from "../GameObjects/SpaceStation.js";
import { Util } from "../Util.js";

// 기본 Trash 클래스
export class Trash extends GameObject {
    // 매개변수로 폭발 확률 추가(explosionChance) -현석
    constructor(speed, imageSrc, explosionChance, rotationSpeed) {
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

    // 이미지 로드 후 처리를 위한 함수
    handleImageLoad() {
        // console.log("이미지 로드 성공:", this.imageSrc);
        // console.log("이미지 크기:", {
        //     width: this.resource.image.width,
        //     height: this.resource.image.height,
        //     scale: {
        //         x: this.transform.scale.x,
        //         y: this.transform.scale.y
        //     },
        //     position: {
        //         x: this.transform.position.x,
        //         y: this.transform.position.y
        //     }
        // });
        // 이미지가 로드된 후에 scale 계산
    }

    Start() {
        // 이미지 로딩 상태 확인
        this.resource.image.onload = () => this.handleImageLoad();

        this.resource.image.onerror = () => {
            console.error("이미지 로드 실패:", this.imageSrc);
        };

        this.resource.image.src = this.imageSrc;
        // console.log("이미지 로딩 시작:", this.imageSrc);
        this.transform.position.x = 0;

        const padding = 50;
        const min = padding;
        const max = window.innerHeight - padding;
        this.pointY = Math.random() * (max - min) + min;
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
            if (!this.isCaught) {
                this.transform.position.x += this.speed;
                this.transform.rotation += this.rotationSpeed; // 회전 값 업데이트
                if (this.transform.position.x > canvas.width + 100) {
                    this.Destroy();
                }
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
        this.transform.scale.x = this.width / this.resource.image.width;
        this.transform.scale.y = this.height / this.resource.image.height;
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
    constructor(speed) {
        const randomRum = Math.random() * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(speed, "Resources/trash_1.png", 0, randomRum); // 난파선 이미지 20%폭발
        // 사진의 크기 정하기
        this.width = 100;
        this.height = 100;
    }
    Start() {
        super.Start();
    }
}

export class cementStone extends Trash {
    constructor(speed) {
        const randomRum = Math.random() * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(speed, "Resources/trash_2.png", 0, randomRum); // 시멘트 돌덩이 이미지 10%폭발
        // 사진의 크기 정하기
        this.width = 150;
        this.height = 150;

        console.log("cementStone speed: " + speed + "cementStone 회전: " + randomRum);
    }
    Start() {
        super.Start();
    }
}

export class WreckPart extends Trash {
    constructor(speed) {
        const randomRum = Math.random() * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(speed, "Resources/trash_3.png", 0, randomRum); // 난파선 부품 이미지, 30%폭발
        // 사진의 크기 정하기
        this.width = 150;
        this.height = 150;
        console.log("WreckPart speed: " + speed + "WreckPart 회전: " + randomRum);
    }
    Start() {
        super.Start();
    }
}

export class WreckCircle extends Trash {
    constructor(speed) {
        const randomRum = Math.random() * 0.1; // 0과 0.5 사이의 랜덤 회전 값 생성
        super(speed, "Resources/trash_4.png", 0, randomRum); // 난파선 부품 동그라미 이미지, 25%
        // 사진의 크기 정하기
        this.width = 150;
        this.height = 150;
        console.log("WreckCircle speed: " + speed + "WreckCircle 회전: " + randomRum);
    }
    Start() {
        super.Start();
    }
}
