import { GameObject } from "../StructureCode/GameSystem.js";

export class testGameObject extends GameObject {

    Start(){
        console.log("testGameObject Start");
        this.resource.image.src = "../../Resources/TransparentImageTest.png";
        this.transform.position.x = 200;
        this.transform.position.y = 200;
        this.transform.scale.x = 0.4;
        this.transform.scale.y = 0.4;
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

