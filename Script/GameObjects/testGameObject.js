import { GameObject } from "../StructureCode/GameSystem.js";

export class testGameObject extends GameObject {

    Start(){
        console.log("testGameObject Start");
        this.resource.image.src = "Resources/TransparentImageTest.png";
        this.transform.position.x = 600;
        this.transform.position.y = 600;
        this.transform.scale.x = 0.4;
        this.transform.scale.y = 0.4;
        this.transform.anchor.x = 0.5;
        this.transform.anchor.y = 0.5;
        this.transform.rotation = 45

        this.physics.collider.size = {x: 1.5, y: 1.5}

    }

    Update(){
        this.transform.rotation += 1;
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
}

