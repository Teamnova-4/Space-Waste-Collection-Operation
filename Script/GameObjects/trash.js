import { GameObject } from "../StructureCode/GameSystem.js";
import { SpaceStation } from "./spaceStation.js";

// 우주 쓰레기 오브젝트
// 화면 왼쪽 끝에서 생성되고 오른쪽 끝으로 이동한다음 사라진다.
export class Trash extends GameObject {
  constructor(speed) {
    super();

    // 우주쓰레기 이동속도
    this.speed = speed || 1;
  }

  Start() {
    this.resource.image.src = "../../Resources/trash_1.png";
    this.transform.position.x = 0;

    // 위 아래 패딩값 50 부여한 범위에서 랜덤한 y 좌표 생성
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
    this.targetedBy = null; 
  }

  Update() {
    // 매 프레임마다 오른쪽으로 1px씩 이동
    if (!this.isCaught){
      this.transform.position.x += this.speed;

      // TODO:: 100 변수 전환 필요
      if (this.transform.position.x > canvas.width + 100) {
        this.Destroy();
      }
    }
  }

  LateUpdate() {}

  OnDestroy() {
    if(this.isTargeted){
      this.targetedBy.StopWork();
    }
    SpaceStation.RemoveTrash(this);
  }

  OnLoad(image) {
    //console.log("Trash OnLoad" + image.src);
  }

  OnClick(){
    /**
    if(this.isTargeted == false){
      SpaceStation.Instance().targetTrashList.push(this);
      this.isTargeted = true;
    }
     */
  }
  /**
   * drone으로 해당 쓰레기를 잡았을 때 호출되는 함수
   * @param {**Drone*} drone 
   */
  catch(drone) {
    this.caughtBy = drone;
    this.isCaught = true;
    this.transform.position = drone.transform.position;
  }

  target(drone) {
    this.targetedBy = drone;
    this.isTargeted = true;
  }
}
