const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

export class GameEvent{
    constructor() {
        if (this.constructor === GameEvent) {
            throw new Error("Cannot instantiate abstract class");
        }

        this.deltaTime = 0;
    }

    // 이벤트가 시작될 때 호출될 메서드 (예: 초기화)
    Start() {
    }

    // 매 프레임 업데이트되는 메서드
    Update() {
    }

    // 매 프레임 업데이트되는 메서드
    LateUpdate() {
    }

    OnDestroy() {
    }

    OnLoad(image){

    }
}

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
        this.anchor = {x: 0.5, y: 0.5}
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
    
        const size = { 
            x: this.gameObject.transform.scale.x * this.image.width,
            y:this.gameObject.transform.scale.y * this.image.height 
        }

        // 캔버스 상태 저장
        ctx.save();

        // 회전의 중심을 이미지의 중심으로 설정
        ctx.translate(this.gameObject.transform.position.x + size.x * (this.gameObject.transform.anchor.x - 1) , this.gameObject.transform.position.y + size.y * (this.gameObject.transform.anchor.y - 1));
        ctx.rotate(radians);
        ctx.translate(-this.gameObject.transform.position.x, -this.gameObject.transform.position.y);
    
        ctx.drawImage(this.image, 
            0, 0, this.image.width, this.image.height,
            this.gameObject.transform.position.x - size.x * this.gameObject.transform.anchor.x,
            this.gameObject.transform.position.y - size.y * this.gameObject.transform.anchor.y,
            size.x, size.y);

    

        // 캔버스 상태 복원
        ctx.restore();
    }
}

export class GameLoop {
    constructor(canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx;

        if(GameLoop.instance){
            return GameLoop.instance;
        }

        this.isRunning = false;  // 게임 루프가 실행 중인지 여부
        this.objects = [];
        this.destroyedObjects = [];

        GameLoop.instance = this;
        GameLoop.instance.start();
    }

    static AddObject(object) {
        if (object instanceof GameObject){
            console.log(object)
            console.log(GameLoop.instance)
            GameLoop.instance.objects.push(object);

            object.Start();
        } else {
            console.error("Object must be an instance of GameEvent");
        }
    }

    static AddDestroyObject(object){
        if (object instanceof GameObject && GameLoop.instance.objects.includes(object)){
            GameLoop.instance.destroyedObjects.push(object);
        } else {
            console.error("Object must be an instance of GameEvent");
        }   
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastFrameTime = performance.now(); // 게임 시작 시간 설정
        this.loop(); // 게임 루프 시작
    }

    stop() {
        this.isRunning = false;
    }

    loop() {
        if (!this.isRunning) return;

        this.backgroundRender();  // 화면 렌더링
        // 현재 시간 기록
        const currentTime = performance.now();
        GameLoop.deltaTime = currentTime - this.lastFrameTime;

        this.objects.forEach(object => {
            object.Update();
            object.OnDraw(this.ctx);
            object.LateUpdate();
        }); 

        this.destroyedObjects.forEach(object => {
            let index = this.objects.indexOf(object); // image2의 인덱스를 찾음
            this.objects.splice(index, 1); // 해당 인덱스의 요소를 제거
            object.OnDestroy();
        })
        this.destroyedObjects.length = 0; // 배열 초기화

        // requestAnimationFrame을 사용해 다음 프레임을 요청
        requestAnimationFrame(() => this.loop());
    }

    backgroundRender() { 
        // 게임 화면 렌더링 (예: 그리기 작업)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}