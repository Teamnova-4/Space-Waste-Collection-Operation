const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

export class GameEvent {
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

    OnLoad(image) {

    }
}

export class GameObject extends GameEvent {

    constructor() {
        super();

        this.transform = new Transform();
        this.resource = new GameResource(this);
        this.physics = new Physics();
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

    /**
     * 그리기 함수
     * Update와 LateUpdate사이에서 호출됨
    */
    OnDraw(ctx) {
        this.resource.draw(ctx);
    }
}

class Transform {
    constructor() {
        this.anchor = { x: 0.5, y: 0.5 } // 앵커 포인트: 회전, 크기 조절의 기준점, (0, 0)은 왼쪽 상단, (1, 1)은 오른쪽 하단, (0.5, 0.5)는 중앙
        this.position = { x: 0, y: 0 }; // 게임 오브젝트의 2D 위치 좌표 (x, y)
        this.rotation = 0; // 게임 오브젝트의 회전 각도 (도 단위, 시계 방향)
        this.scale = { x: 1, y: 1 };  // 게임 오브젝트의 크기 비율 (x축 스케일, y축 스케일, 1은 원래 크기)
    }
    /**
     * 물리계산 함수
     * Update와 LateUpdate사이에서 호출됨
     */
    OnCalculatePhysics() {
        this.transform.position.x += this.physics.velocity.x * GameLoop.deltaTime;
        this.transform.position.y += this.physics.velocity.y * GameLoop.deltaTime;

        this.physics.velocity.x += this.physics.acceleration.x * GameLoop.deltaTime;
        this.physics.velocity.y += this.physics.acceleration.y * GameLoop.deltaTime;
        console.log(this.physics.velocity);
    }
}

/**
 * 오브젝트의 위치, 회전, 크기를 관리하는 클래스
 */
class Transform {
    constructor() {
        this.anchor = { x: 0.5, y: 0.5 } // 회전 고정점
        this.position = { x: 0, y: 0 }; // 위치
        this.rotation = 0; // 회전 각도 (도 단위)
        this.scale = { x: 1, y: 1 }; // 크기
    }
}

/**
 * 오브젝트의 물리적 속성을 관리하는 클래스
 */
class Physics {
    constructor() {
        // 오브젝트의 이동속도
        this.velocity = { x: 0, y: 0 };
        // 오브젝트의 가속도
        this.acceleration = { x: 0, y: 0 };
    }
}

/**
 * 오브젝트에 할당되는 이미지 리소스를 관리하는 클래스
 */
class GameResource {
    constructor(gameObject) {
        this.image = new Image(); // Image 객체 생성, 이미지 로딩 및 렌더링에 사용
        this.image.src = ""; // 이미지 소스 경로 초기화 (기본적으로 이미지 없음)
        this.gameObject = gameObject; // 이 GameResource를 소유하는 GameObject 인스턴스 참조

        this.width = 0; // 이미지 너비
        this.height = 0; // 이미지 높이

        this.image.onload = () => {  // 이미지 로딩 성공 시 이벤트 핸들러
            console.log(`[이미지 로드 완료] ${this.image.src}`);
            this.gameObject.OnLoad(this.image);
        };
        this.image.onerror = () => {  // 이미지 로딩 실패 시 이벤트 핸들러
            if (this.image.src !== "") { // 이미지 src가 비어있지 않을 때만 (src가 설정되었는데 로딩 실패한 경우)
                console.error(`[이미지 로드 실패] ${this.image.src}`);
            }
        };
    }

