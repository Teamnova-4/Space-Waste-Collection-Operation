import { GameObject } from "../StructureCode/GameSystem.js";

export class testGameObject extends GameObject {

    Start(){
        console.log("testGameObject Start");
        this.resource.image.src = "../../Resources/TransparentImageTest.png";
        this.transform.position.x = 600;
        this.transform.position.y = 600;
        this.transform.scale.x = 0.4;
        this.transform.scale.y = 0.4;
        this.transform.anchor.x = 0.5;
        this.transform.anchor.y = 0.5;
        this.transform.rotation = 0;
    }

    Update(){
        console.log("testGameObject Update");
        this.transform.rotation += 1;
    }

    LateUpdate() {
        console.log("testGameObject LateUpdate");
    }

    OnDestroy() {
        console.log("testGameObject OnDestroy");

    }

    OnLoad(image) {
        console.log("testGameObject OnLoad" + image.src);
    }
}

