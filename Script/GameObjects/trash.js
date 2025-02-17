import { GameObject } from "../StructureCode/GameSystem.js";
import { SpaceStation } from "./spaceStation.js";

// 기본 Trash 클래스
export class Trash extends GameObject {
  constructor(speed, imageSrc) {
    super();

    this.speed = speed || 1;
    this.imageSrc = imageSrc || "../../Resources/trash_1.png"; // 기본 이미지
  }

  Start() {
    console.log("우주 쓰레기 초기화");
    this.resource.image.src = this.imageSrc;
    this.transform.position.x = 0;

    const padding = 50;
    const min = padding;
    const max = window.innerHeight - padding;
    this.pointY = Math.random() * (max - min) + min;
    this.transform.position.y = this.pointY;

    this.transform.scale.x = 1;
    this.transform.scale.y = 1;
    this.transform.anchor.x = 0.5;
    this.transform.anchor.y = 0.5;
    this.transform.rotation = 0;

    this.isTargeted = false;
    this.isCaught = false;
    this.caughtBy = null;
  }

  Update() {
    if (!this.isCaught) {
      this.transform.position.x += this.speed;

      if (this.transform.position.x > canvas.width + 100) {
        this.Destroy();
      }
    }
  }

  LateUpdate() { }

  OnDestroy() { }

  OnLoad(image) {
    console.log("Trash OnLoad" + image.src);
  }

  OnClick() {
    if (this.isTargeted == false) {
      SpaceStation.Instance().targetTrashList.push(this);
      this.isTargeted = true;
    }
  }

  catch(drone) {
    this.caughtBy = drone;
    this.isCaught = true;
    this.transform.position = drone.transform.position;
  }
}

// 고유 속성을 가진 쓰레기 클래스 (상속 받은 클래스들)

export class Wreck extends Trash {
  constructor(speed) {
    super(speed, "../../Resources/trash_1.png"); // 난파선 이미지
      // 사진의 크기 정하기
    this.width = 100;
    this.height = 100;
  }
  Start() {
    // 시작 상속받아서 
    super.Start();
    // 사진의 새로운 크기를 입력합니다.
    this.transform.scale.x = this.width / this.resource.image.width;
    this.transform.scale.y = this.height / this.resource.image.height;
  }
}

export class cementStone extends Trash {
  constructor(speed) {
    super(speed, "../../Resources/trash_2.png"); // 시멘트 돌덩이 이미지
      // 사진의 크기 정하기
    this.width = 150;
    this.height = 150;
  }
  Start() {
    // 시작 상속받아서 
    super.Start();
    // 사진의 새로운 크기를 입력합니다.
    this.transform.scale.x = this.width / this.resource.image.width;
    this.transform.scale.y = this.height / this.resource.image.height;
  }
}

export class WreckPart extends Trash {
  constructor(speed) {
    super(speed, "../../Resources/trash_3.png"); // 난파선 부품 이미지
      // 사진의 크기 정하기
    this.width = 150;
    this.height = 150;
  }
  Start() {
    // 시작 상속받아서 
    super.Start();
    // 사진의 새로운 크기를 입력합니다.
    this.transform.scale.x = this.width / this.resource.image.width;
    this.transform.scale.y = this.height / this.resource.image.height;
  }
}
export class WreckCircle extends Trash {
  constructor(speed) {
    super(speed, "../../Resources/trash_3.png"); // 난파선 부품 동그라미 이미지
    // 사진의 크기 정하기
    this.width = 150;
    this.height = 150;
  }
  Start() {
    // 시작 상속받아서 
    super.Start();
    // 사진의 새로운 크기를 입력합니다.
    this.transform.scale.x = this.width / this.resource.image.width;
    this.transform.scale.y = this.height / this.resource.image.height;
  }
}