    // 이미지를 캔버스에 그리는 메서드
    draw(ctx) {
        const radians = (this.gameObject.transform.rotation * Math.PI) / 180; // 게임 오브젝트의 회전 각도(도)를 라디안으로 변환

        // 스케일이 적용된 이미지의 최종 너비와 높이
        const size = {
            x: this.gameObject.transform.scale.x * this.image.width,
            y: this.gameObject.transform.scale.y * this.image.height
        }

        // 캔버스 상태 저장 (현재 변환, 스타일 등을 저장해둠)
        ctx.save();

        // 캔버스 변환: 회전의 중심을 앵커 포인트 기준으로 설정
        // translate()는 캔버스 좌표계를 이동시키는 함수
        // 이동량 계산: 객체 위치 + (크기 * (앵커 x,y - 1)). 앵커가 (0.5, 0.5)일 때 이동량은 -size/2 가 됨 (중앙 기준 회전)
        ctx.translate(this.gameObject.transform.position.x + size.x * (this.gameObject.transform.anchor.x - 1), this.gameObject.transform.position.y + size.y * (this.gameObject.transform.anchor.y - 1));
        ctx.rotate(radians);  // 캔버스 회전 (라디안 단위)
        ctx.translate(-this.gameObject.transform.position.x, -this.gameObject.transform.position.y);


        console.log(
            "GameSystem.js GameResource.draw() : 이미지 그리기에 사용된 값",
            size.x, size.y,
            this.gameObject.transform.position.x - size.x * this.gameObject.transform.anchor.x,
            this.gameObject.transform.position.y - size.y * this.gameObject.transform.anchor.y,
            size.x * this.gameObject.transform.anchor.x,
            size.y * this.gameObject.transform.anchor.y);

        // 이미지 그리기
        ctx.drawImage(this.image,  // 그릴 이미지 객체
            0, 0, this.image.width, this.image.height,  // 원본 이미지의 시작 x, y 좌표, 너비, 높이 (전체 이미지 사용)
            this.gameObject.transform.position.x - size.x * this.gameObject.transform.anchor.x,  // 캔버스에 그릴 x 좌표 (앵커 포인트를 고려하여 위치 조정)
            this.gameObject.transform.position.y - size.y * this.gameObject.transform.anchor.y,  // 캔버스에 그릴 y 좌표 (앵커 포인트를 고려하여 위치 조정)
            size.x, size.y);  // 캔버스에 그릴 너비, 높이 (스케일이 적용된 크기)


        // 캔버스 상태 복원 (save()로 저장했던 상태로 되돌림, 회전, 이동 등의 변환이 캔버스에 더이상 영향을 주지 않도록 함)
        ctx.restore();
    }
}

export class GameLoop {
    constructor(canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx;

        if (GameLoop.instance) {
            return GameLoop.instance;
        }

        this.isRunning = false;  // 게임 루프가 실행 중인지 여부
        this.objects = [];
        this.destroyedObjects = [];

        GameLoop.instance = this;
        GameLoop.instance.start();

        canvas.addEventListener('click', this.onClickCanvas);

    }

    static AddObject(object) {
        if (object instanceof GameObject) {
            console.log(object)
            console.log(GameLoop.instance)
            GameLoop.instance.objects.push(object);

            object.Start();
        } else {
            console.error("Object must be an instance of GameEvent");
        }
    }

    static AddDestroyObject(object) {
        if (object instanceof GameObject && GameLoop.instance.objects.includes(object)) {
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
            object.OnCalculatePhysics();
            object.LateUpdate();
        });

        this.destroyedObjects.forEach(object => {
            let index = this.objects.indexOf(object); // image2의 인덱스를 찾음
            this.objects.splice(index, 1); // 해당 인덱스의 요소를 제거
            object.OnDestroy();
        })
        this.destroyedObjects.length = 0; // 배열 초기화

        this.lastFrameTime = currentTime; // 마지막 프레임 시간 업데이트
        // requestAnimationFrame을 사용해 다음 프레임을 요청
        requestAnimationFrame(() => this.loop());
    }

    backgroundRender() {
        // 게임 화면 렌더링 (예: 그리기 작업)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    onClickCanvas(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        console.log(`Mouse clicked at (${mouseX}, ${mouseY})`);

    }
}