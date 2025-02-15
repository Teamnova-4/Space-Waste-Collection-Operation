import { GameEvent, GameLoop  } from "./GameLoop.js";
export class GameObject extends GameEvent{


    constructor(){

        this.transform = new Transform();
        this.resource = new GameResource();
    }

    Destroy() {
        GameLoop.AddDestroyObject(this);
    }

    static Destroy(gameObject) {
        if (gameObject instanceof GameObject) {
            gameObject.Destroy();
        }
    }

    onDraw(ctx) {
    }
    onLoad(image){

    }
}

class Transform {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.rotation = 0; // 회전 각도 (도 단위)
        this.size = { x: 0, y: 0 };
    }
}

class GameResource {
    constructor(imageSrc, gameObject) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.gameObject = gameObject;

        this.width = 0;
        this.height = 0;

        this.image.onload = () => {
            this.gameObject.onLoad(this.image);
        };
    }

    // 이미지 로드 완료 후 호출되는 메서드
    onLoad(callback) {
        this.image.onload = () => {
          callback();
        }; 
    }
    
    // 이미지를 캔버스에 그리는 메서드
    draw(ctx) {
        const radians = (this.gameObject.transform.rotation * Math.PI) / 180; // 도를 라디안으로 변환
    
        // 캔버스 상태 저장
        ctx.save();
    
        // 회전의 중심을 이미지의 중심으로 설정
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(radians);
        //ctx.translate(-this.width / 2, -this.height / 2);
    
        // 이미지 그리기
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
    
        // 캔버스 상태 복원
        ctx.restore();
    }
}