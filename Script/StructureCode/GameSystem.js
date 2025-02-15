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

    OnClick(){

    }
}

export class GameObject extends GameEvent{

    constructor(){
        super();

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
     * 물리계산 함수
     * Update와 LateUpdate사이에서 호출됨
     */
    OnCalculatePhysics(){
        this.transform.position.x += this.physics.velocity.x * GameLoop.deltaTime;
        this.transform.position.y += this.physics.velocity.y * GameLoop.deltaTime;

        this.physics.velocity.x += this.physics.acceleration.x * GameLoop.deltaTime;
        this.physics.velocity.y += this.physics.acceleration.y * GameLoop.deltaTime;

        if (this.transform.rotation > 360) {
            this.transform.rotation -= 360;
        } else if (this.transform.rotation < 0) {
            this.transform.rotation += 360;
        }
        this.physics.updateCollider();
    }

    /**
     * 겹치는 부분이 있는지 확인 
     * @param {*} point 
     * @returns 
     */
    IsOverlapPoint(point){
        const [p1, p2, p3, p4] = this.physics.corners;

        const d1 = (point.x - p2.x) * (p1.y - p2.y) - (point.y - p2.y) * (p1.x - p2.x);
        const d2 = (point.x - p3.x) * (p2.y - p3.y) - (point.y - p3.y) * (p2.x - p3.x);
        const d3 = (point.x - p4.x) * (p3.y - p4.y) - (point.y - p4.y) * (p3.x - p4.x);
        const d4 = (point.x - p1.x) * (p4.y - p1.y) - (point.y - p1.y) * (p4.x - p1.x);

            // Point is inside if all signs are the same (all positive or all negative)
        const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0) || (d4 < 0);
        const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0) || (d4 > 0);

        return !(hasNeg && hasPos);
    }

    DistanceTo(target){
        let targetPos = {};
        if(target instanceof GameObject){
            targetPos = target.transform.position;
        }else if (target instanceof Transform){ 
            targetPos = target.position;
        } else {
            targetPos = target;
        } 
        return Math.sqrt(Math.pow(this.transform.position.x - targetPos.x, 2) + Math.pow(this.transform.position.y - targetPos.y, 2));
    }

}

/**
 * 오브젝트의 위치, 회전, 크기를 관리하는 클래스
 */
class Transform {
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.anchor = {x: 0.5, y: 0.5} // 회전 고정점
        this.position = { x: 0, y: 0 }; // 위치
        this.rotation = 0; // 회전 각도 (도 단위)
        this.scale = { x: 1, y: 1 }; // 크기
    }
}

/**
 * 오브젝트의 물리적 속성을 관리하는 클래스
 */
class Physics{
    constructor(gameObject) {
        this.gameObject = gameObject;
        // 오브젝트의 이동속도
        this.velocity = { x: 0, y: 0 };
        // 오브젝트의 가속도
        this.acceleration = { x: 0, y: 0 };

        // 오브젝트 충돌체
        this.collider = {offset: {x: 0, y: 0}, size: {x: 1, y: 1}};
        this.corners = []; // 충돌체의 네 모서리 좌표
    }

    // 오브젝트의 충돌체를 업데이트하는 메서드
    updateCollider() {

        const size =  this.gameObject.resource.size;
        const pivot = this.gameObject.transform.position;
        const radians = (this.gameObject.transform.rotation * Math.PI) / 180; // 도를 라디안으로 변환

        const corners = [
            {x: this.collider.offset.x, y: this.collider.offset.y},
            {x: this.collider.offset.x + size.x * this.collider.size.x, y: this.collider.offset.y},
            {x: this.collider.offset.x + size.x * this.collider.size.x, y: this.collider.offset.y + size.y * this.collider.size.y} ,
            {x: this.collider.offset.x, y: this.collider.offset.y + size.y * this.collider.size.y},
        ] 

        //corners회전 계산
        this.corners = corners.map(corner => { 
            const dx = corner.x - (size.x * this.gameObject.transform.anchor.x);
            const dy = corner.y - (size.y * this.gameObject.transform.anchor.y);
            const rotatedX = pivot.x + dx * Math.cos(radians) - dy * Math.sin(radians);
            const rotatedY = pivot.y + dx * Math.sin(radians) + dy * Math.cos(radians);
            return {x: rotatedX, y: rotatedY};
        });

    }
}

/**
 * 오브젝트에 할당되는 이미지 리소스를 관리하는 클래스
 */
class GameResource {
    constructor(gameObject) {
        this.image = new Image();
        this.image.src = "";
        this.gameObject = gameObject;

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
    
        this.size = { 
            x: this.gameObject.transform.scale.x * this.image.width,
            y: this.gameObject.transform.scale.y * this.image.height 
        }

        const pivot = {
            x: this.gameObject.transform.position.x,
            y: this.gameObject.transform.position.y,
        }

        // 캔버스 상태 저장
        ctx.save();

        // 회전의 중심을 이미지의 중심으로 설정
        ctx.translate( pivot.x, pivot.y);
        ctx.rotate(radians);
        ctx.translate(
            -this.size.x * this.gameObject.transform.anchor.x,
            -this.size.y * this.gameObject.transform.anchor.y
        );
    
        ctx.drawImage(this.image, 
            0, 0, this.image.width, this.image.height, 
            0, 0, this.size.x, this.size.y); 

        /*
        this.corners = corners.map(corner => { 
            const rotatedX = pivot.x + (corner.x - pivot.x) * Math.cos(radians) - (corner.y - pivot.y) * Math.sin(radians); 
            const rotatedY = pivot.y + (corner.x - pivot.x) * Math.sin(radians) + (corner.y - pivot.y) * Math.cos(radians); 
            return {x: rotatedX, y: rotatedY};
        });
        */

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
        this.newObjects = [];

        GameLoop.instance = this;
        GameLoop.instance.start();

        canvas.addEventListener('click', this.onClickCanvas);

    }

    static AddObject(object) {
        if (object instanceof GameObject){
            GameLoop.instance.newObjects.push(object);
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

        this.newObjects.forEach(object => {
            this.objects.push(object);
            object.Start();
        });
        this.newObjects.length = 0; // 배열 초기화

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

    /**
     * 
     * canvas 클릭이벤트 처리
     * @param {event} event 
     */
    onClickCanvas(event){
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // 클릭한 위치 확인
        GameLoop.instance.objects.forEach(object => {
            if(object.IsOverlapPoint({x: mouseX, y: mouseY})){
                object.OnClick();
            }
        });

    }
}