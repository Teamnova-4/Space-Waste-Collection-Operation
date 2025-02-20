import { Util } from "../Util.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export class GameEvent {
    constructor() {
        if (this.constructor === GameEvent) {
            throw new Error("Cannot instantiate abstract class");
        }

    }

    // 이벤트가 시작될 때 호출될 메서드 (예: 초기화)
    Start() { }

    // 매 프레임 업데이트되는 메서드
    Update() { }

    // 매 프레임 업데이트되는 메서드
    LateUpdate() { }

    OnDestroy() { }

    OnLoad(image) { }

    /**
     * error 발생시 호출되는 함수
     * error.title : 에러 제목
     * error.message : 에러 메시지
     * @param {*} error 
     */
    OnError(error) { }

    OnClick() {
        return false
    }
}

export class GameObject extends GameEvent {
    constructor() {
        super();

        this.layer = 0;
        this.transform = new Transform(this);
        this.resource = new GameResource(this);
        this.physics = new Physics(this);
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

    /**
     * 겹치는 부분이 있는지 확인
     * @param {*} point
     * @returns
     */
    isOverlapPoint(point) {
        const [p1, p2, p3, p4] = this.physics.corners;

        const d1 =
            (point.x - p2.x) * (p1.y - p2.y) - (point.y - p2.y) * (p1.x - p2.x);
        const d2 =
            (point.x - p3.x) * (p2.y - p3.y) - (point.y - p3.y) * (p2.x - p3.x);
        const d3 =
            (point.x - p4.x) * (p3.y - p4.y) - (point.y - p4.y) * (p3.x - p4.x);
        const d4 =
            (point.x - p1.x) * (p4.y - p1.y) - (point.y - p1.y) * (p4.x - p1.x);

        // Point is inside if all signs are the same (all positive or all negative)
        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0 || d4 < 0;
        const hasPos = d1 > 0 || d2 > 0 || d3 > 0 || d4 > 0;

        return !(hasNeg && hasPos);
    }

    InternalLogicUpdate() {
        this.physics.Update();
        this.transform.Update();
    }
}

/**
 * 오브젝트의 위치, 회전, 크기를 관리하는 클래스
 */
class Transform {
    constructor(gameObject) {
        Transform.rad2deg = 180 / Math.PI; // 라디안을 도(degree)로 변환
        Transform.deg2rad = Math.PI / 180; // 도(degree)를 라디안으로 변환

        this.gameObject = gameObject;
        this.anchor = { x: 0.5, y: 0.5 }; // 회전 고정점
        this.position = { x: 0, y: 0 }; // 위치
        this.rotation = 0; // 회전 각도 (도 단위)
        this.scale = { x: 1, y: 1 }; // 크기
    }

    Update() {
        this.calculateRotation();
    }

    calculateRotation() {
        if (this.rotation > 360) {
            this.rotation -= 360;
        } else if (this.rotation < 0) {
            this.rotation += 360;
        }
    }
    // 선형 보간 (Lerp) 함수
    lerp(start, end, t) {
        return start + (end - start) * t;
    }
    // Ease-in Ease-out 함수
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * 이동 회전 동시에 부드럽게 보간
     *
     * */
    moveWithRotationEase(targetPosition, speed, progress) {
        const startPosition = { x: this.position.x, y: this.position.y };
        const startRotation = this.rotation;

        // 목표 위치와 회전 각도 계산
        const dx = targetPosition.x - startPosition.x;
        const dy = targetPosition.y - startPosition.y;
        const targetRotation = Math.atan2(dy, dx);

        if (progress < 1.0) {
            // Ease-in, Ease-out으로 부드럽게 회전
            const t = progress;
            const easedT = this.easeInOut(t);
            this.rotation = this.lerp(startRotation, targetRotation, easedT);

            // 부드러운 이동
            const movementSpeed = speed * progress; // 이동 거리 계산
            this.position.x += movementSpeed * Math.cos(this.rotation);
            this.position.y += movementSpeed * Math.sin(this.rotation);
        } else {
            // 목표 위치에 정확히 도달
            this.position = targetPosition;
            this.rotation = targetRotation;
        }
    }

