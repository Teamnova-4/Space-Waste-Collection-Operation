import { GameObject } from "../StructureCode/GameSystem.js";

export class testGameObject extends GameObject {

    Start(){
        console.log("testGameObject Start");
        this.resource.image.src = "Resources/arrowTest.png";
        this.transform.position.x = 600;
        this.transform.position.y = 600;
        this.transform.scale.x = 0.4;
        this.transform.scale.y = 0.4;
        this.transform.anchor.x = 0.5;
        this.transform.anchor.y = 0.5;
        this.transform.rotation = 45

        this.physics.collider.size = {x: 1.5, y: 1.5}

        this.progress = 0.0;

        this.targetPos = {x: 0, y: 0}
        canvas.addEventListener("click", (evenet) => {
            this.moveTo({x: evenet.offsetX, y: evenet.offsetY});
        });
    }

    Update(){
        if (this.transform.Distance(this.targetPos) < 10) {
            this.physics.velocity = {x: 0, y: 0};
        }
    }

    LateUpdate() {
    }

    OnDestroy() {

    }
    OnLoad(image) {
        console.log("testGameObject OnLoad" + image.src);
    }
    OnClick(){
        console.log("testGameObject OnClick");
    }

    moveTo(targetPos) {
        this.targetPos = targetPos;
        this.transform.LookAt(this.targetPos);
        this.physics.setVelocityInDirection({x: 0.33, y: 0.33});
    }
}

