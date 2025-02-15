import { GameEvent, GameLoop  } from "./GameLoop.js";

export class GameObject extends GameEvent{

    constructor(){
        super();

        this.transform = new Transform();
        this.resource = new GameResource(this);
        GameLoop.AddObject(this);
    }

    Destroy() {
        GameLoop.AddDestroyObject(this);
    }

    static Destroy(gameObject) {
        if (gameObject instanceof GameObject) {
            gameObject.Destroy();
        }
    }

    OnDraw(ctx) {
        this.resource.draw(ctx);
    }
}

class Transform {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.rotation = 0; // 회전 각도 (도 단위)
        this.scale = { x: 1, y: 1 };
    }
}

class GameResource {
    constructor(gameObject) {
        this.image = new Image();
        this.image.src = "";
        this.gameObject = gameObject;

        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            console.log(`[이미지 로드 완료] ${this.image.src}`);
            this.gameObject.OnLoad(this.image);
        };
        this.image.onerror = () => {
            if (this.image.src !== "") {
                console.error(`[이미지 로드 실패] ${this.image.src}`);
            }
        };
    }

    // 이미지를 캔버스에 그리는 메서드
    draw(ctx) {
        const radians = (this.gameObject.transform.rotation * Math.PI) / 180; // 도를 라디안으로 변환
    
        let center =  { x: this.gameObject.transform.position.x , y: this.gameObject.transform.position.y }
        // 캔버스 상태 저장
        ctx.save();
    
        // 회전의 중심을 이미지의 중심으로 설정
        ctx.translate(center.x, center.y);
        ctx.rotate(radians);
    
        // 이미지 그리기
        //ctx.drawImage(this.image, center.x, center.y, this.image.width * this.gameObject.transform.scale.x, this.image.height * this.gameObject.transform.scale.y);

        ctx.drawImage(this.image, 
            0, 0, this.image.width, this.image.height,
            center.x - this.gameObject.transform.scale.x / 2.0 * this.image.width,
            center.y - this.gameObject.transform.scale.y / 2.0 * this.image.height,
            this.gameObject.transform.scale.x * this.image.width,
            this.gameObject.transform.scale.y * this.image.height);

        // 캔버스 상태 복원
        ctx.restore();
    }
}