    /**
     *
     * x, y 좌표를 받아 해당 좌표를 바라보도록 회전 각도를 설정한다.
     *
     * @param {{x,y}} targetPosition {x, y} 좌표
     */
    LookAt(targetPosition) {
        // 타겟 위치와 현재 위치의 차이를 구한다.
        const dx = targetPosition.x - this.position.x;
        const dy = targetPosition.y - this.position.y;
        // Math.atan2(dy, dx) 는 라디안 단위로 값을 반환함으로 이를 도 단위로 변환하려면 Transform.rad2deg를 곱해준다.
        // Transform.rad2deg = 180 / Math.PI
        this.rotation = Math.atan2(dy, dx) * Transform.rad2deg;

    }

    Distance(targetPosition) {
        const dx = targetPosition.x - this.position.x;
        const dy = targetPosition.y - this.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * 오브젝트의 물리적 속성을 관리하는 클래스
 */
class Physics {
    constructor(gameObject) {
        this.gameObject = gameObject;
        // 오브젝트의 이동속도
        this.velocity = { x: 0, y: 0 };
        // 오브젝트의 가속도
        this.acceleration = { x: 0, y: 0 };
        // 오브젝트 충돌체
        this.collider = { offset: { x: 0, y: 0 }, size: { x: 1, y: 1 } };
        // [외부접근 하면 안됨] 충돌체의 네 모서리 좌표
        this.corners = [];
    }

    Update() {
        this.OnCalculatePhysics();
        this.updateCollider();
    }

    /**
     * 물리계산 함수
     * Update와 LateUpdate사이에서 호출됨
     */
    OnCalculatePhysics() {
        this.gameObject.transform.position.x +=
            this.velocity.x * GameLoop.deltaTime;
        this.gameObject.transform.position.y +=
            this.velocity.y * GameLoop.deltaTime;

        this.velocity.x += this.acceleration.x * GameLoop.deltaTime;
        this.velocity.y += this.acceleration.y * GameLoop.deltaTime;
    }

    // 오브젝트의 충돌체를 업데이트하는 메서드
    updateCollider() {

        // 리소스 크기가 정의되지 않았을 경우 에러 출력 - 현석

        const size = this.gameObject.resource.size;
        const pivot = this.gameObject.transform.position;
        const radians = (this.gameObject.transform.rotation * Math.PI) / 180; // 도를 라디안으로 변환

        const corners = [
            { x: this.collider.offset.x, y: this.collider.offset.y },
            {
                x: this.collider.offset.x + size.x * this.collider.size.x,
                y: this.collider.offset.y,
            },
            {
                x: this.collider.offset.x + size.x * this.collider.size.x,
                y: this.collider.offset.y + size.y * this.collider.size.y,
            },
            {
                x: this.collider.offset.x,
                y: this.collider.offset.y + size.y * this.collider.size.y,
            },
        ];

        //corners회전 계산
        this.corners = corners.map((corner) => {
            const dx = corner.x - size.x * this.gameObject.transform.anchor.x;
            const dy = corner.y - size.y * this.gameObject.transform.anchor.y;
            const rotatedX =
                pivot.x + dx * Math.cos(radians) - dy * Math.sin(radians);
            const rotatedY =
                pivot.y + dx * Math.sin(radians) + dy * Math.cos(radians);
            return { x: rotatedX, y: rotatedY };
        });
    }

    /**
     * transform 의 방향을 기반으로 속도를 정하는 메서드
     * @param {{x, y}} velocity {x, y} 로 이루언진 velocity
     */
    setVelocityInDirection(velocity) {
        const radians = this.gameObject.transform.rotation * Transform.deg2rad;
        this.velocity.x = Math.cos(radians) * velocity.x;
        this.velocity.y = Math.sin(radians) * velocity.y;
    }

    /**
     * transform의 방향을 기반으로 가속도를 정하는 메서드
     * @param {{x, y}} acceleration {x, y} 로 이루언진 acceleration
     */
    setAccelerationInDirection(acceleration) {
        const radians = this.gameObject.transform.rotation * Transform.deg2rad;
        this.acceleration.x = Math.cos(radians) * acceleration.x;
        this.acceleration.y = Math.sin(radians) * acceleration.y;
    }
}

/**
 * 오브젝트에 할당되는 이미지 리소스를 관리하는 클래스
 */
class GameResource {
    constructor(gameObject) {
        this.image = new Image();
        this.gameObject = gameObject;

        this.image.onload = () => {
            console.log(`[이미지 로드 완료] ${this.image.src}`);
            this.gameObject.OnLoad(this.image);
        };
        this.image.onerror = () => {
            console.trace(`[이미지 로드 실패] ${this.image.src}`);
            const error = Util.ErrorFormat("이미지 로드 실패", this.image.src, { image: this.image })
            this.gameObject.OnError(error);
        };
    }

    // 이미지를 캔버스에 그리는 메서드
    draw(ctx) {

        const radians = (this.gameObject.transform.rotation * Math.PI) / 180; // 도를 라디안으로 변환

        this.size = {
            x: this.gameObject.transform.scale.x * this.image.width * Background.SCALE,
            y: this.gameObject.transform.scale.y * this.image.height * Background.SCALE
        }

        const pivot = {
            x: this.gameObject.transform.position.x,
            y: this.gameObject.transform.position.y,
        }

        // 캔버스 상태 저장
        ctx.save();

        // 회전의 중심을 이미지의 중심으로 설정
        ctx.translate(pivot.x, pivot.y);
        ctx.rotate(radians);
        ctx.translate(
            -this.size.x * this.gameObject.transform.anchor.x,
            -this.size.y * this.gameObject.transform.anchor.y
        );

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            0, 0, this.size.x, this.size.y);

        // 캔버스 상태 복원
        ctx.restore();
    }
}

class Loop{
    constructor(interval, func, order){
        this.interval = interval;
        this.func = func;
        this.order = order;
        this.currentTime = 0;
    }

