import { GameObject } from "../StructureCode/GameObject.js";

class testGameObject extends GameObject {

    Start(){
        console.log("testGameObject Start");
        this.resource.image.src = "../../Resources/TransparentImageTest.png";
        this.transform.position.x = 30;
        this.transform.position.y = 40;
        this.transform.scale.x = 0.1;
        this.transform.scale.y = 0.1;
    }

    Update(){
        console.log("testGameObject Update");
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

let test = new testGameObject();
