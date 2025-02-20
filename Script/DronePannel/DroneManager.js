import { Drone } from "../GameObjects/drone.js";
import { User } from "../Upgrade.js";
import { DroneShop } from "./DroneShop.js";
import { DroneSlot } from "./DroneSlot.js";
import { DroneSlotView } from "./DroneSlotView.js";

/**
 * 드론 관리 시스템의 핵심 컨트롤러 클래스
 * 드론의 구매, 판매, 슬롯 확장 등 모든 드론 관련 기능을 총괄 관리
 */
export class DroneManager {
    /**
     * DroneManager 초기화
     * - 기본 슬롯 1개 생성
     * - 드론 상점 초기화
     * - UI 뷰 초기화
     * - 이벤트 리스너 설정
     * - 기본 드론 1개 추가
     */
    constructor() {
        // 싱글톤 패턴 구현: DroneManager 인스턴스가 이미 존재하면 기존 인스턴스 반환
        if (DroneManager.instance) {
            return DroneManager.instance;
        }

        this.Initialize(); // 초기화 메서드 호출
        DroneManager.instance = this; // 생성된 인스턴스를 클래스 변수에 저장
    }

    /**
     * 싱글톤 인스턴스 반환 함수
     */
    static Instance() {
        // 인스턴스가 없으면 새로 생성 후 반환, 있으면 기존 인스턴스 반환
        if (!DroneManager.instance) {
            DroneManager.instance = new DroneManager();
            // DroneManager.instance.Initialize(); // 생성자에서 이미 호출하므로 중복 호출 제거
        }
        return DroneManager.instance;
    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() {
        // 드론을 보관할 수 있는 슬롯 배열 (기본 1개)
        this.slots = [new DroneSlot(0)];
        // 최대 보유 가능한 슬롯 개수
        this.maxSlots = 5;
        // 슬롯 1개 확장 시 필요한 비용
        this.slotUpgradePrice = 1000;
        // 드론 상점 인스턴스 생성
        this.shop = new DroneShop();
        this.renderDroneShop(); // 드론 상점 초기 렌더링

        // 드론 슬롯 UI 관리 인스턴스 생성
        this.view = new DroneSlotView(
            document.querySelector(".drone-slot-container")
        );

        // 현재 선택된 슬롯의 인덱스 (드론 구매 시 사용) -> 이제 사용하지 않음 (자동으로 빈 슬롯에 할당)
        // this.selectedSlotIndex = null;
        // 유저 정보 (크레딧 등) 관리 인스턴스
        this.user = User.Instance();

        this.initializeEventListeners(); // 이벤트 리스너 설정
        this.addDefaultDrone(); // 기본 드론 추가
    }

    /**
      * 필요한 모든 이벤트 리스너 등록
      * - 슬롯 확장 버튼
      * - 드론 구매 버튼 (상점 렌더링 시 동적으로 처리)
      * - 상단 메뉴 탭 버튼
      */
    initializeEventListeners() {
        // 슬롯 추가 버튼 클릭 이벤트
        const addSlotBtn = document.getElementById("add-slot-btn"); // "add-slot-btn"이라는 id를 가진 HTML 요소를 찾습니다. (슬롯 추가 버튼)
        if (addSlotBtn) { // addSlotBtn 요소가 실제로 존재하는지 확인합니다. (null이 아닌지)
            addSlotBtn.addEventListener("click", () => this.upgradeSlot()); // 버튼 클릭 시 upgradeSlot() 메서드 실행
        }

        // 상단 메뉴탭 버튼 클릭 이벤트 (이전 코드와 동일)
        const tabButtons = document.querySelectorAll('.tab-btn'); // ".tab-btn" 클래스를 가진 모든 HTML 요소를 가져옵니다. (탭 버튼들)
        const tabContent = document.querySelectorAll('.tab-content'); // ".tab-content" 클래스를 가진 모든 HTML 요소를 가져옵니다. (탭 내용들)

        // 각 탭 버튼에 대한 클릭 이벤트 리스너를 등록합니다.
        tabButtons.forEach(button => { // tabButtons 배열의 각 요소(button)에 대해 반복
            button.addEventListener('click', () => { // 각 버튼에 클릭 이벤트 리스너 추가

                // 1. 다른 탭 버튼 비활성화: 현재 클릭된 버튼을 제외한 다른 모든 탭 버튼에서 "active" 클래스를 제거합니다.
                tabButtons.forEach(otherButton => { // 다른 모든 탭 버튼을 순회
                    if (otherButton !== button) { // 현재 클릭된 버튼이 아닌 경우
                        otherButton.classList.remove('active'); // "active" 클래스 제거 (비활성화)
                    }
                });

                // 2. 현재 탭 버튼 활성화: 현재 클릭된 버튼에 "active" 클래스가 없으면 추가합니다. (있으면 아무것도 안 함)
                let isActive = button.classList.contains('active'); // 현재 버튼에 "active" 클래스가 있는지 확인
                if (!isActive) button.classList.add('active');  // "active" 클래스가 없으면 추가 (활성화)


                // 3. 탭 내용 표시/숨김: 모든 탭 내용을 순회하면서 현재 탭에 해당하는 내용만 표시하고 나머지는 숨깁니다.
                tabContent.forEach(content => { // 모든 탭 내용을 순회
                    // 현재 탭 내용의 id가 클릭된 버튼의 data-tab 속성 값과 같으면 "active" 클래스 추가 (표시)
                    if (content.id === button.dataset.tab) {
                        content.classList.add('active');
                    } else { // 아니면 "active" 클래스 제거 (숨김)
                        content.classList.remove('active');
                    }
                });

                // 4. 드론 상점 렌더링: 만약 클릭된 탭이 "드론 상점" 탭이면 드론 상점을 (다시) 렌더링합니다.
                if (button.dataset.tab === 'drone-shop') { // 클릭된 버튼의 data-tab 속성 값이 "drone-shop"인지 확인
                    this.renderDroneShop(); // 드론 상점 렌더링 메서드 호출
                }
            });
        });
    }


    /**
    * 드론 상점을 렌더링합니다.
    */
    renderDroneShop() {
        const shopContainer = document.querySelector('.shop-container'); // '.shop-container' 클래스를 가진 요소를 찾습니다.
        if (shopContainer) { // shopContainer가 null이 아닌지 (존재하는지) 확인합니다.
            this.shop.renderShopItems((typeId) => {
                // typeId는 'basic', 'advanced' 가 주어짐

                this.purchaseDrone(typeId); // 드론 구매처리
            });
        }
    }

    /**
     * 게임 시작 시 기본 드론 1개 제공
     */
    addDefaultDrone() {
        const defaultTemplate = this.shop.getDroneTemplate("basic"); // "basic" 드론 템플릿 가져오기
        const defaultDrone = new Drone(defaultTemplate);  // 드론 객체 생성
        this.slots[0].setDrone(defaultDrone);  // 첫 번째 슬롯에 드론 배치
        this.updateView(); // UI 업데이트
    }

    /**
     * 현재 보유중인 드론 목록 반환
     * @returns {Drone[]} 현재 보유중인 드론 리스트
     */
    getDrones() {
        // filter와 map을 사용하여 드론이 있는 슬롯만 골라내고, 드론 객체만 배열로 반환
        return this.slots
            .filter((slot) => slot.isOccupied) // 드론이 있는 슬롯만 필터링
            .map((slot) => slot.drone); // 각 슬롯의 드론 객체 반환
    }

    /**
     * 드론 슬롯 확장
     */
    upgradeSlot() {
        // 최대 슬롯 개수 제한 확인
        if (this.slots.length >= this.maxSlots) {
            console.log("최대 슬롯 개수에 도달했습니다.");
            return;
        }

        if(User.UseCredit(this.slotUpgradePrice)){
            this.slots.push(new DroneSlot(this.slots.length));
            // 다음 슬롯 확장 시 50% 가격 인상
            this.slotUpgradePrice = Math.floor(this.slotUpgradePrice * 1.5);
            this.updateView();
        }
    }

    /**
     * 드론 구매 처리 (자동으로 빈 슬롯에 할당)
     * @param {string} typeId 구매할 드론의 타입 ID
     */
    purchaseDrone(typeId) {
        // 드론 템플릿 가져오기
        const droneTemplate = this.shop.getDroneTemplate(typeId);

        // 크레딧 부족 검사
        if (this.user.credits < droneTemplate.price) {
            console.log("크레딧이 부족합니다.");
            return;
        }

        // 비어 있는 슬롯 찾기 (첫 번째 빈 슬롯)
        const emptySlot = this.slots.find(slot => !slot.isOccupied);

        if (!emptySlot) { // 빈 슬롯이 없으면
            console.log("드론 슬롯이 가득 찼습니다.");
            return;
        }

        // 드론 생성 및 슬롯에 배치
        const newDrone = new Drone(droneTemplate);
        emptySlot.setDrone(newDrone);

        // 크레딧 차감
        this.user.credits -= droneTemplate.price;
        this.updateView(); // UI 업데이트
    }

    /**
     * UI 업데이트
     */
    updateView() {
        // 슬롯 클릭, 판매 클릭 핸들러를 전달하여 슬롯 UI 렌더링
        this.view.renderSlots(
            this.slots,
            (index) => this.handleSlotClick(index), // (이제는 사용되지 않지만, 기존 코드 호환성을 위해 유지)
            (index) => this.handleSellClick(index) // 판매 버튼 클릭 핸들러
        );
    }

    /**
     * 드론 슬롯 클릭 핸들러 (현재는 사용되지 않지만, 나중에 기능을 추가할 수 있으므로 남겨둠)
     * @param {number} index 클릭된 슬롯의 인덱스
     */
    handleSlotClick(index) {
        //  this.selectedSlotIndex = index; // 더 이상 사용되지 않음
        console.log(`${index}번 슬롯이 클릭되었습니다.`); // (디버깅 용도)
    }

    /**
     * 드론 판매 버튼 클릭 핸들러
     * @param {number} index 판매할 드론이 있는 슬롯 인덱스
     */
    handleSellClick(index) {
        const slot = this.slots[index]; // 해당 슬롯 가져오기
        if (slot && slot.isOccupied) { // 슬롯이 존재하고, 드론이 있으면
            const drone = slot.removeDrone(); // 드론 제거 (슬롯에서 제거하고 드론 객체 반환)
            const refund = Math.floor(drone.price * 0.5); // 환불 금액 계산
            User.AddCredits(refund); // 사용자 크레딧에 환불 금액 추가

            // 드론 이동 로직 (판매 후 빈 슬롯 채우기):
            this.shiftDrones();
            this.updateView(); // UI 업데이트
        }
    }

    /**
     * 드론을 앞쪽 슬롯으로 이동시키는 함수
     */
    shiftDrones() {
        let emptySlotIndex = null; // 빈 슬롯의 인덱스를 추적

        // 슬롯 배열을 순회하며 빈 슬롯과 드론이 있는 슬롯을 찾음
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i].isOccupied && emptySlotIndex === null) {
                // 빈 슬롯을 찾으면 인덱스 저장
                emptySlotIndex = i;
            } else if (this.slots[i].isOccupied && emptySlotIndex !== null) {
                // 빈 슬롯이 있고, 현재 슬롯에 드론이 있으면 드론을 이동
                this.slots[emptySlotIndex].setDrone(this.slots[i].removeDrone());
                // 이동 후, 현재 슬롯은 비어있게 되므로 emptySlotIndex를 현재 인덱스로 업데이트
                emptySlotIndex = i;
            }
        }
    }
}