    checkInterval(deltaTime) {
        this.currentTime += deltaTime;
        if(this.currentTime >= this.interval){
            this.currentTime -= this.interval;
            return true;
        } 
        return false;
    }
}
export class GameLoop {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        if (GameLoop.instance) {
            return GameLoop.instance;
        }

        GameLoop.instance = this;
        GameLoop.instance.Initialize();
        GameLoop.instance.start();
    }

    /**
     * 싱클톤 인스턴스 반환 함수
     */
    static Instance() {
        if (!GameLoop.instance) {
            GameLoop.instance = new GameLoop(canvas, ctx);
        }
        return GameLoop.instance;
    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() { 
        this.isRunning = false; // 게임 루프가 실행 중인지 여부

        this.objects = [];
        this.destroyedObjects = [];
        this.newObjects = [];

        this.loops = {};
        this.loopIntervals = {};
        this.newLoops = [];

        GameLoop.playTime = 0;
        GameLoop.GameSpeed = 1;
    }

    static AddObject(object) {
        if (object instanceof GameObject) {
            GameLoop.instance.newObjects.push(object);
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

    /**
     * 
     * order는 양의 정수 (0 이상의값) 이여야함
     * 
     * @param {*} object 
     * @param {*} timeout 
     * @param {*} order 
     */
    static AddLoop(object, timeout, order = 0){
        if (object instanceof Function) {
            GameLoop.instance.newLoops.push(new Loop(timeout, object, order));
        } else {
            console.error("Object must be an instance of Function");
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastFrameTime = performance.now(); // 게임 시작 시간 설정
        this.gameStartTime = performance.now();
        console.log(`캔버스 크기: ${this.canvas.width}x${this.canvas.height}`); // 캔버스 크기 로그 추가

        // 이미지는 가로 길이 기준으로 스케일링
        // 가로 300px 세로 full
        Background.REAL_SIZE = {width: this.canvas.width, height: this.canvas.height};
        Background.FIXED_SIZE = {width: 1920, height: 1080};
        Background.PANEL_SIZE = {width: 300, height: -1};
        Background.FULL_SIZE = {
            width: Background.REAL_SIZE.width + Background.PANEL_SIZE.width,
            height: Background.REAL_SIZE.height
        };
        Background.SCALE = Background.FULL_SIZE.width / Background.FIXED_SIZE.width; 
        console.log(Background.SCALE);


        // 우클릭 방지 코드 추가
        addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // 드래그 방지 코드 추가
        addEventListener('selectstart', (event) => {
            event.preventDefault(); 
        });
        
        // 클릭 메서드드
        canvas.addEventListener("click", this.onClickCanvas);

        this.loop(); // 게임 루프 시작
    }

    stop() {
        this.isRunning = false;
    }

    loop() {
        if (!this.isRunning) return;

        this.backgroundRender(); // 화면 렌더링
        // 현재 시간 기록
        const currentTime = performance.now();
        GameLoop.deltaTime = (currentTime - this.lastFrameTime) * GameLoop.GameSpeed;
        GameLoop.playTime += GameLoop.deltaTime;

        // ============================Start====================== 

        this.newObjects.forEach((object) => {
            this.objects.push(object);
            object.Start();
        });
        this.newObjects.length = 0; // 배열 초기화

        this.newLoops.forEach((loop) =>{
            Util.autoAddToDictList(this.loops, loop.order, loop);
        });
        this.newLoops.length = 0; // 배열 초기화

        // ============================Update====================== 

        this.objects
        .sort((objA, objB)=> objA.layer - objB.layer)
        .forEach((object) => {
            object.Update();
            object.OnDraw(this.ctx);
            object.InternalLogicUpdate();

            object.LateUpdate();
        });

        Util.mergeDictToList(this.loops) 
        .filter((loop)=>loop.checkInterval(GameLoop.deltaTime)) 
        .forEach((loop)=>loop.func());

        // ============================Destroy====================== 

        this.destroyedObjects.forEach((object) => {
            let index = this.objects.indexOf(object); // image2의 인덱스를 찾음
            this.objects.splice(index, 1); // 해당 인덱스의 요소를 제거
            object.OnDestroy();
        });
        this.destroyedObjects.length = 0; // 배열 초기화

        //==========================================================


        this.lastFrameTime = currentTime; // 마지막 프레임 시간 업데이트
        // requestAnimationFrame을 사용해 다음 프레임을 요청
        requestAnimationFrame(() => this.loop());
    }

    backgroundRender() {
        // 게임 화면 렌더링 (예: 그리기 작업)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Background.Instance().animateBackground();
    }

    /**
     *
     * canvas 클릭이벤트 처리
     * @param {event} event
     */
    onClickCanvas(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // 클릭한 위치 확인
        GameLoop.instance.objects.some((object) => {
            if (object.isOverlapPoint({ x: mouseX, y: mouseY })) {
                return object.OnClick() === true;
            }
        });
    }
}
// 게임시스템 우주 배경 반영
export class Background {
    constructor() {
        if (Background.instance) {
            return Background.instance;
        }



        this.Initialize();
        Background.instance = this;
    }

    /**
     * 싱클톤 인스턴스 반환 함수
     */
    static Instance() {
        if (!Background.instance) {
            Background.instance = new Background();
        }
        return Background.instance;
    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() { 
        this.canvas = canvas;
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "Resources/BackGround.png";
        this.speed = 0.05;
        this.x = 0; // 배경의 초기 위치
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animateBackground();
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
    }

    animateBackground() {
        // GameSystem.backgroundRender();
        if (!this.isRunning) return;

        // // 배경 위치 업데이트 (왼쪽에서 오른쪽으로 이동)
        this.x += this.speed;
        if (this.x >= this.canvas.width) {
            this.x = 0; // 화면 끝에 도달하면 처음으로 되돌리기
        }

        // // 캔버스 클리어 후 새로운 배경 그리기
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.image, -this.x, 0,
            this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, this.canvas.width - this.x, 0,
            this.canvas.width, this.canvas.height);
    }
}