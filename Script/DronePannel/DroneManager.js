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
    if (DroneManager.instance) {
      return DroneManager.instance;
    }

    this.Initialize();
    DroneManager.instance = this;
  }

  /**
   * 싱클톤 인스턴스 반환 함수
   */
  static Instance() {
    if (!DroneManager.instance) {
      DroneManager.instance = new DroneManager();
      DroneManager.instance.Initialize();
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
    this.maxSlots = 3;
    // 슬롯 1개 확장 시 필요한 비용
    this.slotUpgradePrice = 1000;
    // 드론 상점 인스턴스 생성
    this.shop = new DroneShop();
    // 드론 슬롯 UI 관리 인스턴스 생성
    this.view = new DroneSlotView(
      document.querySelector(".drone-slot-container")
    );
    // 현재 선택된 슬롯의 인덱스 (드론 구매 시 사용)
    this.selectedSlotIndex = null;
    // 유저 정보 (크레딧 등) 관리 인스턴스
    this.user = User.Instance();

    this.initializeEventListeners();
    this.addDefaultDrone();
  }


  /**
   * 필요한 모든 이벤트 리스너 등록
   * - 슬롯 확장 버튼
   * - 드론 구매 버튼
   */
  initializeEventListeners() {
    // 슬롯 추가 버튼 클릭 이벤트
    const addSlotBtn = document.getElementById("add-slot-btn");
    if (addSlotBtn) {
      addSlotBtn.addEventListener("click", () => this.upgradeSlot());
    }

    // 드론 구매 버튼들에 대한 이벤트
    document.querySelectorAll(".buy-drone-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (this.selectedSlotIndex !== null) {
          this.purchaseDrone(btn.dataset.type, this.selectedSlotIndex);
        }
      });
    });
  }

  /**
   * 게임 시작 시 기본 드론 1개 제공
   */
  addDefaultDrone() {
    const defaultTemplate = this.shop.getDroneTemplate("basic");
    const defaultDrone = new Drone(defaultTemplate);
    this.slots[0].setDrone(defaultDrone);
    this.updateView();
  }

  /**
   * 현재 보유중인 드론 목록 반환
   * @returns {Drone[]} 현재 보유중인 드론 리스트
   */
  getDrones() {
    return this.slots
      .filter((slot) => slot.isOccupied)
      .map((slot) => slot.drone);
  }

  /**
   * 드론 슬롯 확장 처리
   * - 최대 슬롯 개수 체크
   * - 크레딧 체크
   * - 슬롯 추가 및 가격 인상
   */
  upgradeSlot() {
    if (this.slots.length >= this.maxSlots) {
      // this.showModal("최대 슬롯 개수에 도달했습니다.");
      console.log("최대 슬롯 개수에 도달했습니다.");
      return;
    }

    if (this.user.credits < this.slotUpgradePrice) {
      // this.showModal("크레딧이 부족합니다.");
      console.log("크레딧이 부족합니다.");
      return;
    }

    this.user.credits -= this.slotUpgradePrice;
    this.slots.push(new DroneSlot(this.slots.length));
    // 다음 슬롯 확장 시 50% 가격 인상
    this.slotUpgradePrice = Math.floor(this.slotUpgradePrice * 1.5);
    this.updateView();
  }

  /**
   * 드론 구매 처리
   * @param {string} typeId - 구매할 드론의 타입 ID
   * @param {number} slotIndex - 드론을 배치할 슬롯 인덱스
   */
  purchaseDrone(typeId, slotIndex) {
    const droneTemplate = this.shop.getDroneTemplate(typeId);
    if (this.user.credits < droneTemplate.price) {
      this.showModal("크레딧이 부족합니다.");
      return;
    }

    const newDrone = new Drone(droneTemplate);
    this.slots[slotIndex].setDrone(newDrone);
    this.user.credits -= droneTemplate.price;
    this.selectedSlotIndex = null;
    this.updateView();
  }

  /**
   * UI 업데이트
   * 슬롯 상태가 변경될 때마다 호출되어 화면을 갱신
   */
  updateView() {
    this.view.renderSlots(
      this.slots,
      (index) => this.handleSlotClick(index),
      (index) => this.handleSellClick(index)
    );
  }

  /**
   * 드론 판매 버튼 클릭 핸들러
   * @param {number} index - 판매할 드론이 있는 슬롯의 인덱스
   */
  handleSellClick(index) {
    const slot = this.slots[index];
    if (slot && slot.isOccupied) {
      const drone = slot.removeDrone();
      // 드론 가격의 50%를 환불
      const refund = Math.floor(drone.price * 0.5);
      User.AddCredits(refund);
      this.updateView();
    }
  }
}
