import { GameObject } from "../StructureCode/GameSystem.js";
import { SpaceStation } from "./spaceStation.js";

// 기본 Trash 클래스
export class Trash extends GameObject {

  // 매개변수로 폭발 확률 추가(explosionChance) -현석
  constructor(speed, imageSrc, explosionChance) {

    super();

    this.speed = speed || 1;
    // 이미지 경로
    this.imageSrc = imageSrc;
    // 폭발 확률 - 현석
    this.explosionChance = explosionChance;
    // 폭발 상태 여부 - 현석석
    this.isExploding = false;
    // 폭발 프레임 - 현석
    this.explosionFrame = 0;
    // 폭발 이미지 객체 생성 - 현석석
    this.explosionImage = new Image();
    // 폭발 스프라이트 이미지
    this.explosionImage.src = "../../Resources/explosion.png";
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

  // 드론이 쓰레기를 잡을때
  catch(drone) {

    this.caughtBy = drone;
    this.isCaught = true;
    this.transform.position = drone.transform.position;

    // 쓰레기를 잡을 때, 폭발 확률을 체크 - 현석
    this.checkExplosion(drone);
  }

  // 폭발 여부 체크 메서드-현석
  checkExplosion(drone) {
    const randomChance = Math.random();  // 0과 1 사이의 랜덤 값 생성
    console.log("randomChance: " + randomChance);
    if (randomChance < this.explosionChance) {
      console.log("this.explosionChance가 더 크므로 폭팔합니다.");
      this.explode(drone);
    }
  }

  // 폭발 처리 -현석
  explode(drone) {
    console.log("폭발 발생!");
    this.Destroy();  // 쓰레기 파괴
    drone.Destroy();  // 드론 파괴
  }

}

// 고유 속성을 가진 쓰레기 클래스 (상속 받은 클래스들) - 현석

export class Wreck extends Trash {
  constructor(speed) {
    super(speed, "../../Resources/trash_1.png", 0.2); // 난파선 이미지 20%폭발
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
    super(speed, "../../Resources/trash_2.png", 0.1); // 시멘트 돌덩이 이미지 10%폭발
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
    super(speed, "../../Resources/trash_3.png", 0.3); // 난파선 부품 이미지, 30%폭발
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
    super(speed, "../../Resources/trash_4.png", 0.25); // 난파선 부품 동그라미 이미지, 25%
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
