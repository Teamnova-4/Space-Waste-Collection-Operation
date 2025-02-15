import { GameObject } from "../StructureCode/GameSystem.js";

// 우주 쓰레기 오브젝트
// 화면 왼쪽 끝에서 생성되고 오른쪽 끝으로 이동한다음 사라진다.
export class trash extends GameObject {

    Start() {
        console.log("우주 쓰레기 초기화");
        this.resource.image.src = "../../Resources/trash_1.png";
        this.transform.position.x = 0;
        this.transform.position.y = 500; // TODO: 화면 맨 위에서 아래까지 랜덤한 y좌표에서 생성 되도록 개선하기
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

