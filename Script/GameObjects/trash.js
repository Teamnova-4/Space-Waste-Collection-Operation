import { GameObject } from "../StructureCode/GameSystem.js";

// 우주 쓰레기 오브젝트
// 화면 왼쪽 끝에서 생성되고 오른쪽 끝으로 이동한다음 사라진다.
export class trash extends GameObject {

    constructor(speed) {
        super();

        // 우주쓰레기 이동속도
        this.speed = speed || 1;
    }

    Start() {
        console.log("우주 쓰레기 초기화");
        this.resource.image.src = "../../Resources/trash_1.png";
        this.transform.position.x = 0;

        // 위 아래 패딩값 50 부여한 범위에서 랜덤한 y 좌표 생성
        const padding = 50;
        const min = padding;
        const max = window.innerHeight - padding;
        this.pointY = Math.random() * (max - min) + min;
        this.transform.position.y = pointY;
        this.transform.scale.x = 1;
        this.transform.scale.y = 1;
        this.transform.anchor.x = 1;
        this.transform.anchor.y = 1;
        this.transform.rotation = 0;
    }

    Update() {
        console.log(this.transform.position.x, this.transform.position.y);

        // 매 프레임마다 오른쪽으로 1px씩 이동
        this.transform.position.x += 1;

        // 화면 오른쪽 끝에 도달하면 오브젝트 삭제
        console.log(canvas.width);
        if (this.transform.position.x > canvas.width) {
            this.Destroy();
        }
    }

    LateUpdate() {
    }

    OnDestroy() {
        console.log("testGameObject OnDestroy");

    }

    OnLoad(image) {
        console.log("testGameObject OnLoad" + image.src);
    }
}

