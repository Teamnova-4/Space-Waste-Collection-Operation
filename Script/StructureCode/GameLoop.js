import { GameObject } from "./GameObject.js";

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

// 캔버스 및 WebGL 컨텍스트 가져오기
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")


// 게임 루프 인스턴스 생성
const gameLoop = new GameLoop(canvas, ctx);