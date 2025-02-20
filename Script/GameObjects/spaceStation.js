// "GameObject" 클래스를 임포트합니다. 이 클래스는 기본적인 게임 오브젝트의 기능을 제공합니다.
import { DroneManager } from "../DronePannel/DroneManager.js";
import { GameObject } from "../StructureCode/GameSystem.js";
import { TrashFactory } from "../TrashFactory.js";

// SpaceStation 클래스는 플레이어가 조작하는 우주선과 관련된 상태정보를 갖습니다.
export class SpaceStation extends GameObject {
    constructor() {
        super();

        if (SpaceStation.instance) {
            return SpaceStation.instance;
        }

        this.Initialize();
        SpaceStation.instance = this;
    }

    /**
     * 싱클톤 인스턴스 반환 함수
     */
    static Instance() {
        if (!SpaceStation.instance) {
            SpaceStation.instance = new SpaceStation();
            SpaceStation.instance.Initialize();
        }
        return SpaceStation.instance;
    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() {
    }

    // 게임 오브젝트가 시작될 때 호출되는 메서드
    Start() {
        console.log("spaceStation Start");

        // 이미지 파일을 로드합니다. 여기서 'Resources/test.png'는 이미지 경로입니다.
        // this.resource.image.src = "Resources/TransparentImageTest.png";
        this.resource.image.src = "Resources/spaceStation.png";

        // 게임 오브젝트의 초기 위치를 설정
        this.transform.position.x = window.innerWidth - 300;  // 화면 좌측 X
        this.transform.position.y = window.innerHeight / 2; // 화면 중앙 Y

        // 게임 오브젝트의 크기를 설정합니다.
        // X와 Y 방향으로 각각 0.4배 크기로 설정합니다.
        this.transform.scale.x = 0.5;
        this.transform.scale.y = 0.5;

        // 앵커를 설정하여 오브젝트가 화면의 중심을 기준으로 회전할 수 있도록 합니다.
        this.transform.anchor.x = 0.5;
        this.transform.anchor.y = 0.5;

        // 게임 오브젝트의 초기 회전값을 0으로 설정합니다.
        this.transform.rotation = 0;

        // 물리 엔진에서의 속도 설정 (고정된 우주선이므로 속도는 0으로 설정)
        this.physics.velocity.x = 0;
        this.physics.velocity.y = 0;
    }

    // 게임 오브젝트가 매 프레임마다 업데이트될 때 호출되는 메서드
    Update() {
        // TrashFactory의 nearTrashList 정렬 업데이트
        TrashFactory.Instance().trashList = [...TrashFactory.Instance().trashList].sort(
            (a, b) => b.transform.position.x - a.transform.position.x
        );

        // 매 업데이트마다 게임 오브젝트의 회전값을 1도씩 증가시킵니다.
        // this.transform.rotation += 0;
        if (TrashFactory.Instance().trashList.length > 0) {
            DroneManager.Instance().getDrones().filter(drone => !drone.isWorking).forEach(drone => {
                const trash = TrashFactory.Instance().nearTrashList.shift();
                if (trash !== null && trash !== undefined) {
                    drone.StartWork(trash);
                    trash.target(drone);
                }
            });
        }
    }

    // 게임 오브젝트가 매 프레임의 마지막에 업데이트될 때 호출되는 메서드
    LateUpdate() {
        // console.log("spaceStation LateUpdate");
        // 이 메서드는 후속 업데이트에서 발생할 수 있는 부수적인 작업을 처리하는 데 사용됩니다.
        // 예를 들어, 충돌 체크나 화면 업데이트 등.
    }

    // 게임 오브젝트가 파괴될 때 호출되는 메서드
    OnDestroy() {
        console.log("spaceStation OnDestroy");
        // 오브젝트가 파괴되면 호출됩니다.
        // 예를 들어, 자원 해제 작업이나 관련 데이터 삭제 등이 가능합니다.
    }

    // 게임 오브젝트의 이미지가 로드될 때 호출되는 메서드
    OnLoad(image) {
        console.log("spaceStation OnLoad" + image.src);
        // 이미지가 로드되었을 때 호출되어 해당 이미지를 확인하거나 초기화 작업을 할 수 있습니다.
    }

    // static AddDrone() {
    //     let drone = new Drone();
    //     drone.transform.position.x= SpaceStation.Instance().transform.position.x;
    //     drone.transform.position.y = SpaceStation.Instance().transform.position.y;
    //     SpaceStation.Instance().droneList.push(drone);
    //     console.log(drone.transform.position);
    //     console.log(SpaceStation.Instance().transform.position);
    // }

    static RemoveTrash(trash) {
        const idx = TrashFactory.Instance().trashList.indexOf(trash);
        if (idx !== -1) {
            TrashFactory.Instance().trashList.splice(idx, 1);
            console.log("RemoveTrash");
        }
    }
}
